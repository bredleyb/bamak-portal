# RFC v2 — Especificação do Portal Bamak para o PAC VIII

## Metadados

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak |
| Parceiro externo | Bamak Equipamentos LTDA |
| Linha | Web Apps |
| Autor | Bredley Bauer |
| Fase anterior | PAC VII concluído |
| Fase atual | PAC VIII — planejamento, desenvolvimento e validação |
| Status deste documento | Especificação vigente, sujeita a revisão e validação |
| Revisão editorial | 17/10/2026 — harmonização de referências RF/RNF com o cadastro de requisitos, preservando o escopo definido |
| Repositório | `bredleyb/bamak-portal` |

## 1. Finalidade

Esta RFC consolida a especificação refinada do Portal Bamak durante o planejamento e a execução do PAC VIII.

O documento registra a evolução da concepção aprovada no PAC VII. Os artefatos do PAC VII permanecem preservados como registro histórico da fase em que foram produzidos. As decisões posteriores integram a documentação do PAC VIII.

A RFC orienta:

- detalhamento de requisitos;
- arquitetura revisada;
- protótipos públicos e administrativos;
- implementação do frontend, backend e banco;
- testes e revisão por pares;
- validação funcional com a Bamak;
- preparação da release final.

O planejamento acadêmico, as datas e os recortes avaliativos do PAC VIII devem ser consultados nas orientações vigentes da disciplina. Esta RFC define o escopo do produto, sem substituir o planejamento avaliativo.

## 2. Fontes e referência da especificação

A RFC consolida decisões registradas nos seguintes artefatos:

- `docs/pac-vii/`: histórico aprovado da concepção;
- `docs/pac-viii/01-alinhamento/registro-bamak.md`;
- `docs/pac-viii/01-alinhamento/levantamento-presenca-digital-atendimento.md`;
- `docs/pac-viii/02-escopo/mudancas-pac-vii-para-pac-viii.md`;
- projeto mestre atualizado;
- diretrizes do PAC VII, PAC VIII e linha Web Apps.

Em caso de divergência entre propostas anteriores e esta RFC, prevalece a especificação de escopo aqui registrada até que uma alteração seja formalmente documentada e validada. **Os identificadores RF/RNF canônicos e seus critérios de aceite constam de [Requisitos, user stories, fluxos e métricas](../03-requisitos/requisitos-user-stories-fluxos-metricas.md).** Os quadros de escopo desta RFC referenciam esse cadastro, que deve ser consultado ao identificar telas, Issues, implementação e testes. O histórico do PAC VII continua válido para representar o que foi aprovado naquela fase.

## 3. Contexto

A Bamak atua principalmente por indicação de agricultores e empresas clientes, relacionamento direto e contatos comerciais por WhatsApp, telefone e e-mail. Visitas presenciais ocorrem de forma ocasional, especialmente em demandas de Cabo Aéreo e com clientes que já possuem relação com a empresa.

A presença digital atual é composta por:

- site institucional pequeno e estático;
- Facebook e Instagram usados principalmente como vitrine;
- contatos ocasionais originados por canais digitais;
- ausência de equipe dedicada ao site e às redes sociais;
- publicações sem planejamento recorrente.

O site atual possui três páginas principais: Página Inicial, Nossa História e Contate-nos. Ele apresenta a empresa de forma limitada, sem catálogo estruturado, área de Aplicações, fluxo próprio para Cabo Aéreo, FAQ, Comunicação ou coleta contextualizada de solicitações.

## 4. Problema

A Bamak não possui uma estrutura digital capaz de reunir, em um percurso coerente:

- apresentação institucional;
- aplicações atendidas;
- produtos;
- conteúdo público atualizado;
- dúvidas frequentes;
- contato geral;
- solicitação estruturada de Cabo Aéreo;
- acompanhamento interno das entradas recebidas pelo portal.

A falta dessa estrutura reduz a utilidade do site para pessoas que pesquisam a empresa antes de iniciar contato e mantém o início do atendimento dependente de mensagens pouco contextualizadas.

## 5. Objetivo geral

Desenvolver um portal web institucional-comercial que organize a presença digital da Bamak, apresente sua atuação e seus produtos, permita o início de contatos por meios digitais e forneça ao escritório uma operação administrativa simples para acompanhar solicitações e conteúdos controlados.

## 6. Objetivos específicos

