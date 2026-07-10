# Requisitos, user stories, fluxos e métricas

## 1. Finalidade

Este documento detalha a especificação de produto da linha de base do Portal Bamak para orientar prototipação, implementação, testes e validação no PAC VIII.

A RFC v2 permanece como fonte de escopo e decisão. Este artefato concentra elementos rastreáveis e verificáveis:

- requisitos funcionais;
- requisitos não funcionais;
- user stories;
- critérios de aceite;
- fluxos;
- métricas;
- primeira versão;
- pendências;
- melhorias futuras.

## 2. Escopo da primeira versão

A primeira versão deve contemplar:

- Home;
- Institucional;
- Aplicações;
- Catálogo;
- Cabo Aéreo;
- FAQ;
- Comunicação;
- Contato;
- formulário geral;
- solicitação estruturada de Cabo Aéreo;
- mapa opcional;
- anexos de imagem;
- ficha interna no painel;
- geração de PDF;
- armazenamento do PDF;
- envio do PDF ao e-mail da empresa;
- Painel;
- Atendimentos;
- Comunicação administrativa;
- Configurações;
- perfis Administrador e Operador;
- autenticação;
- testes;
- CI/CD;
- análise estática;
- observabilidade;
- deploy público.

## 3. Requisitos funcionais da área pública

### 3.1 Home

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-PUB-01 | Exibir apresentação sintética da Bamak e CTAs para as áreas principais. | Alta | Visitante identifica a empresa e acessa Institucional, Aplicações, Catálogo, Cabo Aéreo ou Contato em até dois cliques. | FL-01 |
| RF-PUB-02 | Destacar os principais contextos de atuação e produtos. | Alta | Blocos públicos conduzem para Aplicações e Catálogo. | FL-01 |
| RF-PUB-03 | Exibir chamadas para contato humano. | Alta | E-mail, WhatsApp e página de Contato ficam acessíveis. | FL-01 |

### 3.2 Institucional

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-INS-01 | Apresentar trajetória, atuação e estrutura da Bamak. | Alta | Conteúdo institucional aparece organizado em blocos escaneáveis. | FL-01 |
| RF-INS-02 | Exibir elementos de credibilidade. | Média | Página apresenta informações aprovadas sobre experiência, atuação e capacidade da empresa. | FL-01 |
| RF-INS-03 | Encaminhar para Aplicações, Catálogo ou Contato. | Média | CTAs funcionam e apontam para rotas existentes. | FL-01 |

### 3.3 Aplicações

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-APL-01 | Listar aplicações atendidas pela Bamak. | Alta | Aplicações aparecem com título, resumo e acesso ao detalhe quando houver. | FL-01 |
| RF-APL-02 | Relacionar aplicações com produtos do Catálogo. | Alta | Detalhe de aplicação apresenta produtos associados ou CTA para Catálogo. | FL-01 |
| RF-APL-03 | Diferenciar contextos de uso sem expor regras comerciais internas. | Alta | Conteúdo informa o contexto sem prometer orçamento ou viabilidade. | FL-01 |

### 3.4 Catálogo

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-CAT-01 | Listar produtos disponíveis para consulta. | Alta | Produtos aparecem com nome, imagem, categoria e resumo. | FL-01 |
| RF-CAT-02 | Permitir busca textual. | Alta | Busca retorna itens compatíveis com nome ou termos relacionados. | FL-01 |
| RF-CAT-03 | Permitir filtros por categoria e aplicação quando disponíveis. | Média | Filtros alteram os itens exibidos sem quebrar a navegação. | FL-01 |
| RF-CAT-04 | Exibir detalhe do produto. | Alta | Página mostra descrição, aplicação e CTA para contato. | FL-01 |
| RF-CAT-05 | Manter comportamento consultivo. | Alta | Não existem carrinho, checkout, preço obrigatório ou compra online. | FL-01 |

