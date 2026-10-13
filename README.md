# Portal Bamak

Repositório do projeto extensionista **Portal Bamak**, desenvolvido no curso de Engenharia de Software em parceria com a **Bamak Equipamentos LTDA**.

O projeto integra a trajetória de **PAC Extensionista** e **Portfólio**. O PAC VIII concentra gestão, garantia de qualidade, validação por pares e validação extensionista, enquanto o desenvolvimento técnico da aplicação ocorre em sincronia com a disciplina de Portfólio.

O Portal Bamak é uma solução Web Apps institucional-comercial voltada a estruturar a presença digital da empresa, apresentar aplicações e produtos, publicar conteúdos controlados e iniciar contatos por meios digitais sem substituir o atendimento humano.

---

## Finalidade extensionista

A Bamak atua principalmente por indicações de agricultores e empresas clientes, relacionamento direto, WhatsApp, telefone, e-mail e visitas presenciais. O site atual participa pouco da descoberta e do início dos contatos.

A solução busca:

- organizar a apresentação institucional e comercial da empresa;
- apresentar aplicações e produtos em uma estrutura consultiva;
- oferecer informações úteis antes do contato;
- criar um fluxo específico para Cabo Aéreo;
- registrar contatos gerais e solicitações em um painel simples;
- permitir atualização limitada de Comunicação;
- apoiar a operação interna sem substituir os canais humanos de atendimento.

A empresa não possui equipe dedicada ao site ou às redes sociais. Por isso, o painel administrativo permanece restrito às funções necessárias para a rotina do escritório, sem assumir características de CRM, ERP ou CMS completo.

---

## Fases do projeto

| Fase | Papel |
|---|---|
| **PAC VII** | Concepção e validação inicial da proposta: diagnóstico, benchmarking, escopo, requisitos, arquitetura inicial, decisões, wireframes lo-fi e entregáveis finais. |
| **PAC VIII** | Planejamento e refinamento da solução, alinhamento com a Bamak, especificação, arquitetura, design, prototipação, implementação, testes, QA por pares, validação funcional, release, aceite e Demo Day. |

O **PAC VII está concluído** e seus materiais permanecem preservados como histórico da concepção, sem reedições para representar decisões posteriores.

A fase atual é o **PAC VIII**. O planejamento e a especificação estão documentados; a base técnica está estabelecida e o desenvolvimento do produto, os testes, a validação por pares e o aceite da Bamak seguem o andamento registrado neste repositório. A reunião inicial com a empresa não equivale à validação da versão funcional final.

---

## Estado atual

| Frente | Situação |
|---|---|
| PAC VII | Concluído; documentação e entregáveis preservados |
| Planejamento, alinhamento e especificação do PAC VIII | Documentados; revisão e consolidação em andamento |
| Organização do repositório e do GitHub | Em andamento (Plano A) |
| Design e prototipação | Estudos documentados; validação das referências visuais e protótipos ainda a confirmar |
| Frontend e backend | Bases Next.js e NestJS configuradas |
| Banco e ORM | PostgreSQL e Prisma configurados |
| Integração Web → API → banco | Validada localmente na base técnica |
| Docker local e Compose integrado | Arquivos configurados; integração local validada |
| Healthcheck da API e conexão com o banco | Funcionando na base local |
| CI básico | Workflow versionado com verificações de lint, build, Prisma e dependências |
| Infraestrutura de produção | Dockerfiles, Compose e Caddy versionados; não implantados publicamente |
| Automação de deploy (CD) | Workflow versionado, condicionado à habilitação de produção; não executado em ambiente público |
| Funcionalidades de negócio | Não concluídas; desenvolvimento funcional pendente |
| Testes de funcionalidades e metas de cobertura | Não implementados/atingidos |
| Autenticação e painel administrativo funcional | Não implementados |
| Análise estática e segurança dedicada | Pendente; lint e auditoria de dependências não a substituem |
| Observabilidade | Pendente; healthcheck não a substitui |
| HTTPS público, deploy e release | Não implantados ou validados |

Esta tabela distingue **especificado**, **configurado**, **validado localmente**, **implementado** e **publicado**. A presença de arquivos de infraestrutura ou de comandos de teste não demonstra, por si só, a conclusão das respectivas funcionalidades.

---

## Objetivo do Portal Bamak

Estruturar e implementar um portal institucional-comercial que:

1. apresente a Bamak, sua atuação, suas aplicações e seus produtos;
2. permita descoberta, consulta e início de contato por visitantes;
3. organize contatos gerais e solicitações de Cabo Aéreo;
4. mantenha o atendimento comercial e técnico com a equipe da empresa;
5. ofereça uma administração restrita a Atendimentos, Comunicação e configurações realmente necessárias.

---

## Escopo funcional

### Área pública

1. Home
2. Institucional
3. Aplicações
4. Catálogo
5. Cabo Aéreo
6. FAQ
7. Comunicação
8. Contato

### Área administrativa

1. Painel
2. Atendimentos
3. Comunicação
4. Configurações (usuários, permissões e ajustes operacionais essenciais)

A área administrativa deve permanecer simples. Ela não substitui sistemas de gestão, CRM, ERP ou plataformas de automação comercial.

### Perfis administrativos previstos

- **Administrador:** acesso às funções administrativas e configurações disponíveis.
- **Operador:** acesso às funções operacionais necessárias ao acompanhamento dos atendimentos.

O Administrador gerencia usuários e configurações; o Operador acompanha os atendimentos conforme permissões autorizadas. A matriz definitiva de permissões deve ser consolidada durante a implementação e validada com a Bamak, evitando funções sem necessidade operacional.

---

## Fluxos de negócio

A primeira versão deve contemplar **três fluxos de negócio completos**, conforme a [RFC v2](docs/20-pac-viii/02-escopo/rfc-v2-pac-viii.md). O painel de Atendimentos apoia os dois fluxos de entrada e não substitui o fluxo de publicação em Comunicação.

### 1. Descoberta e contato geral

Consulta pública → Contato → preenchimento → consentimento explícito → validação → registro no banco → confirmação ao visitante → visualização em Atendimentos → continuidade por WhatsApp, telefone ou e-mail.

### 2. Solicitação de Cabo Aéreo

Página específica → explicação → formulário contextualizado → localização textual (com mapa opcional) → imagens autorizadas → consentimento explícito → validação → registro → ficha interna → consulta no painel → geração do PDF → armazenamento junto ao atendimento → possibilidade de envio ao e-mail da empresa por usuário autorizado → continuidade do atendimento humano.

**Gerar, armazenar e permitir o envio do PDF interno são requisitos da primeira versão.** O envio é uma ação do usuário autorizado, com registro de data, responsável e resultado; não é um relatório automático entregue ao cliente.

### 3. Publicação em Comunicação

Autenticação → painel → Comunicação → criação ou edição → validação → rascunho ou publicação → exibição pública de conteúdo publicado → edição, ocultação ou encerramento.

Os fluxos deverão ser demonstrados, testados e validados com a Bamak. Requisitos e critérios detalhados encontram-se na RFC e no documento de requisitos.

---

## Cabo Aéreo

O Cabo Aéreo possui um fluxo próprio de solicitação na primeira versão; sua análise técnica continua sob responsabilidade da Bamak.

O visitante poderá fornecer:

- dados de contato e contexto da instalação;
- descrição textual da localização, independentemente do uso do mapa;
- localização opcional em mapa Leaflet/OpenStreetMap;
- imagens JPG, PNG ou WebP, inicialmente até cinco arquivos de 10 MB cada;
- consentimento explícito para tratamento dos dados.

A solicitação será registrada em Atendimentos e disponibilizada em uma **ficha interna estruturada**. A denominação definitiva da ficha e do PDF deve seguir a decisão atualizada do PAC VIII; a especificação não depende do uso de um nome ainda não confirmado.

O painel deverá permitir a geração do PDF a partir da ficha, seu armazenamento no atendimento e o envio ao e-mail da empresa por usuário autorizado, com rastreabilidade. Anexos e PDFs permanecem restritos a usuários autenticados e autorizados.

O portal não realizará orçamento automático, cálculo de rota, distância, desnível ou viabilidade técnica, diagnóstico definitivo nem entrega automática de relatório privado ao visitante. O atendimento posterior continuará por WhatsApp, telefone ou e-mail.

---

## Fora de escopo

- e-commerce;
- carrinho;
- checkout;
- pagamento online;
- cálculo de frete;
- orçamento automático;
- cálculo técnico automatizado de Cabo Aéreo;
- CRM;
- ERP;
- funil de vendas;
- lead scoring;
- área privada do cliente;
- CMS estrutural completo;
- chatbot;
- atendimento automático;
- automação comercial avançada;
- relatório técnico privado gerado automaticamente para o cliente.