- Apresentar a Bamak, sua trajetória, suas aplicações e seus produtos.
- Criar uma navegação pública orientada à consulta e ao início do contato.
- Disponibilizar catálogo consultivo sem recursos transacionais.
- Manter um formulário geral para contatos simples.
- Criar fluxo específico para solicitações de Cabo Aéreo.
- Estruturar os dados de Cabo Aéreo em uma ficha interna.
- Gerar um PDF a partir da ficha interna.
- Armazenar o PDF junto ao atendimento.
- Permitir o envio do PDF ao e-mail da empresa.
- Disponibilizar painel administrativo com perfis Administrador e Operador.
- Gerenciar conteúdos limitados da área de Comunicação.
- Atender aos requisitos técnicos da linha Web Apps.
- Produzir evidências de testes, QA por pares e validação com a Bamak.

## 7. Papel do portal

O Portal Bamak participa de três momentos:

1. **Descoberta:** visitante conhece a empresa e entende sua atuação.
2. **Consulta:** visitante acessa Aplicações, Catálogo, FAQ e Comunicação.
3. **Início do atendimento:** visitante envia contato geral ou solicitação de Cabo Aéreo.

A continuidade comercial e técnica ocorre por WhatsApp, telefone ou e-mail, sob responsabilidade da equipe da Bamak.

O portal não acompanha todo o processo de orçamento, negociação, fabricação, instalação ou pós-venda.

## 8. Públicos e perfis

### 8.1 Visitante

Pessoa que acessa a área pública para:

- conhecer a Bamak;
- consultar aplicações;
- procurar produtos;
- verificar informações institucionais;
- ler notícias, agenda ou comunicados;
- esclarecer dúvidas;
- iniciar contato;
- enviar solicitação de Cabo Aéreo.

O visitante não precisa de conta.

### 8.2 Administrador

Perfil com acesso a:

- Painel;
- Atendimentos;
- Comunicação;
- Configurações;
- gestão de usuários e permissões;
- consulta de anexos;
- geração, armazenamento e envio de PDFs;
- alteração dos estados de atendimento;
- publicação e manutenção de conteúdos permitidos.

### 8.3 Operador

Perfil voltado à rotina operacional, com acesso a:

- Painel;
- Atendimentos;
- consulta de anexos;
- visualização da ficha de Cabo Aéreo;
- geração, armazenamento e envio de PDFs;
- alteração dos estados permitidos.

O Operador não gerencia usuários nem configurações críticas. O acesso à Comunicação poderá ser concedido por permissão, caso a validação com a Bamak indique essa necessidade.

## 9. Navegação pública

| Ordem | Área | Função |
|---:|---|---|
| 1 | Home | Apresentar a empresa e distribuir o visitante para as áreas principais. |
| 2 | Institucional | Reunir história, atuação, estrutura e elementos de credibilidade. |
| 3 | Aplicações | Explicar contextos em que produtos e soluções da Bamak são utilizados. |
| 4 | Catálogo | Permitir consulta a produtos, categorias e detalhes. |
| 5 | Cabo Aéreo | Explicar a aplicação e receber uma solicitação estruturada. |
| 6 | FAQ | Responder dúvidas frequentes antes do contato. |
| 7 | Comunicação | Reunir notícias, agenda, eventos, feiras e comunicados. |
| 8 | Contato | Exibir canais diretos e formulário geral. |

Páginas de detalhe poderão existir como rotas derivadas de Aplicações, Catálogo e Comunicação.

## 10. Navegação administrativa

| Ordem | Área | Função |
|---:|---|---|
| 1 | Painel | Exibir resumo operacional e acessos rápidos. |
| 2 | Atendimentos | Reunir contatos gerais e solicitações de Cabo Aéreo. |
| 3 | Comunicação | Manter conteúdos públicos previstos para essa área. |
| 4 | Configurações | Gerenciar usuários, permissões e ajustes essenciais. |

A estrutura das páginas institucionais, Aplicações, Catálogo, FAQ e Cabo Aéreo será mantida tecnicamente na primeira versão. O painel não será um CMS estrutural completo.

## 11. Fluxos de negócio completos

### FL-01 — Descoberta e contato geral

1. Visitante acessa a Home.
2. Visitante consulta Institucional, Aplicações, Catálogo, FAQ ou Comunicação.
3. Visitante acessa Contato.
4. Visitante preenche nome, meio de contato, assunto, mensagem e consentimento.
5. Sistema valida os campos.
6. Sistema registra a solicitação.
7. Solicitação aparece em Atendimentos.
8. Equipe consulta a mensagem.
9. Equipe continua o contato por canal humano.

**Resultado:** contato geral registrado e disponível para atendimento.

