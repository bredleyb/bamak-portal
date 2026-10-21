# Modelagem de dominio e contratos da API

## 1. Finalidade

Este documento registra as decisoes tecnicas da Issue #95 do Portal Bamak. Complementa a arquitetura Web Apps e a especificacao de requisitos do PAC VIII.

A modelagem estabelece a base relacional e os contratos internos para os futuros fluxos publicos e administrativos. Nao representa, por si so, a implementacao completa desses fluxos.

## 2. Modelo de dominio

O schema Prisma contem 16 modelos e cinco enumeracoes.

| Dominio | Modelos | Responsabilidade |
|---|---|---|
| Acesso | User | Identidade administrativa, hash de senha, perfil e ativacao |
| Conteudo consultivo | Application, ProductCategory, Product, ProductImage | Aplicacoes, catalogo, categorias e imagens de produtos |
| Conteudo publico | FaqItem, CommunicationPost | FAQ e comunicacoes com estado de publicacao |
| Atendimentos | AttendanceStatus, Attendance, GeneralContact, CablewayRequest | Entrada comum, estado e dados especificos de cada formulario |
| Historico e notificacao | AttendanceStatusChange, ContactNotificationAttempt | Rastreabilidade de estados e tentativas de notificacao |
| Arquivos e documentos | Attachment, GeneratedDocument, DocumentDeliveryAttempt | Metadados privados, versoes de PDF e tentativas de envio |

A relacao entre Application e Product e muitos-para-muitos, com tabela de associacao gerenciada pelo Prisma.

Os campos de identificacao utilizam UUID. Relacoes usam chaves estrangeiras e politicas de exclusao especificas. Dados pessoais de atendimento nao devem ser incluidos em logs publicos nem em fixtures versionadas.

## 3. Decisoes sobre atendimentos

Attendance centraliza o identificador, o tipo, o estado e as datas de entrada.

GeneralContact e CablewayRequest possuem relacoes individuais com Attendance. O campo type identifica a origem do atendimento.

O servico AttendanceSubmissionService grava o atendimento e o formulario relacionado na mesma transacao Prisma. A data do consentimento e definida no servidor, e sua versao e informada por um componente interno de configuracao.

O estado inicial usa o codigo tecnico RECEIVED, com nome Recebido. Ele e inserido por uma migracao versionada. Os demais estados permanecem configuraveis e sujeitos a validacao com a empresa.

Triggers no PostgreSQL impedem que um formulario seja associado a um atendimento de tipo incompatível e bloqueiam alteracoes posteriores do tipo.

A quinta migracao adiciona verificacoes diferidas de integridade. Ao concluir a transacao, cada Attendance precisa possuir exatamente um formulario compativel com seu tipo. Insercoes incompletas e exclusoes indevidas de formularios sao rejeitadas, mesmo quando realizadas diretamente no PostgreSQL. A exclusao do atendimento completo permanece permitida pelas regras relacionais.

## 4. Contratos internos de entrada

O backend utiliza class-validator, class-transformer e ValidationPipe global com transformacao explicita, rejeicao de propriedades desconhecidas e sem conversao implicita de tipos.

### 4.1. Contato Geral

Contrato: CreateGeneralContactDto.

| Campo | Regra |
|---|---|
| name | Texto nao vazio; ate 160 caracteres |
| contactInfo | Texto nao vazio; ate 320 caracteres |
| subject | Texto nao vazio; ate 200 caracteres |
| message | Texto nao vazio; ate 5.000 caracteres |
| consent | Valor booleano true |

### 4.2. Cabo Aereo

Contrato: CreateCablewayRequestDto.

| Campo | Regra |
|---|---|
| contactName | Texto nao vazio; ate 160 caracteres |
| contactInfo | Texto nao vazio; ate 320 caracteres |
| installationContext | Texto nao vazio; ate 5.000 caracteres |
| locationDescription | Texto nao vazio; ate 2.000 caracteres |
| coordinates | Objeto opcional com latitude e longitude |
| consent | Valor booleano true |

As coordenadas devem ser numericas, com ate seis casas decimais. Latitude admite -90 a 90, e longitude -180 a 180. Ambas sao obrigatorias quando o objeto coordinates e fornecido.

Os DTOs nao permitem que o visitante escolha o estado, altere datas de consentimento ou envie metadados internos.

### 4.3. Resposta interna das operacoes

Os metodos de submissao retornam attendanceId e receivedAt.

Esses metodos ainda nao constituem endpoints HTTP publicos. As rotas, o tratamento de erros, o controle de abuso e a interface de confirmacao pertencem a implementacao dos respectivos fluxos.