---

## Arquitetura técnica

A solução adota arquitetura cliente-servidor em camadas. O esquema abaixo representa a **base técnica local**, não a implementação completa dos fluxos de negócio.

```text
Usuário
  │
  ▼
Next.js
Frontend
  │
  │ HTTP
  ▼
NestJS
API
  │
  ▼
Prisma
  │
  ▼
PostgreSQL
```

O frontend é responsável pela interface e interação com o usuário.

A API concentra os serviços de integração e deverá concentrar validação, autenticação, autorização, persistência e regras de negócio à medida que os módulos forem implementados.

O Prisma atua como camada de acesso ao PostgreSQL.

### Ambiente local

```text
Windows
  │
  ├── apps/web
  │     └── Next.js
  │
  ├── apps/api
  │     └── NestJS + Prisma
  │
  └── Docker
        └── PostgreSQL
```

### Arquitetura preparada para produção

```text
Internet
   │
   ▼
VPS Linux / Docker Compose
   │
   ├── Caddy (reverse proxy e HTTPS)
   ├── web (Next.js)
   ├── api (NestJS + Prisma)
   └── db (PostgreSQL, sem porta pública direta)

API ──► storage compatível com S3 (a integrar)
    └──► serviço de e-mail (a integrar)
```

O repositório já contém `apps/web/Dockerfile`, `apps/api/Dockerfile`, `compose.integrated.yaml`, `compose.production.yaml`, `infra/Caddyfile`, `infra/Caddyfile.prod` e um workflow de publicação. **A existência desses arquivos não significa que o ambiente de produção esteja ativo.**

O deploy regular deverá ser automatizado por CI/CD. SSH pode ser utilizado na administração do servidor, mas não como procedimento manual de implantação de cada versão. O domínio, as credenciais, o HTTPS público e a execução real do deploy ainda requerem configuração e validação.

---

## Estrutura do repositório

```text
bamak-portal/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── apps/
│   ├── web/
│   └── api/
├── assets/
│   └── brand/
├── docs/
│   ├── 10-pac-vii/
│   │   ├── 00-visao-geral/
│   │   ├── 01-diagnostico/
│   │   ├── 02-benchmarking/
│   │   ├── 03-escopo/
│   │   ├── 04-arquitetura-informacao/
│   │   ├── 05-arquitetura-tecnica/
│   │   ├── 06-decisoes/
│   │   ├── 07-wireframes-lo-fi/
│   │   └── 08-planejamento-continuidade/
│   └── 20-pac-viii/
│       ├── 00-planejamento/
│       ├── 01-alinhamento/
│       ├── 02-escopo/
│       ├── 03-requisitos/
│       ├── 04-arquitetura/
│       └── 05-design/
├── entregaveis/
│   └── pac-vii/
├── infra/
│   ├── Caddyfile
│   ├── Caddyfile.prod
│   └── production.env.template
├── .env.example
├── .gitignore
├── compose.yaml
├── compose.integrated.yaml
├── compose.production.yaml
└── README.md
```

O projeto está organizado em duas fases acadêmicas:

- **PAC VII:** concepção concluída, com documentação e entregáveis históricos preservados.
- **PAC VIII:** planejamento, especificação, design, desenvolvimento, testes, validação e entrega.

O código executável está organizado em `apps/`, enquanto a infraestrutura compartilhada permanece em `infra/` e nos arquivos de configuração da raiz.

O diretório `entregaveis/pac-viii/` será versionado quando receber seu primeiro entregável real. Diretórios futuros não são representados como existentes antes da criação de arquivos.

---

## Documentos centrais

O `README.md` é o índice principal do repositório. A **RFC v2 do PAC VIII** consolida o escopo e as decisões atuais; o documento de **requisitos, histórias de usuário, fluxos e métricas** detalha critérios verificáveis; o README apresenta somente a visão geral e o estado da implementação. Alterações de escopo devem ser documentadas e validadas, sem modificar retroativamente os arquivos históricos do PAC VII.