### FL-02 — Solicitação de Cabo Aéreo

1. Visitante acessa Cabo Aéreo.
2. Visitante consulta a explicação da aplicação.
3. Visitante inicia a solicitação.
4. Visitante informa contato e contexto da necessidade.
5. Visitante pode marcar o local em mapa ou descrevê-lo em texto.
6. Visitante anexa evidências permitidas.
7. Visitante aceita o consentimento para tratamento dos dados.
8. Sistema valida e registra a solicitação.
9. Painel exibe a ficha interna estruturada.
10. Administrador ou Operador consulta os dados e anexos.
11. Usuário autorizado gera um PDF.
12. Sistema armazena o PDF junto ao atendimento.
13. Usuário autorizado pode enviar o PDF ao e-mail da empresa.
14. Equipe continua o atendimento por WhatsApp, telefone ou e-mail.

**Resultado:** solicitação organizada para análise humana, com ficha interna e PDF.

### FL-03 — Publicação em Comunicação

1. Administrador acessa o painel.
2. Administrador abre Comunicação.
3. Administrador cria ou edita um conteúdo.
4. Sistema valida título, tipo, conteúdo, datas e status.
5. Administrador salva como rascunho ou publica.
6. Conteúdo publicado aparece na área pública.
7. Administrador pode editar, ocultar ou encerrar a publicação.

**Resultado:** conteúdo institucional controlado publicado sem alteração manual no código.

## 12. Escopo funcional da primeira versão

### 12.1 Área pública

- Home.
- Institucional.
- Aplicações e páginas de detalhe quando previstas.
- Catálogo e detalhe de produto.
- Cabo Aéreo.
- FAQ.
- Comunicação e detalhe de conteúdo.
- Contato.
- Navegação responsiva.
- Busca e filtros onde aplicáveis.
- estados de carregamento, sucesso, vazio e erro.
- links para e-mail, WhatsApp, Facebook e Instagram.

### 12.2 Contato geral

- Formulário simples.
- Nome.
- E-mail e/ou telefone.
- Assunto.
- Mensagem.
- Checkbox explícito de consentimento.
- Validação de campos.
- Confirmação de envio.
- Registro no painel.
- Notificação operacional por e-mail quando configurada.

### 12.3 Cabo Aéreo

- Conteúdo explicativo.
- Formulário em etapas ou blocos.
- Dados de contato.
- Contexto da instalação.
- Descrição textual.
- Localização por mapa opcional.
- Alternativa textual ao mapa.
- Anexos.
- Consentimento explícito.
- Ficha interna.
- Consulta de anexos.
- Geração de PDF.
- Armazenamento do PDF.
- Envio do PDF ao e-mail da empresa.
- estado de atendimento.

### 12.4 Catálogo

- Listagem de produtos.
- Busca textual.
- Categorias e filtros.
- Ordenação, quando pertinente.
- Paginação ou carregamento progressivo.
- Detalhe de produto.
- Relação com Aplicações.
- CTA para contato.
- Conteúdo sem preço obrigatório.

### 12.5 Comunicação

- Tipos de conteúdo: notícia, agenda, evento, feira ou comunicado.
- Criação e edição.
- Rascunho e publicação.
- Data de publicação.
- Data de evento quando aplicável.
- Listagem pública.
- Página de detalhe.
- Ocultação ou encerramento.

### 12.6 Painel e Atendimentos

- Login.
- Resumo de entradas.
- Listagem de atendimentos.
- Filtros por tipo, estado e período.
- Diferenciação entre contato geral e Cabo Aéreo.
- Visualização de detalhes.
- Consulta de anexos.
- Ficha de Cabo Aéreo.
- Geração e armazenamento de PDF.
- Envio de PDF por e-mail.
- estados básicos de atendimento.
- registro de data de criação e atualização.

### 12.7 Configurações

- Usuários.
- Perfil Administrador ou Operador.
- Ativação e desativação de acesso.
- alteração de senha.
- parâmetros essenciais de e-mail.
- ajustes operacionais estritamente necessários.

## 13. Fora de escopo

- E-commerce.
- Carrinho.
- Checkout.
- Pagamento online.
- Cálculo de frete.
- Orçamento automático.
- Cálculo técnico de Cabo Aéreo.
- Cálculo de rota, distância, desnível ou viabilidade.
- CRM.
- ERP.
- Funil de vendas.
- Lead scoring.
- Carteira comercial.
- Área privada do cliente.
- CMS completo.
- Chatbot.
- Automação de negociação.
- Atendimento automático.
- Relatório técnico privado para o cliente.
- Aplicativo mobile nativo.
- Integração com sistemas internos não definidos.
- Processamento de áudio ou vídeo na primeira versão.