### 3.5 Cabo Aéreo

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-CAB-01 | Exibir conteúdo explicativo antes do formulário. | Alta | Visitante entende finalidade, tipo de informação solicitada e continuidade do atendimento. | FL-03 |
| RF-CAB-02 | Receber dados de contato e contexto da instalação. | Alta | Campos obrigatórios são validados no frontend e backend. | FL-03 |
| RF-CAB-03 | Permitir descrição textual da localização. | Alta | Solicitação pode ser enviada sem uso do mapa. | FL-03 |
| RF-CAB-04 | Permitir marcação opcional em mapa Leaflet com OpenStreetMap. | Média | Coordenada pode ser registrada e aparece na ficha interna. | FL-03 |
| RF-CAB-05 | Permitir anexar imagens JPG, PNG e WebP. | Alta | Sistema aceita até cinco imagens de até 10 MB cada. | FL-03 |
| RF-CAB-06 | Bloquear formatos e tamanhos fora das regras. | Alta | Upload inválido exibe erro específico e não é salvo. | FL-03 |
| RF-CAB-07 | Exigir checkbox explícito de consentimento. | Alta | Envio permanece bloqueado sem consentimento. | FL-03 |
| RF-CAB-08 | Registrar a solicitação no banco. | Alta | Atendimento recebe identificador, data, dados e referências de anexos. | FL-03 |
| RF-CAB-09 | Exibir confirmação após o envio. | Alta | Visitante recebe mensagem de sucesso sem acesso à ficha interna. | FL-03 |

### 3.6 FAQ

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-FAQ-01 | Exibir perguntas e respostas organizadas. | Média | Itens podem ser expandidos ou recolhidos. | FL-01 |
| RF-FAQ-02 | Cobrir dúvidas anteriores ao contato. | Alta | Conteúdo esclarece temas de contato, catálogo, atendimento e Cabo Aéreo. | FL-01 |
| RF-FAQ-03 | Encaminhar para Contato quando necessário. | Média | CTA leva ao formulário geral ou canal direto. | FL-01 |

### 3.7 Comunicação

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-COM-01 | Listar conteúdos publicados. | Média | Área mostra somente conteúdos com status publicado. | FL-04 |
| RF-COM-02 | Suportar notícia, agenda, evento, feira e comunicado. | Média | Tipo de conteúdo aparece identificado na listagem e detalhe. | FL-04 |
| RF-COM-03 | Exibir página de detalhe. | Média | Conteúdo publicado possui rota própria. | FL-04 |
| RF-COM-04 | Ordenar por data relevante. | Média | Conteúdos recentes ou eventos próximos aparecem conforme regra definida. | FL-04 |

### 3.8 Contato geral

| ID | Requisito | Prioridade | Critério de aceite | Fluxo |
|---|---|---|---|---|
| RF-CON-01 | Exibir canais de e-mail, WhatsApp, Facebook e Instagram. | Alta | Links externos funcionam. | FL-02 |
| RF-CON-02 | Receber nome, contato, assunto e mensagem. | Alta | Campos obrigatórios são validados. | FL-02 |
| RF-CON-03 | Exigir checkbox explícito de consentimento. | Alta | Envio permanece bloqueado sem consentimento. | FL-02 |
| RF-CON-04 | Registrar a solicitação no banco. | Alta | Contato aparece em Atendimentos como tipo geral. | FL-02 |
| RF-CON-05 | Exibir confirmação após o envio. | Alta | Visitante recebe retorno visual de sucesso ou erro. | FL-02 |
| RF-CON-06 | Permitir notificação da empresa por e-mail. | Média | Sistema registra resultado da tentativa de envio. | FL-02 |

## 4. Requisitos funcionais administrativos

### 4.1 Autenticação e acesso

| ID | Requisito | Prioridade | Critério de aceite | Perfil |
|---|---|---|---|---|
| RF-ADM-01 | Autenticar usuários administrativos. | Alta | Usuário válido entra no painel e usuário inválido recebe erro. | Administrador e Operador |
| RF-ADM-02 | Encerrar sessão. | Alta | Token ou sessão deixa de permitir acesso após logout. | Administrador e Operador |
| RF-ADM-03 | Autorizar ações conforme perfil. | Alta | Operador não acessa gestão de usuários nem configurações críticas. | Administrador e Operador |
| RF-ADM-04 | Permitir alteração de senha. | Média | Usuário autorizado atualiza senha mediante validação. | Administrador e Operador |

### 4.2 Painel

| ID | Requisito | Prioridade | Critério de aceite | Perfil |
|---|---|---|---|---|
| RF-PAI-01 | Exibir resumo de atendimentos. | Alta | Painel mostra totais por tipo e estado. | Administrador e Operador |
| RF-PAI-02 | Exibir entradas recentes. | Alta | Usuário acessa rapidamente os últimos contatos. | Administrador e Operador |
| RF-PAI-03 | Exibir alertas operacionais pertinentes. | Média | Falha de envio de e-mail ou PDF pendente fica visível. | Administrador e Operador |