| Documento | Função |
|---|---|
| [Mapa de artefatos do PAC VII](docs/10-pac-vii/00-visao-geral/mapa-artefatos.md) | Consultar o índice produzido durante o PAC VII; seus caminhos históricos não são um índice da estrutura atual. |
| [Histórico e governança](docs/20-pac-viii/00-planejamento/historico-e-governanca.md) | Registrar a evolução do projeto e as regras de alteração documental. |
| [Registro de alinhamento](docs/20-pac-viii/01-alinhamento/registro-bamak.md) | Consultar as decisões e os limites discutidos com a Bamak. |
| [Levantamento de presença digital e atendimento](docs/20-pac-viii/01-alinhamento/levantamento-presenca-digital-atendimento.md) | Consultar o diagnóstico complementar da operação comercial e digital. |
| [Mudanças do PAC VII para o PAC VIII](docs/20-pac-viii/02-escopo/mudancas-pac-vii-para-pac-viii.md) | Identificar alterações em relação à concepção inicial. |
| [RFC v2 do PAC VIII](docs/20-pac-viii/02-escopo/rfc-v2-pac-viii.md) | Consultar as decisões e a especificação funcional vigente. |
| [Requisitos, histórias de usuário, fluxos e métricas](docs/20-pac-viii/03-requisitos/requisitos-user-stories-fluxos-metricas.md) | Consultar requisitos verificáveis e critérios de aceite. |
| [Arquitetura Web Apps](docs/20-pac-viii/04-arquitetura/arquitetura-web-apps.md) | Consultar a arquitetura técnica da solução. |
| [Decisões de produto](docs/20-pac-viii/04-arquitetura/decisoes-de-produto.md) | Consultar decisões de escopo, painel e operação. |
| [Inventário de telas](docs/20-pac-viii/04-arquitetura/inventario-telas.md) | Consultar telas, rotas e prioridades de interface. |
| [Direção visual das interfaces](docs/20-pac-viii/05-design/direcao-visual-interfaces.md) | Consultar as diretrizes de apresentação das interfaces. |
| [Hierarquia, grid e cards](docs/20-pac-viii/05-design/hierarquia-grid-cards.md) | Consultar estudos de composição e organização visual. |
| [Paleta operacional](docs/20-pac-viii/05-design/paleta-operacional.md) | Consultar as decisões e hipóteses de cores. |
| [Premissas e limites da marca](docs/20-pac-viii/05-design/premissas-e-limites-da-marca.md) | Consultar os limites de utilização da identidade visual. |
| [Tipografia operacional](docs/20-pac-viii/05-design/tipografia-operacional.md) | Consultar os estudos tipográficos. |

Os documentos de design ainda devem ser confrontados com a referência vigente no Figma. Sua presença no repositório não significa aprovação final de todas as decisões visuais.

---

## Como navegar

| Caminho | Conteúdo |
|---|---|
| `apps/web/` | Frontend da aplicação. |
| `apps/api/` | Backend, API e acesso ao banco de dados. |
| `assets/brand/` | Acervo visual da Bamak. |
| `docs/10-pac-vii/` | Documentação histórica do PAC VII. |
| `docs/20-pac-viii/` | Documentação atual do PAC VIII, incluindo planejamento, requisitos, design e decisões técnicas. |
| `entregaveis/pac-vii/` | Artigo, relatório, pitch e arquivos-fonte do PAC VII. |
| `entregaveis/pac-viii/` | Destino previsto para os entregáveis finais do PAC VIII, quando produzidos. |
| `infra/` | Configurações de proxy e infraestrutura. |
| `.github/workflows/` | Integração contínua e automação de publicação. |

---

## Stack técnica

| Camada | Tecnologia | Estado verificável |
|---|---|---|
| Frontend | Next.js 16 + TypeScript | Base configurada |
| Interface | Tailwind CSS; componentes próprios e shadcn/ui conforme necessidade | Tailwind configurado; componentes de produto pendentes |
| Backend | NestJS 12 + TypeScript | Base configurada |
| Banco de dados | PostgreSQL 17 | Banco configurado e integrado localmente |
| ORM | Prisma 7 | Configurado; modelo de domínio ainda pendente |
| Autenticação/autorização | JWT e perfis administrativos | Especificados; ainda não implementados |
| Ambiente local | Docker e Docker Compose | Configuração existente |
| Infraestrutura de produção | Dockerfiles, Compose e Caddy | Arquivos versionados; ambiente não implantado |
| CI | GitHub Actions (`ci.yml`) | Verificações iniciais configuradas |
| CD | GitHub Actions (`deploy.yml`) | Workflow versionado e condicionado à habilitação |
| HTTPS | Caddy com configuração de domínio/certificado | Previsto na configuração; não validado publicamente |
| Análise estática e segurança | SonarCloud | Pendente de integração; lint não substitui a ferramenta |
| Observabilidade | Logs estruturados, healthcheck e Sentry | Healthcheck existente; integração de observabilidade pendente |
| Mapa | Leaflet + OpenStreetMap | Especificado, ainda não implementado |
| Arquivos | Serviço compatível com S3 | Necessário para anexos e PDFs; integração pendente |
| E-mail | Serviço a definir | Necessário ao envio do PDF interno; integração pendente |