## 14. Requisitos funcionais

As responsabilidades funcionais abaixo preservam o escopo do produto e apontam para os IDs do cadastro de requisitos detalhados. Algumas responsabilidades abrangem diversos requisitos ou regras de negócio; a correspondência é indicada por área e comportamento.

### 14.1 Área pública

| Área | Responsabilidade de escopo | Referência canônica |
|---|---|---|
| Home | Exibir Home com apresentação sintética e CTAs para as áreas principais. | RF-PUB-01, RF-PUB-02 e RF-PUB-03 |
| Institucional | Exibir página Institucional com trajetória, atuação e credibilidade da Bamak. | RF-INS-01 a RF-INS-03 |
| Aplicações | Listar Aplicações e permitir acesso aos respectivos detalhes. | RF-APL-01 a RF-APL-03 |
| Catálogo — listagem | Listar produtos no Catálogo com busca e filtros. | RF-CAT-01 a RF-CAT-03 |
| Catálogo — detalhe | Exibir detalhe de produto com descrição, aplicação e CTA para contato. | RF-CAT-04 e RF-CAT-05 |
| FAQ | Exibir FAQ organizada para consulta rápida. | RF-FAQ-01 a RF-FAQ-03 |
| Comunicação — listagem | Exibir conteúdos publicados em Comunicação. | RF-COM-01, RF-COM-02 e RF-COM-04 |
| Comunicação — detalhe | Exibir página de detalhe dos conteúdos de Comunicação. | RF-COM-03 |
| Contato — canais | Exibir canais de e-mail, WhatsApp, Facebook e Instagram. | RF-CON-01 |
| Responsividade | Adaptar navegação e conteúdo para desktop e dispositivos móveis. | RNF-20 e RNF-21 |

### 14.2 Contato geral

| Área | Responsabilidade de escopo | Referência canônica |
|---|---|---|
| Dados do contato | Receber nome, contato, assunto e mensagem. | RF-CON-02 |
| Consentimento | Exigir consentimento explícito antes do envio. | RF-CON-03 |
| Validação | Validar os campos no frontend e no backend. | RNF-15 e RNF-21 |
| Registro | Registrar a solicitação no banco. | RF-CON-04 |
| Confirmação | Exibir confirmação após o envio. | RF-CON-05 |
| Acompanhamento interno | Disponibilizar a solicitação na área de Atendimentos. | RF-ATE-01 e RF-ATE-03 |
| Notificação institucional | Permitir notificação da empresa por e-mail. | RF-CON-06 |

### 14.3 Cabo Aéreo

| Área | Responsabilidade de escopo | Referência canônica |
|---|---|---|
| Apresentação | Exibir conteúdo explicativo antes do formulário. | RF-CAB-01 |
| Solicitação | Receber dados de contato e contexto da instalação. | RF-CAB-02 |
| Localização textual | Permitir descrição textual da localização. | RF-CAB-03 e RNF-27 |
| Mapa opcional | Permitir marcação opcional em mapa Leaflet com OpenStreetMap. | RF-CAB-04 |
| Imagens | Receber imagens JPG, PNG e WebP. | RF-CAB-05 |
| Limites de anexo | Limitar a cinco anexos de até 10 MB cada. | RF-CAB-05 e RF-CAB-06 |
| Consentimento | Exigir consentimento explícito. | RF-CAB-07 |
| Registro | Registrar a solicitação e seus anexos. | RF-CAB-08 |
| Ficha interna | Exibir ficha interna estruturada no painel. | RF-ATE-06 |
| Gerar PDF | Permitir geração de PDF a partir da ficha. | RF-ATE-07 |
| Armazenar PDF | Armazenar o PDF junto ao atendimento. | RF-ATE-08 |
| Enviar PDF | Permitir envio do PDF ao e-mail da empresa. | RF-ATE-09 |
| Auditoria de envio | Registrar resultado, data e responsável pelo envio do PDF. | RF-ATE-09 |
| Restrição ao visitante | Manter o cliente fora de qualquer área privada ou relatório interno. | RN-05 e RN-07 |

### 14.4 Administração