### 4.3 Atendimentos

| ID | Requisito | Prioridade | Critério de aceite | Perfil |
|---|---|---|---|---|
| RF-ATE-01 | Listar contatos gerais e Cabo Aéreo. | Alta | Tipos aparecem identificados. | Administrador e Operador |
| RF-ATE-02 | Filtrar por tipo, estado e período. | Alta | Filtros retornam resultados coerentes. | Administrador e Operador |
| RF-ATE-03 | Exibir detalhe do atendimento. | Alta | Tela reúne dados, datas, estado e registros relacionados. | Administrador e Operador |
| RF-ATE-04 | Permitir atualização do estado. | Alta | Alteração autorizada é persistida e datada. | Administrador e Operador |
| RF-ATE-05 | Consultar anexos do Cabo Aéreo. | Alta | Arquivos são acessados por mecanismo protegido. | Administrador e Operador |
| RF-ATE-06 | Exibir ficha interna estruturada. | Alta | Dados do Cabo Aéreo aparecem em uma única tela. | Administrador e Operador |
| RF-ATE-07 | Gerar PDF a partir da ficha. | Alta | PDF reproduz os campos previstos e é gerado sem erro. | Administrador e Operador |
| RF-ATE-08 | Armazenar o PDF junto ao atendimento. | Alta | Documento fica associado ao atendimento correto. | Administrador e Operador |
| RF-ATE-09 | Enviar o PDF ao e-mail da empresa. | Alta | Sistema registra data, responsável e resultado do envio. | Administrador e Operador |
| RF-ATE-10 | Permitir reenvio em caso de falha. | Média | Usuário consegue tentar novo envio sem gerar atendimento duplicado. | Administrador e Operador |

### 4.4 Comunicação administrativa

| ID | Requisito | Prioridade | Critério de aceite | Perfil |
|---|---|---|---|---|
| RF-CMA-01 | Criar conteúdo. | Média | Registro pode ser salvo com campos obrigatórios válidos. | Administrador |
| RF-CMA-02 | Editar conteúdo. | Média | Alterações aparecem na versão pública após publicação. | Administrador |
| RF-CMA-03 | Salvar como rascunho. | Média | Conteúdo não aparece na área pública. | Administrador |
| RF-CMA-04 | Publicar conteúdo. | Média | Conteúdo passa a aparecer na área pública. | Administrador |
| RF-CMA-05 | Ocultar ou encerrar publicação. | Média | Conteúdo deixa de aparecer publicamente sem exclusão obrigatória. | Administrador |

### 4.5 Configurações

| ID | Requisito | Prioridade | Critério de aceite | Perfil |
|---|---|---|---|---|
| RF-CFG-01 | Criar usuários administrativos. | Média | Novo usuário recebe perfil e acesso válido. | Administrador |
| RF-CFG-02 | Alterar perfil de usuário. | Média | Permissões passam a seguir o novo perfil. | Administrador |
| RF-CFG-03 | Ativar ou desativar acesso. | Média | Usuário desativado não consegue autenticar. | Administrador |
| RF-CFG-04 | Manter parâmetros essenciais de e-mail. | Média | Configuração válida pode ser testada e salva. | Administrador |

## 5. Requisitos não funcionais