A escolha final de provedores e bibliotecas ainda pode exigir decisões documentadas. A implementação deve respeitar a RFC v2, os requisitos acadêmicos e a operação real da Bamak.

---

## Integração contínua

O projeto possui dois workflows versionados em `.github/workflows/`:

- **`ci.yml`:** executa, para frontend e backend, instalação por `npm ci`, auditoria das dependências de produção, lint e build; a API também valida a configuração Prisma. Roda nos eventos configurados de Pull Request e push. O gatilho legado para `feat/setup-web-api` ainda requer a limpeza prevista na organização do repositório.
- **`deploy.yml`:** prepara um deploy automatizado para a VPS após uma execução bem-sucedida da CI em push na `main`. A execução também exige que `PRODUCTION_DEPLOY_ENABLED` seja `true` e que existam ambiente e credenciais adequados. **Workflow presente não significa deploy executado.**

```text
Pull Request para main / push nas branches configuradas
   │
   └── CI (API e Web)
       ├── npm ci
       ├── npm audit --omit=dev --audit-level=high
       ├── Prisma validate (API)
       ├── lint
       └── build

Push em main + CI concluída com sucesso + deploy habilitado
   │
   └── CD (deploy.yml) → VPS / Docker Compose
```

**Ainda faltam no pipeline:** testes automatizados das funcionalidades, medição de cobertura (mínimo de 75% no backend e 25% no frontend) e ferramenta dedicada de análise estática/segurança. A adição ocorrerá em conjunto com o desenvolvimento real, com TDD quando aplicável. Os checks de CI existentes não comprovam essas entregas.

---

## Qualidade e requisitos acadêmicos

A linha Web Apps exige que a versão final seja uma aplicação real e publicamente acessível.

Para atender à linha Web Apps e às entregas do PAC VIII, o projeto deverá apresentar:

- frontend e backend próprios;
- interface funcional e navegável;
- arquitetura modular e documentada;
- código-fonte com histórico de commits;
- pipeline CI/CD;
- documentação de requisitos e user stories;
- diagrama de arquitetura C4 ou equivalente;
- instruções de deploy;
- testes unitários;
- cobertura mínima de 75% no backend;
- cobertura mínima de 25% no frontend;
- análise estática de código e segurança;
- ferramenta de monitoramento ou observabilidade;
- pelo menos três fluxos de negócio completos;
- ambiente público funcional.

Os testes devem acompanhar cada funcionalidade implementada, com TDD quando aplicável. As metas de cobertura são **75% no backend** e **25% no frontend**; dependem de medição efetiva em relatórios, não apenas da existência de ferramentas de teste.

O `lint` não substitui a ferramenta de análise estática e segurança exigida pela disciplina.

O endpoint de healthcheck também não substitui a ferramenta de observabilidade exigida para a entrega final.

---

## QA e validação

O PAC VIII exige validação técnica por pares e validação extensionista com o parceiro externo.

### Revisão por pares

O processo previsto utiliza branches de funcionalidade e Pull Requests para integração. A existência do procedimento não substitui evidências reais de revisão por colegas.

As alterações funcionais deverão passar por:

```text
branch
  ↓
Pull Request
  ↓
CI
  ↓
Code Review
  ↓
testes cruzados
  ↓
correções
  ↓
merge
```

Bugs efetivamente encontrados durante testes cruzados devem ser registrados como Issues. A revisão por pares deve conter comentários e verificações feitos por outros estudantes, conforme as orientações do PAC VIII.

PRs, comentários de revisão e Issues funcionam também como evidências do processo de QA.

### Validação com a Bamak

As versões funcionais deverão ser demonstradas à Bamak ao longo do PAC VIII, com registro de feedback, aprovação ou solicitações de ajuste. A aprovação verbal do alinhamento inicial não substitui o aceite do sistema implementado.

O processo previsto é:

```text
MVP
  ↓
demonstração
  ↓
feedback da Bamak
  ↓
registro
  ↓
ajustes
  ↓
nova versão
```