| Área | Responsabilidade de escopo | Referência canônica |
|---|---|---|
| Autenticação | Autenticar usuários administrativos. | RF-ADM-01 |
| Autorização | Autorizar recursos conforme perfil Administrador ou Operador. | RF-ADM-03 |
| Painel | Exibir resumo operacional no Painel. | RF-PAI-01 a RF-PAI-03 |
| Listagem | Listar atendimentos gerais e de Cabo Aéreo. | RF-ATE-01 |
| Filtros | Filtrar atendimentos por tipo, estado e período. | RF-ATE-02 |
| Detalhe e documentos | Exibir dados, anexos e documentos associados ao atendimento. | RF-ATE-03, RF-ATE-05, RF-ATE-06 e RF-ATE-08 |
| Estados de atendimento | Permitir atualização de estados básicos. | RF-ATE-04 |
| Comunicação administrativa | Permitir ao Administrador gerenciar conteúdos de Comunicação. | RF-CMA-01 a RF-CMA-05 |
| Usuários e perfis | Permitir ao Administrador gerenciar usuários e acessos. | RF-CFG-01 a RF-CFG-03 |
| Datas e responsáveis | Registrar datas de criação e alteração das entidades principais. | RF-ATE-04 e RF-ATE-09; registros do domínio |

## 15. User stories principais

| ID | User story | Critério de conclusão |
|---|---|---|
| US-01 | Como visitante, quero entender o que a Bamak faz para decidir se a empresa atende minha necessidade. | Institucional e Aplicações apresentam informação suficiente e CTAs coerentes. |
| US-02 | Como visitante, quero procurar produtos para verificar se existe uma oferta relacionada à minha demanda. | Catálogo permite busca, filtro e acesso ao detalhe. |
| US-03 | Como visitante, quero enviar uma mensagem geral para iniciar uma conversa com a Bamak. | Formulário validado registra o contato e confirma o envio. |
| US-04 | Como interessado em Cabo Aéreo, quero informar o contexto e anexar evidências para preparar a análise da empresa. | Solicitação registra dados, localização opcional, anexos e consentimento. |
| US-05 | Como Operador, quero localizar solicitações recebidas para iniciar o atendimento. | Painel lista e filtra contatos gerais e Cabo Aéreo. |
| US-06 | Como Operador, quero consultar uma ficha organizada para evitar reconstruir os dados a partir de mensagens dispersas. | Ficha interna apresenta dados e anexos em uma única tela. |
| US-07 | Como Operador, quero gerar e enviar um PDF da ficha para disponibilizá-lo ao escritório. | PDF é gerado, armazenado e enviado com registro do resultado. |
| US-08 | Como Administrador, quero publicar notícias e agenda para manter a presença digital atualizada. | Conteúdo pode ser salvo, publicado, editado e ocultado. |
| US-09 | Como Administrador, quero controlar usuários e perfis para restringir funções administrativas. | Usuários recebem perfil e somente acessam ações autorizadas. |
| US-10 | Como Bamak, quero manter o atendimento por canais humanos para preservar a forma real de operação da empresa. | Portal registra e organiza a entrada sem conduzir negociação automática. |

## 16. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | O Catálogo é exclusivamente consultivo. |
| RN-02 | O portal não calcula preço, orçamento ou viabilidade técnica. |
| RN-03 | O mapa do Cabo Aéreo é opcional e possui alternativa textual. |
| RN-04 | O mapa não calcula rota, distância, desnível ou condições do terreno. |
| RN-05 | O cliente não recebe o PDF interno pelo portal. |
| RN-06 | O PDF permanece associado ao atendimento que o originou. |
| RN-07 | Somente usuário autenticado e autorizado pode consultar anexos e PDFs. |
| RN-08 | Administrador gerencia usuários e Configurações. |
| RN-09 | Operador atua sobre Atendimentos conforme permissões definidas. |
| RN-10 | Conteúdos de Comunicação somente aparecem na área pública quando publicados. |
| RN-11 | O contato geral e o Cabo Aéreo são entradas distintas. |
| RN-12 | A continuidade do atendimento ocorre por WhatsApp, telefone ou e-mail. |
| RN-13 | A manutenção estrutural do portal é técnica na primeira versão. |
| RN-14 | Dados usados em documentação e protótipos devem ser fictícios ou anonimizados. |

## 17. Arquitetura

### 17.1 Estilo

Arquitetura cliente-servidor em camadas, com separação entre:

- aplicação web;
- API;
- banco relacional;
- armazenamento de objetos;
- serviço de e-mail;
- serviços de observabilidade.

### 17.2 Stack