| ID | Requisito | Meta ou regra | Evidência esperada |
|---|---|---|---|
| RNF-01 | TypeScript estrito | Frontend e backend sem erros de tipagem no build. | Pipeline |
| RNF-02 | Modularidade | Domínios separados e componentes reutilizáveis. | Revisão de código |
| RNF-03 | Banco relacional | PostgreSQL com migrações Prisma versionadas. | Repositório e deploy |
| RNF-04 | Ambiente padronizado | Docker para desenvolvimento e entrega. | Arquivos de ambiente |
| RNF-05 | Cobertura backend | Pelo menos 75%. | Relatório do pipeline |
| RNF-06 | Cobertura frontend | Pelo menos 25%. | Relatório do pipeline |
| RNF-07 | TDD | Aplicado às regras centrais quando viável. | Histórico de testes e commits |
| RNF-08 | Testes de fluxo | Fluxos críticos com integração ou ponta a ponta. | Relatório de testes |
| RNF-09 | CI/CD | GitHub Actions executa lint, testes e build. | Pipeline aprovado |
| RNF-10 | Análise estática | SonarCloud sem bloqueio do quality gate. | Dashboard do SonarCloud |
| RNF-11 | Observabilidade | Logs estruturados, healthcheck e Sentry. | Ambiente publicado |
| RNF-12 | HTTPS | Obrigatório em produção. | URL pública |
| RNF-13 | Autenticação segura | Senhas com hash e JWT protegido. | Testes e revisão |
| RNF-14 | Autorização | Rotas protegidas por perfil. | Testes de acesso |
| RNF-15 | Validação de entrada | Frontend e backend. | Testes |
| RNF-16 | Upload seguro | Formato, tamanho e quantidade validados. | Testes de upload |
| RNF-17 | Arquivo privado | URLs temporárias ou mecanismo equivalente. | Teste de acesso |
| RNF-18 | Rate limiting | Aplicado aos formulários públicos. | Teste de API |
| RNF-19 | Segredos protegidos | Ausentes do repositório. | Revisão e pipeline |
| RNF-20 | Responsividade | Fluxos utilizáveis em desktop e mobile. | Teste visual |
| RNF-21 | Acessibilidade | Navegação por teclado, foco visível, contraste e textos alternativos. | Checklist de acessibilidade |
| RNF-22 | Feedback | Carregamento, sucesso, vazio e erro nas ações principais. | Teste funcional |
| RNF-23 | Desempenho | Imagens otimizadas e listagens paginadas ou controladas. | Lighthouse e teste funcional |
| RNF-24 | Deploy automático | Entrega por pipeline. | Histórico do GitHub Actions |
| RNF-25 | Disponibilidade pública | Sistema acessível para avaliação e Demo Day. | URL publicada |

## 6. User stories

### US-01 — Conhecer a empresa

**Como** visitante  
**Quero** entender o que a Bamak faz  
**Para** avaliar se a empresa atende minha necessidade.

**Critérios de aceite**

- Home apresenta a empresa e os principais caminhos.
- Institucional explica trajetória e atuação.
- Aplicações mostram contextos de uso.
- CTAs conduzem para Catálogo, Cabo Aéreo ou Contato.

**Requisitos relacionados:** RF-PUB-01, RF-PUB-02, RF-INS-01, RF-INS-02, RF-APL-01.

**Prioridade:** alta.

### US-02 — Consultar produtos

**Como** visitante  
**Quero** localizar produtos e suas aplicações  
**Para** verificar se existe uma oferta relacionada à minha demanda.

**Critérios de aceite**

- Catálogo possui busca.
- Filtros funcionam quando disponíveis.
- Produto possui página de detalhe.
- CTA conduz para Contato.
- Não existem recursos de compra.

**Requisitos relacionados:** RF-CAT-01 a RF-CAT-05.

**Prioridade:** alta.

### US-03 — Enviar contato geral

**Como** visitante  
**Quero** enviar uma mensagem simples  
**Para** iniciar uma conversa com a Bamak.

**Critérios de aceite**

- Formulário solicita nome, contato, assunto e mensagem.
- Consentimento é obrigatório.
- Dados válidos geram registro no painel.
- Visitante recebe confirmação.
- Atendimento continua por canal humano.

**Requisitos relacionados:** RF-CON-01 a RF-CON-06.

**Prioridade:** alta.

### US-04 — Solicitar análise inicial de Cabo Aéreo

**Como** interessado em Cabo Aéreo  
**Quero** enviar contexto, localização e imagens  
**Para** preparar a análise inicial da empresa.

**Critérios de aceite**

- Visitante entende o objetivo do formulário.
- Local pode ser descrito em texto.
- Mapa é opcional.
- Sistema aceita até cinco imagens válidas.
- Consentimento é obrigatório.
- Solicitação aparece no painel.
- Cliente não recebe a ficha interna.

**Requisitos relacionados:** RF-CAB-01 a RF-CAB-09.

**Prioridade:** alta.

### US-05 — Localizar atendimento

**Como** Operador  
**Quero** localizar uma solicitação recebida  
**Para** iniciar o atendimento sem depender de mensagens dispersas.

**Critérios de aceite**

- Listagem diferencia contato geral e Cabo Aéreo.
- Filtros por tipo, estado e período funcionam.
- Detalhe reúne os dados do atendimento.