A validacao backend e a referencia autoritativa. A integracao Web/API devera reutilizar ou derivar o contrato, evitando manter regras conflitantes manualmente.

## 5. Arquivos, privacidade e PDF

Attachment guarda metadados do arquivo e uma chave de armazenamento privado, sem incluir o conteudo binario no PostgreSQL.

O banco aceita somente image/jpeg, image/png e image/webp e bloqueia anexos vazios. O limite adotado e 10.000.000 bytes por imagem (10 MB decimais), conforme a especificacao de produto. O upload real e a Web devem aplicar o mesmo limite.

O limite de cinco imagens por solicitacao e protegido por trigger. A funcao bloqueia o registro da solicitacao durante a insercao, serializando alteracoes concorrentes.

GeneratedDocument registra versoes positivas de documentos e vincula o responsavel pela geracao. DocumentDeliveryAttempt registra tentativas de envio separadamente, sem pressupor sucesso no primeiro envio.

O armazenamento S3, o controle efetivo de acesso aos arquivos, a geracao do PDF e o provedor de e-mail fazem parte de implementacoes posteriores.

## 6. Comunicacao e usuarios

User representa os perfis administrativos por enumeracao, sem tabela Role independente. Senhas devem ser armazenadas exclusivamente como hash; a modelagem nao cria usuarios produtivos com credenciais fixas.

CommunicationPost registra tipo, estado, datas e autoria. Uma restricao SQL exige publishedAt para registros publicados.

A consulta publica devera filtrar exclusivamente os conteudos publicados. A existencia da restricao SQL nao substitui a implementacao desse filtro no servico de leitura.

## 7. Migracoes e ambientes

As migracoes sao versionadas em apps/api/prisma/migrations.

1. initial_domain: entidades, indices, relacionamentos e restricoes SQL.
2. initial_attendance_status: estado inicial RECEIVED.
3. attendance_integrity: triggers de tipos de atendimento e limite de anexos.
4. attachment_size_decimal_mb: limite de 10 MB decimais por imagem.
5. attendance_completeness: integridade obrigatoria dos formularios com gatilhos diferidos.

Os testes locais de migracao e persistencia foram executados em PostgreSQL 17 isolado, com credenciais fora do Git.

O CI esta configurado para iniciar PostgreSQL temporario, aplicar migracoes, executar os testes SQL e habilitar os testes Jest de integracao.

A CI do PR #116 foi aprovada no commit bed5fa3: cinco jobs concluídos, incluindo ambos os Quality Gates do SonarQube e o Actionlint.

**Producao:** a integracao das migracoes ao processo de deploy da VPS exige verificacao previa, estrategia de backup e revisao do procedimento de rollback. Nao se deve presumir que uma reversao de codigo desfaca automaticamente uma migracao de banco.

## 8. Testes e limites da entrega

A validacao contempla testes unitarios de DTOs e servicos, integracao NestJS/Prisma/PostgreSQL, rejeicoes por restricoes SQL, rollback e concorrencia de anexos. Os testes SQL tambem verificam a rejeicao de atendimentos incompletos e de exclusoes indevidas de formularios, acionando as restricoes diferidas antes do rollback final.

O teste SQL utiliza dados ficticios e ROLLBACK. O teste Jest de integracao exige ativacao explicita e verifica o endereco do banco permitido.

Na verificacao de 21/10/2026, os 67 testes foram aprovados em
PostgreSQL 17 isolado. A cobertura local da API atingiu 100% de
instrucoes, 88,46% de ramificacoes, 100% de funcoes e 100% de linhas.
O SonarQube Cloud aprovou o PR #116, com 98,4% de cobertura de
codigo novo e 0,0% de duplicacao na API.

Ainda precisam ser tratados ou validados:

- verificar a mesma regra de 10 MB no upload real e na Web;
- exposicao dos contratos em endpoints e compartilhamento com a Web;
- upload seguro, rate limiting e autorizacao dos fluxos completos;
- manter a CI e os Quality Gates aprovados nas proximas alteracoes;
- publicacao autorizada das migracoes em producao, com verificacao posterior;
- validacao dos estados e campos definitivos com a Bamak.

## 9. Rastreabilidade

- Issue #95: modelo de dominio, migracoes e contratos.
- RNF-01: TypeScript estrito.
- RNF-02: modularidade.
- RNF-03: persistencia relacional e migracoes.
- RNF-15: validacao de entrada.
- RNF-19: protecao de segredos.
- RF-CON-02 a RF-CON-04: contrato e persistencia de contato.
- RF-CAB-02 a RF-CAB-08: contrato, coordenadas, anexos e persistencia.

Referencias: requisitos-user-stories-fluxos-metricas.md e arquitetura-web-apps.md.