| Camada | Tecnologia prevista |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |
| Mapa | Leaflet + OpenStreetMap |
| Armazenamento de arquivos | Serviço compatível com S3 |
| CI/CD | GitHub Actions |
| Análise estática | SonarCloud |
| Observabilidade | logs estruturados, healthcheck e Sentry |
| Deploy | ambiente público conteinerizado; provedor, infraestrutura e ativação documentados no PAC VIII |

### 17.3 Containers

```text
Visitante / Administrador / Operador
                |
                v
        Aplicação Web Next.js
                |
                v
          API NestJS
       /        |        \
      v         v         v
PostgreSQL   Storage S3   Serviço de e-mail
                |
                v
         Arquivos e PDFs

Frontend, API e serviços
        |
        v
Logs + healthcheck + Sentry
```

### 17.4 Responsabilidades

**Frontend**

- renderizar área pública e painel;
- controlar navegação e estados de interface;
- validar formulários no cliente;
- consumir a API;
- restringir rotas administrativas na interface;
- integrar mapa e upload.

**Backend**

- autenticar e autorizar;
- validar entradas;
- aplicar regras de negócio;
- persistir solicitações e conteúdos;
- controlar anexos;
- gerar PDF;
- enviar e-mail;
- registrar eventos relevantes;
- expor healthcheck.

**Banco**

- usuários e perfis;
- conteúdos de Comunicação;
- Aplicações e produtos;
- FAQ;
- contatos gerais;
- solicitações de Cabo Aéreo;
- referências de anexos;
- referências de PDFs;
- estados e datas.

**Storage**

- imagens anexadas;
- documentos gerados;
- acesso controlado por URLs temporárias ou mecanismo equivalente.

## 18. Entidades principais

| Entidade | Função |
|---|---|
| User | Usuário administrativo. |
| Role | Perfil Administrador ou Operador. |
| Application | Aplicação apresentada na área pública. |
| Product | Produto do Catálogo. |
| ProductCategory | Categoria de produto. |
| FaqItem | Pergunta e resposta. |
| CommunicationPost | Notícia, agenda, evento, feira ou comunicado. |
| GeneralContact | Formulário geral. |
| CablewayRequest | Solicitação de Cabo Aéreo. |
| Attachment | Arquivo associado à solicitação. |
| GeneratedDocument | PDF produzido a partir da ficha. |
| AttendanceStatus | Estado do atendimento. |

O modelo detalhado será definido na arquitetura e no schema Prisma durante o PAC VIII.

## 19. Requisitos não funcionais

As diretrizes desta seção mantêm as obrigações técnicas e acadêmicas da solução. **Os códigos RNF indicados na terceira coluna são os identificadores canônicos** do documento de requisitos detalhados, cuja redação inclui critérios e evidências de aceite.

### 19.1 Qualidade e manutenção

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| Tipagem estrita | Frontend e backend devem usar TypeScript com verificação estrita. | RNF-01 |
| Modularidade | Código deve ser modular e separar responsabilidades. | RNF-02 |
| Reutilização de componentes | Componentes de interface devem ser reutilizáveis. | RNF-02 |
| Módulos da API | API deve organizar módulos por domínio. | RNF-02 |
| Migrações versionadas | Migrações do banco devem ser versionadas. | RNF-03 |
| Ambiente Docker | Ambiente local e de entrega deve ser padronizado com Docker. | RNF-04 |

### 19.2 Testes

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| Cobertura unitária do backend | Backend deve alcançar pelo menos 75% de cobertura unitária. | RNF-05 |
| Cobertura unitária do frontend | Frontend deve alcançar pelo menos 25% de cobertura unitária. | RNF-06 |
| Desenvolvimento orientado a testes | Regras centrais devem ser desenvolvidas com prática de TDD quando aplicável. | RNF-07 |
| Integração e ponta a ponta | Fluxos críticos devem possuir testes de integração ou ponta a ponta. | RNF-08 |
| Testes automatizados nos PRs | Pull requests devem executar testes automaticamente. | RNF-09 |

### 19.3 Segurança

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| HTTPS em produção | Ambiente público deve usar HTTPS. | RNF-12 |
| Proteção de senhas | Senhas devem ser armazenadas com hash seguro. | RNF-13 |
| Autorização administrativa | Rotas administrativas devem exigir autenticação e autorização. | RNF-14 |
| Validação das entradas | Entradas devem ser validadas no frontend e backend. | RNF-15 |
| Validação de anexos | Uploads devem validar formato, tamanho e quantidade. | RNF-16 |
| Acesso privado a arquivos | Arquivos privados não devem possuir URL pública permanente. | RNF-17 |
| Limitação de requisições | API deve aplicar rate limiting nos formulários públicos. | RNF-18 |
| Proteção de segredos | Segredos devem ser mantidos fora do repositório. | RNF-19 |
| Verificação de dependências | Dependências devem ser verificadas no pipeline. | RNF-26 |