**Requisitos relacionados:** RF-ATE-01 a RF-ATE-03.

**Prioridade:** alta.

### US-06 — Consultar ficha e anexos

**Como** Operador  
**Quero** visualizar os dados e evidências do Cabo Aéreo  
**Para** preparar o contato com o cliente.

**Critérios de aceite**

- Ficha apresenta os campos em uma única tela.
- Anexos são acessíveis apenas por usuário autorizado.
- Localização textual ou mapa fica disponível quando informada.

**Requisitos relacionados:** RF-ATE-05, RF-ATE-06, RNF-17.

**Prioridade:** alta.

### US-07 — Gerar e enviar PDF

**Como** Operador  
**Quero** gerar um PDF da ficha e enviá-lo ao e-mail da empresa  
**Para** disponibilizar um registro organizado ao escritório.

**Critérios de aceite**

- PDF é gerado a partir da ficha correta.
- Documento fica armazenado no atendimento.
- Botão de envio usa o PDF armazenado.
- Sistema registra data, responsável e resultado.
- Falha pode ser reenviada.

**Requisitos relacionados:** RF-ATE-07 a RF-ATE-10.

**Prioridade:** alta.

### US-08 — Publicar Comunicação

**Como** Administrador  
**Quero** criar e publicar conteúdo  
**Para** manter notícias, agenda e comunicados acessíveis.

**Critérios de aceite**

- Conteúdo pode ser salvo como rascunho.
- Publicação aparece na área pública.
- Edição atualiza o conteúdo.
- Ocultação remove o conteúdo da área pública.

**Requisitos relacionados:** RF-CMA-01 a RF-CMA-05, RF-COM-01 a RF-COM-04.

**Prioridade:** média.

### US-09 — Controlar acessos

**Como** Administrador  
**Quero** gerenciar usuários e perfis  
**Para** limitar as funções disponíveis no painel.

**Critérios de aceite**

- Usuário recebe perfil Administrador ou Operador.
- Operador não acessa Configurações críticas.
- Usuário desativado perde acesso.
- Alteração de perfil atualiza as permissões.

**Requisitos relacionados:** RF-ADM-01 a RF-ADM-04, RF-CFG-01 a RF-CFG-03.

**Prioridade:** média.

### US-10 — Preservar atendimento humano

**Como** Bamak  
**Quero** que o portal organize o início do contato  
**Para** manter a análise e a negociação com a equipe.

**Critérios de aceite**

- Sistema não calcula preço ou viabilidade.
- Não existe área privada do cliente.
- Contato continua por WhatsApp, telefone ou e-mail.
- PDF interno não é entregue ao cliente pelo portal.

**Requisitos relacionados:** regras RN-02, RN-05, RN-12.

**Prioridade:** alta.

## 7. Fluxos

### FL-01 — Descoberta

```text
Home
  ├── Institucional
  ├── Aplicações
  │     └── detalhe de aplicação
  ├── Catálogo
  │     └── detalhe de produto
  ├── FAQ
  ├── Comunicação
  │     └── detalhe de conteúdo
  ├── Cabo Aéreo
  └── Contato / canais diretos
```

**Resultado esperado:** visitante encontra informação suficiente para decidir entre consultar mais conteúdo, iniciar contato geral ou enviar solicitação de Cabo Aéreo.

### FL-02 — Contato geral

```text
Consulta pública
→ Contato
→ preenchimento
→ consentimento
→ validação
→ registro no banco
→ confirmação ao visitante
→ entrada em Atendimentos
→ consulta pela equipe
→ continuidade por canal humano
```

**Falhas tratadas**

- campo obrigatório ausente;
- contato inválido;
- consentimento não marcado;
- erro de gravação;
- erro de notificação por e-mail.

### FL-03 — Cabo Aéreo

```text
Página Cabo Aéreo
→ explicação da aplicação
→ dados de contato
→ contexto da instalação
→ descrição textual da localização
→ mapa opcional
→ anexos
→ consentimento
→ validação
→ registro
→ ficha interna
→ consulta no painel
→ geração de PDF
→ armazenamento
→ envio ao e-mail
→ continuidade por canal humano
```

**Falhas tratadas**

- arquivo inválido;
- arquivo acima de 10 MB;
- mais de cinco arquivos;
- consentimento ausente;
- erro no mapa;
- erro no storage;
- erro na geração do PDF;
- erro no envio por e-mail.