A entrega final deverá resultar em software funcional em versão de release e aceite da solução pela empresa.

---

## Deploy

O objetivo final é disponibilizar frontend, API e banco de dados próprios em ambiente público, utilizando VPS Linux e Docker Compose. A infraestrutura de referência está **versionada, mas ainda não foi implantada nem validada publicamente**.

```text
GitHub
   │
   ├── ci.yml: verificações técnicas
   │
   └── deploy.yml: somente após CI bem-sucedida e habilitação explícita
       │
       ▼
VPS Linux / Docker Compose
   ├── Caddy (HTTPS e proxy reverso)
   ├── web (Next.js)
   ├── api (NestJS)
   └── PostgreSQL (sem exposição pública direta)
```

**Preparado no repositório:** Dockerfiles, `compose.production.yaml`, configuração de Caddy e workflow de publicação. O workflow depende de condições de segurança, ambiente `production` e segredos configurados, além da variável `PRODUCTION_DEPLOY_ENABLED=true`.

**Pendente fora do repositório:** disponibilização e configuração da VPS, domínio/DNS, credenciais, execução e verificação do HTTPS, migrações e validação de funcionamento após deploy. Não há URL de produção verificada para divulgar neste momento.

SSH poderá ser usado para administração inicial e manutenção. A publicação regular de versões será automatizada; o PostgreSQL de produção não deverá expor sua porta diretamente à internet.

---

## Organização do trabalho

O projeto utiliza GitHub Issues, Milestones, Projects, branches e Pull Requests para rastrear o desenvolvimento.

### Milestones

```text
P7-M1 a P7-M5    PAC VII — histórico
P8-M1 a P8-M5    PAC VIII — planejamento, especificação, design e consolidação
```

Os milestones `P7-M1` a `P7-M5` preservam o histórico do PAC VII. Os milestones `P8-M1` a `P8-M5` organizam as atividades de alinhamento, requisitos, arquitetura, design, prototipação e consolidação documental do PAC VIII. Seus identificadores foram regularizados durante a organização do GitHub (O06), preservando as Issues vinculadas. Os marcos posteriores de implementação, testes, validação e entrega serão definidos conforme o avanço do PAC VIII.

### Labels

A taxonomia existente deve ser reaproveitada sempre que possível, evitando criação de labels redundantes.

Exemplos:

```text
area:arquitetura
area:prototipacao
area:validacao
tipo:documentacao
tipo:prototipo
tipo:evidencia
etapa:pac-vii
etapa:pac-viii
```

Labels específicas do PAC VIII podem ser adicionadas apenas quando houver necessidade real de rastreamento.

Issues não devem ser fragmentadas artificialmente em tarefas muito pequenas quando um checklist dentro de uma issue verificável for suficiente.

---

## Privacidade, segurança e LGPD

Este repositório é público.

Não devem ser versionados:

- nomes, telefones ou e-mails reais de clientes;
- endereços e coordenadas reais;
- prints de conversas;
- fotos privadas de propriedades;
- anexos reais recebidos pelo portal;
- documentos comerciais internos não autorizados;
- chaves de API;
- tokens;
- senhas;
- variáveis de ambiente com valores reais.

Arquivos `.env` reais permanecem fora do controle de versão. Arquivos `.env.example` podem documentar apenas a estrutura necessária e valores adequados para desenvolvimento.

Os formulários de contato geral e Cabo Aéreo devem apresentar consentimento explícito conforme a especificação, com texto de finalidade e acesso à política de privacidade. A implementação deve também observar necessidade, acesso restrito e definição de retenção dos dados.

Protótipos, testes, documentação e exemplos devem utilizar dados fictícios, sintéticos ou anonimizados.

Dependências de produção devem ser acompanhadas durante o desenvolvimento. Correções automáticas que provoquem alterações incompatíveis de versão não devem ser aplicadas sem análise.

---

## Status de implementação

As categorias abaixo descrevem **o que existe no código e na infraestrutura**, separando configurações versionadas das funcionalidades ainda ausentes.

### Base técnica existente

- frontend Next.js com TypeScript e Tailwind CSS;
- backend NestJS com TypeScript;
- PostgreSQL em Docker e Prisma integrado;
- variáveis de ambiente exemplificadas sem segredos;
- CORS e comunicação local entre frontend e API;
- prefixo `/api` e endpoint `/api/health` com consulta real ao banco;
- integração local Web → API → PostgreSQL validada;
- build da API com geração prévia do Prisma Client;
- lint de frontend/backend, auditoria de dependências e workflow básico de CI.