### 19.4 Usabilidade e acessibilidade

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| Responsividade | Interface deve ser responsiva. | RNF-20 |
| Erros de formulário | Formulários devem indicar campos obrigatórios e erros específicos. | RNF-21 |
| Estados de operação | Ações devem exibir estados de carregamento, sucesso e falha. | RNF-22 |
| Navegação por teclado | Navegação deve funcionar por teclado nas interações principais. | RNF-21 |
| Contraste e foco | Contraste, foco visível e textos alternativos devem ser tratados no guia visual. | RNF-21 |
| Mapa acessível por texto | Mapa deve possuir alternativa textual equivalente. | RNF-27 |

### 19.5 Desempenho e disponibilidade

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| Carregamento eficiente | Páginas públicas devem priorizar carregamento eficiente de imagens e conteúdo. | RNF-23 |
| Paginação e listagens | Listagens devem usar paginação ou carregamento controlado. | RNF-23 |
| Healthcheck da API | API deve expor endpoint de healthcheck. | RNF-11 |
| Logs e monitoramento | Falhas relevantes devem ser registradas em logs e enviadas ao Sentry. | RNF-11 |
| Disponibilidade pública | Aplicação deve estar acessível publicamente para avaliação e Demo Day. | RNF-25 |

### 19.6 Entrega e análise

| Critério | Diretriz da RFC | Referência canônica |
|---|---|---|
| Pipeline de integração | GitHub Actions deve executar lint, testes e build. | RNF-09 |
| Análise estática e segurança | SonarCloud deve analisar qualidade e segurança do código. | RNF-10 |
| Deploy por pipeline | Deploy deve ocorrer por pipeline automatizado. | RNF-24 |
| Restrições ao deploy manual | Deploy manual por FTP ou SSH não será usado como processo de entrega. | RNF-28 |
| Camadas próprias da solução | Frontend e backend próprios devem permanecer identificáveis na arquitetura. | RNF-29 |

## 20. Privacidade e LGPD

### 20.1 Consentimento

O formulário geral e o formulário de Cabo Aéreo devem exigir checkbox explícito de consentimento.

O texto de interface deverá indicar:

- quais dados serão enviados;
- finalidade do uso;
- que a Bamak utilizará os dados para responder à solicitação;
- que o atendimento continuará por canais humanos;
- acesso à política de privacidade.

O envio deve permanecer bloqueado enquanto o consentimento obrigatório não for marcado.

### 20.2 Minimização

Cada formulário deve coletar somente dados necessários ao respectivo objetivo.

O contato geral terá menos campos que o Cabo Aéreo.

### 20.3 Acesso

- Solicitações, anexos e PDFs ficam restritos a usuários autenticados.
- Permissões seguem o perfil administrativo.
- URLs de arquivos devem ser temporárias ou protegidas.
- Informações sensíveis não devem aparecer em logs.

### 20.4 Retenção

Solicitações e anexos serão mantidos enquanto necessários ao atendimento e poderão ser excluídos por usuário autorizado.

O prazo definitivo de retenção será validado antes da publicação em produção.

### 20.5 Repositório e documentação

Não devem ser versionados:

- nomes reais de clientes;
- telefones e e-mails pessoais;
- endereços e coordenadas reais;
- fotos privadas;
- prints de conversas;
- anexos recebidos;
- documentos comerciais;
- chaves, tokens ou variáveis de ambiente reais.

Protótipos, testes e documentação devem usar dados fictícios ou anonimizados.

## 21. Anexos do Cabo Aéreo

Regras iniciais:

| Regra | Valor |
|---|---|
| Formatos aceitos | JPG, PNG e WebP |
| Quantidade máxima | 5 arquivos |
| Tamanho máximo | 10 MB por arquivo |
| Áudio | Fora da primeira versão |
| Vídeo | Fora da primeira versão |
| PDF enviado pelo cliente | Fora da primeira versão |
| Armazenamento | Serviço compatível com S3 |
| Acesso | Restrito ao painel |

Esses limites poderão ser reduzidos após testes de infraestrutura e usabilidade.

## 22. Métricas de validação