### FL-04 — Comunicação

```text
Login
→ Comunicação
→ criar ou editar
→ validar campos
→ salvar rascunho ou publicar
→ conteúdo público
→ editar, ocultar ou encerrar
```

**Resultado esperado:** conteúdo controlado pode ser atualizado sem alteração manual no código.

### FL-05 — Tratamento de atendimento

```text
Login
→ Painel
→ Atendimentos
→ filtro
→ abrir atendimento
→ consultar dados e anexos
→ atualizar estado
→ gerar ou consultar PDF
→ enviar PDF quando aplicável
→ continuar atendimento fora do portal
```

## 8. Métricas de validação

| ID | Métrica | Meta | Evidência |
|---|---|---:|---|
| MET-01 | Conclusão de tarefas públicas por usuários-teste | ≥ 80% | Roteiro e registro de testes |
| MET-02 | Campos obrigatórios do Cabo Aéreo validados | 100% | Testes funcionais |
| MET-03 | Localização de solicitação no painel | Sem auxílio | Teste com usuário administrativo |
| MET-04 | Consulta da ficha e anexos | Sem erro | Teste funcional |
| MET-05 | Geração de PDF | Sem erro | Arquivo gerado e registro de teste |
| MET-06 | Associação do PDF ao atendimento correto | 100% | Teste de integração |
| MET-07 | Envio do PDF por e-mail | Concluído e registrado | Teste funcional |
| MET-08 | Utilidade percebida pela Bamak | Média ≥ 4 de 5 | Formulário de validação |
| MET-09 | Problemas críticos antes da release | 0 | Issues e relatório de QA |
| MET-10 | Cobertura unitária do backend | ≥ 75% | Pipeline |
| MET-11 | Cobertura unitária do frontend | ≥ 25% | Pipeline |
| MET-12 | Pipeline da branch principal | Aprovado | GitHub Actions |
| MET-13 | Quality gate | Sem bloqueio | SonarCloud |
| MET-14 | Três fluxos completos | 100% funcionais | Testes e demonstração |
| MET-15 | Acesso indevido a anexos | 0 ocorrências nos testes | Testes de autorização |

As métricas acadêmicas e o agrupamento por NP serão definidos pela professora do PAC VIII.

## 9. Evidências esperadas

- links de pull requests;
- comentários de code review;
- issues de bugs;
- relatórios de cobertura;
- execução do GitHub Actions;
- resultado do SonarCloud;
- registros do Sentry;
- testes funcionais;
- testes de autorização;
- testes de upload;
- roteiro com usuários-teste;
- demonstrações para a Bamak;
- formulário de validação;
- termo de aceite ou declaração final.

## 10. Pendências da linha de base

Ainda precisam ser definidos:

- campos finais do Cabo Aéreo;
- nome definitivo da ficha e do PDF;
- estados finais dos atendimentos;
- permissões detalhadas do Operador;
- taxonomia final de Aplicações;
- categorias e filtros finais do Catálogo;
- conteúdos ativos em Comunicação;
- prazo definitivo de retenção;
- fornecedor de deploy;
- fornecedor de storage;
- serviço de e-mail;
- biblioteca de geração de PDF.

Essas pendências não alteram o escopo principal. Elas serão resolvidas nos artefatos de arquitetura, prototipação e validação.

## 11. Melhorias futuras ou fora da primeira versão

- áudio e vídeo;
- PDF enviado pelo cliente;
- área privada do cliente;
- chatbot;
- CRM;
- ERP;
- funil de vendas;
- lead scoring;
- automação comercial;
- orçamento automático;
- cálculo técnico;
- cálculo de rota, distância, desnível ou viabilidade;
- CMS estrutural completo;
- e-commerce;
- carrinho;
- checkout;
- pagamento;
- cálculo de frete;
- aplicativo mobile nativo.

## 12. Critérios para considerar este artefato atendido

Este artefato será considerado concluído quando:

- requisitos públicos estiverem identificados;
- requisitos administrativos estiverem identificados;
- requisitos não funcionais tiverem evidência esperada;
- user stories principais tiverem critérios de aceite;
- fluxos estiverem descritos;
- métricas estiverem associadas a evidências;
- primeira versão estiver separada de pendências e melhorias futuras.