### Infraestrutura de produção preparada, mas não implantada

- `apps/web/Dockerfile` e `apps/api/Dockerfile`;
- `compose.integrated.yaml` para execução conteinerizada integrada;
- `compose.production.yaml` com banco, API, frontend e proxy;
- `infra/Caddyfile` e `infra/Caddyfile.prod` para proxy reverso (a configuração de produção prevê HTTPS);
- `infra/production.env.template` com exemplos de variáveis, sem credenciais reais;
- `.github/workflows/deploy.yml` para automação de publicação, desativada até a habilitação segura do ambiente de produção.

Esses arquivos não comprovam que HTTPS público, VPS ou CD tenham sido executados ou validados.

### Funcionalidades e garantias ainda pendentes

- páginas públicas finais e interações completas;
- formulários reais de contato e Cabo Aéreo, seus registros e estados;
- modelo de domínio e migrações das entidades de negócio;
- ficha interna de Cabo Aéreo e consulta protegida de anexos;
- geração, armazenamento e envio interno de PDF com rastreabilidade;
- autenticação, autorização por perfis e painel administrativo funcional;
- criação, publicação e manutenção administrativa de Comunicação;
- armazenamento de arquivos e serviço de e-mail integrados;
- testes unitários e testes de fluxos reais, evidências de TDD e metas de cobertura;
- ferramenta dedicada de análise estática e segurança;
- logs/monitoramento de produção e observabilidade adequada;
- configuração e validação de HTTPS e publicação efetiva da aplicação;
- validação de MVPs com a Bamak, correções de QA, release e aceite final.

A implementação deve avançar a partir dos fluxos reais especificados, sem criar funcionalidades artificiais apenas para demonstrar tecnologia.

---

## Próximas etapas técnicas

A prioridade imediata é **concluir o Plano A — Organização do repositório**, sem implementar funcionalidades novas dentro da branch de organização:

1. finalizar a revisão de documentos, links e estados do README;
2. organizar Issues, milestones, labels e Project do PAC VIII no GitHub (O06);
3. configurar proteção da `main`, corrigir o gatilho legado da CI por PR e verificar branches integradas (O07);
4. validar e integrar a organização, documentando as evidências e pendências (O08).

Após a integração do Plano A, retomar o desenvolvimento funcional (**Plano B**), na branch apropriada e com Pull Requests:

1. reconciliar interfaces e protótipos com os documentos vigentes e o Figma;
2. preparar os primeiros testes junto às funcionalidades correspondentes, usando TDD quando aplicável;
3. construir as páginas públicas e os componentes reutilizáveis, acompanhados dos respectivos testes;
4. modelar o domínio e implementar Contato, Cabo Aéreo, ficha/PDF, Comunicação e painel com testes contínuos;
5. implementar autenticação, autorização, uploads protegidos, storage e e-mail;
6. ampliar CI com cobertura, análise estática e segurança; integrar observabilidade;
7. disponibilizar e validar a infraestrutura pública e o deploy automatizado quando houver VPS e credenciais;
8. realizar code reviews, testes cruzados e validações de MVPs com a Bamak, corrigir problemas registrados e preparar a release, aceite e Demo Day.

A organização documental não depende da VPS nem da criação antecipada de testes, protótipos ou integrações inexistentes.

---

## Entregáveis

### PAC VII

```text
entregaveis/pac-vii/bamak-pac-vii-artigo.pdf
entregaveis/pac-vii/bamak-pac-vii-pitch.pdf
entregaveis/pac-vii/bamak-pac-vii-relatorio.pdf
```

### PAC VIII

```text
entregaveis/pac-viii/
```

> O caminho `entregaveis/pac-viii/` é um **destino previsto**, não um diretório atualmente versionado. Será criado quando existir um entregável real.

---

## Licença e uso

Este é um repositório acadêmico de projeto aplicado.

Até a definição de uma licença formal, o conteúdo não deve ser tratado como material livre para reutilização externa.

O uso de nomes, marca, materiais visuais e informações da empresa depende de autorização da Bamak.

---

## Autor

**Bredley Bauer**  
Curso de Engenharia de Software  
Centro Universitário Católica de Santa Catarina  
Jaraguá do Sul, SC, Brasil