| Métrica | Meta inicial | Evidência |
|---|---:|---|
| Conclusão das tarefas públicas por usuários-teste | ≥ 80% | roteiro e registro dos testes |
| Envio válido do Cabo Aéreo | 100% dos campos obrigatórios validados | testes funcionais |
| Localização de uma solicitação no painel | concluída sem auxílio | teste com usuário administrativo |
| Consulta da ficha e anexos | concluída sem erro | teste funcional |
| Geração do PDF | concluída sem erro | teste funcional e arquivo gerado |
| Armazenamento do PDF | documento associado ao atendimento correto | teste de integração |
| Envio do PDF por e-mail | concluído e registrado | teste funcional |
| Utilidade percebida pela Bamak | média ≥ 4 de 5 | formulário de validação |
| Problemas críticos nos três fluxos | 0 antes da release | issues e relatório de QA |
| Cobertura unitária do backend | ≥ 75% | relatório do pipeline |
| Cobertura unitária do frontend | ≥ 25% | relatório do pipeline |
| Pipeline da branch principal | aprovado | GitHub Actions |
| Análise estática | sem bloqueio de quality gate | SonarCloud |

As métricas de negócio, como aumento de vendas ou quantidade de novos clientes, ficam fora da validação acadêmica inicial porque ainda não existe base quantitativa confiável.

## 23. Validação

As atividades de especificação, prototipação, desenvolvimento, QA e validação pertencem integralmente ao PAC VIII. A organização a seguir representa frentes de trabalho, não fases acadêmicas adicionais.

### 23.1 Planejamento, especificação e prototipação

- revisão interna da RFC;
- protótipos de alta fidelidade visual (hi-fi), consolidados no PAC VIII a partir da concepção e dos wireframes históricos do PAC VII;
- validação da navegação;
- validação do Cabo Aéreo;
- validação do painel;
- validação dos limites com a Bamak.

### 23.2 Implementação, QA e validação funcional

- pull requests;
- code review por pares;
- testes cruzados;
- issues de bugs;
- demonstrações funcionais para a Bamak;
- registro de feedback;
- correções;
- release;
- termo de aceite ou declaração de encerramento;
- apresentação no Demo Day.

## 24. Critérios de aceite da solução

A solução desenvolvida no PAC VIII estará apta à avaliação de aceite quando:

- as oito áreas públicas estiverem funcionais;
- os três fluxos de negócio estiverem completos;
- contato geral e Cabo Aéreo gerarem registros distintos;
- a ficha de Cabo Aéreo estiver disponível no painel;
- anexos puderem ser consultados por usuário autorizado;
- PDF puder ser gerado, armazenado e enviado;
- Administrador e Operador tiverem permissões coerentes;
- Comunicação puder ser publicada pelo painel;
- aplicação estiver hospedada publicamente;
- pipeline, testes, análise estática e observabilidade estiverem ativos;
- métricas técnicas mínimas forem atendidas;
- problemas críticos estiverem resolvidos;
- Bamak validar a versão funcional;
- entrega final possuir documentação e evidências.

## 25. Decisões e confirmações a acompanhar

Os pontos a seguir devem ter seu estado confirmado e documentado ao longo do PAC VIII. Alguns podem ter sido definidos após a elaboração original da RFC; sua permanência nesta relação não significa, por si só, que continuam em aberto. As decisões efetivas devem constar dos requisitos, registros técnicos, Issues ou evidências de validação:

- nome definitivo da ficha e do PDF;
- campos finais do Cabo Aéreo;
- estados definitivos de Atendimentos;
- permissões detalhadas do Operador;
- taxonomia final de Aplicações;
- categorias e filtros finais do Catálogo;
- tipos de conteúdo ativos em Comunicação;
- confirmação do provedor e do ambiente de deploy;
- fornecedor de storage S3;
- serviço de e-mail;
- biblioteca de geração de PDF;
- prazo definitivo de retenção;
- regras de exclusão e anonimização em produção;
- alinhamento entre prioridades de implementação, cronograma e critérios acadêmicos vigentes.

## 26. Síntese da decisão

O Portal Bamak mantém o escopo de solução Web Apps institucional-comercial, com frontend, backend e banco próprios.

A especificação do PAC VIII consolida:

- presença digital organizada;
- navegação pública com oito áreas;
- catálogo consultivo;
- contato geral simples;
- Cabo Aéreo com formulário, mapa opcional e anexos;
- ficha interna;
- geração, armazenamento e envio de PDF;
- painel reduzido;
- perfis Administrador e Operador;
- Comunicação administrável;
- atendimento posterior por pessoas da empresa;
- requisitos técnicos de testes, CI/CD, segurança, análise estática, observabilidade e deploy público.
