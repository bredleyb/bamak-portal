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
| **PAC VII** | Concepção aprovada: diagnóstico, benchmarking, escopo, requisitos, arquitetura inicial, decisões, wireframes lo-fi e entregáveis finais. |
| **Linha de base entre PAC VII e PAC VIII** | Refinamento e consolidação de alinhamento, requisitos, arquitetura, inventário de telas, decisões visuais, protótipos e validações anteriores à execução. |
| **PAC VIII** | Implementação, QA, revisão por pares, testes cruzados, validação funcional, evolução do MVP, release, aceite e Demo Day. |

O **PAC VII está concluído** e seus materiais permanecem preservados como histórico aprovado.

A etapa atual é o **PAC VIII**, com desenvolvimento funcional, QA, validação por pares e validação com a Bamak.

---

## Estado atual

| Frente | Situação |
|---|---|
| PAC VII | Concluído |
| Linha de base para execução | Consolidada |
| Reorganização do repositório | Concluída |
| Direção visual | Definida |
| Frontend | Base técnica configurada |
| Backend | Base técnica configurada |
| Banco de dados | PostgreSQL configurado |
| ORM | Prisma configurado |
| Integração Web → API → banco | Validada localmente |
| Docker local | Configurado |
| Healthcheck da API e banco | Funcionando |
| CI básico | Configurado |
| Desenvolvimento funcional | Em andamento |
| Testes automatizados das funcionalidades | Não iniciados |
| Autenticação | Não iniciada |
| Análise estática e segurança | Não iniciada |
| Observabilidade | Não iniciada |
| Deploy público | Não iniciado |
| Release | Não iniciada |

A base executável atual já contém frontend, backend e banco de dados integrados. As funcionalidades de negócio serão implementadas progressivamente durante o PAC VIII.

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
4. Configurações, somente quando houver necessidade operacional concreta

A área administrativa deve permanecer simples. Ela não substitui sistemas de gestão, CRM, ERP ou plataformas de automação comercial.

### Perfis administrativos previstos

- **Administrador:** acesso às funções administrativas e configurações disponíveis.
- **Operador:** acesso às funções operacionais necessárias ao acompanhamento dos atendimentos.

A implementação de permissões deve permanecer proporcional ao escopo do portal, evitando complexidade sem necessidade real.

---

## Fluxos de negócio

O Portal Bamak deverá contemplar pelo menos três fluxos de negócio completos.

### 1. Descoberta e contato geral

Consulta pública → formulário de contato → consentimento → registro da solicitação → acompanhamento interno → continuidade por canal humano.

### 2. Solicitação de Cabo Aéreo

Página específica → formulário → informações da aplicação → localização ou referência do local quando aplicável → imagens → consentimento → registro do atendimento → Ficha de Aplicação interna → análise humana.

Quando aplicável, a ficha poderá ser consolidada em PDF para uso interno da empresa. O documento não substitui a análise técnica e não é entregue automaticamente ao cliente.

### 3. Administração de Atendimentos e Comunicação

Login → acesso ao painel → acompanhamento de solicitações → atualização operacional → gestão limitada de conteúdos de Comunicação → publicação ou atualização pública quando aplicável.

Os fluxos serão refinados durante a implementação e validados por testes, revisão por pares e demonstrações à Bamak.

---

## Cabo Aéreo

O Cabo Aéreo é a principal aplicação consultiva da primeira versão.

O visitante poderá informar:

- dados de contato;
- contexto da aplicação;
- descrição do local;
- localização ou referência geográfica quando aplicável;
- imagens ou outras evidências previstas pelo formulário;
- consentimento explícito para tratamento dos dados.

A solicitação será registrada como atendimento e organizada internamente em uma **Ficha de Aplicação**.

A equipe da Bamak continuará responsável pela análise da situação e pelo retorno ao cliente por canais humanos, como WhatsApp, telefone ou e-mail.

O portal não realizará:

- orçamento automático;
- cálculo automático de rota;
- cálculo de distância ou desnível;
- determinação automática de viabilidade técnica;
- diagnóstico técnico definitivo;
- emissão automática de relatório privado para o cliente.

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

A aplicação segue arquitetura client-server com responsabilidades separadas.

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

A API concentra regras de negócio, validação, autenticação futura e acesso aos dados.

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

### Arquitetura prevista para produção

```text
Internet
   │
   ▼
HTTPS / reverse proxy
   │
   ▼
VPS Linux
   │
   └── Docker Compose
       ├── web
       │   └── Next.js
       │
       ├── api
       │   └── NestJS + Prisma
       │
       └── db
           └── PostgreSQL
```

O deploy de versões da aplicação deverá ser automatizado por **CI/CD**. O processo normal de publicação não deverá depender de deploy manual via SSH ou FTP.

---

## Estrutura do repositório

```text
bamak-portal/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── api/
│       ├── prisma/
│       ├── src/
│       ├── test/
│       ├── package.json
│       └── package-lock.json
│
├── assets/
│   └── brand/
│
├── docs/
│   ├── 00-projeto/
│   │
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
│   │
│   ├── 20-pre-pac-viii/
│   │   ├── 00-visao-geral/
│   │   ├── 01-alinhamento/
│   │   ├── 02-proposta/
│   │   ├── 03-produto/
│   │   ├── 04-arquitetura/
│   │   ├── 05-design/
│   │   ├── 06-prototipos/
│   │   └── 07-validacao/
│   │
│   └── 30-pac-viii/
│       ├── 01-planejamento/
│       ├── 02-desenvolvimento/
│       ├── 03-qa-validacao/
│       ├── 04-evidencias/
│       └── 05-entrega-final/
│
├── entregaveis/
│   ├── pac-vii/
│   ├── pre-pac-viii/
│   └── pac-viii/
│
├── .env.example
├── .gitignore
├── compose.yaml
└── README.md
```

Os diretórios históricos permanecem preservados para manter rastreabilidade das fases anteriores. O código executável do PAC VIII fica separado em `apps/`.

---

## Documentos centrais

| Documento | Função |
|---|---|
| [Mapa global de artefatos](docs/00-projeto/mapa-artefatos.md) | Localizar os principais artefatos do projeto. |
| [Histórico das fases](docs/00-projeto/historico-fases.md) | Entender a evolução entre PAC VII, linha de base e PAC VIII. |
| [Registro de alinhamento](docs/20-pre-pac-viii/01-alinhamento/registro-bamak.md) | Consultar decisões registradas com a Bamak. |
| [Baseline digital](docs/20-pre-pac-viii/01-alinhamento/baseline-presenca-digital-atendimento.md) | Consultar o ponto de partida da presença digital e do atendimento. |
| [Mudanças em relação ao PAC VII](docs/20-pre-pac-viii/02-proposta/mudancas-pac-vii-para-pac-viii.md) | Consultar os refinamentos posteriores à concepção aprovada. |
| [RFC v2](docs/20-pre-pac-viii/02-proposta/rfc-v2-adendo-pac-viii.md) | Consultar a linha de base formal do produto. |
| [Requisitos, fluxos e métricas](docs/20-pre-pac-viii/03-produto/requisitos-user-stories-fluxos-metricas.md) | Consultar requisitos verificáveis, user stories, fluxos e métricas. |
| [Arquitetura Web Apps](docs/20-pre-pac-viii/04-arquitetura/arquitetura-web-apps.md) | Consultar decisões arquiteturais anteriores à implementação. |
| [Decisões da linha de base](docs/20-pre-pac-viii/04-arquitetura/decisoes-linha-base.md) | Consultar decisões de escopo, painel e operação. |
| [Inventário de telas](docs/20-pre-pac-viii/04-arquitetura/inventario-telas.md) | Consultar telas, rotas e prioridades de interface. |
| `docs/30-pac-viii/` | Registrar execução, QA, evidências, validações e entrega final do PAC VIII. |

Os documentos do PAC VII são históricos e não devem ser reescritos para incorporar decisões tomadas posteriormente.

---

## Como navegar

| Caminho | Conteúdo |
|---|---|
| `apps/web/` | Frontend da aplicação. |
| `apps/api/` | Backend e acesso ao banco. |
| `assets/brand/` | Acervo visual autorizado da Bamak. |
| `docs/00-projeto/` | Documentação global e rastreabilidade do projeto. |
| `docs/10-pac-vii/` | Histórico aprovado do PAC VII. |
| `docs/20-pre-pac-viii/` | Linha de base produzida antes da execução funcional. |
| `docs/30-pac-viii/` | Documentação ativa da execução, QA e validação. |
| `entregaveis/pac-vii/` | Artigo, relatório, pitch e fontes concluídos. |
| `entregaveis/pre-pac-viii/` | Materiais consolidados da linha de base, quando aplicável. |
| `entregaveis/pac-viii/` | Entregáveis finais do PAC VIII. |

---

## Stack técnica

| Camada | Tecnologia | Situação |
|---|---|---|
| Frontend | Next.js 16 + TypeScript | Configurado |
| Interface | Tailwind CSS | Configurado |
| Componentes | Componentes próprios / shadcn/ui quando necessário | Durante a implementação |
| Backend | NestJS 12 + TypeScript | Configurado |
| Banco de dados | PostgreSQL 17 | Configurado |
| ORM | Prisma 7 | Configurado |
| Autenticação | JWT | Planejada |
| Ambiente | Docker / Docker Compose | Configurado localmente |
| CI | GitHub Actions | Configurado |
| CD | GitHub Actions → VPS | Planejado |
| Deploy | VPS Linux conteinerizada | Planejado |
| HTTPS | Reverse proxy + certificado | Planejado |
| Análise estática e segurança | SonarCloud ou equivalente | Planejada |
| Observabilidade | Ferramenta a definir | Planejada |
| Mapa | Leaflet + OpenStreetMap, quando necessário | Planejado |
| Arquivos | Storage compatível com S3, se exigido pelo fluxo final | Planejado |
| Serviço de e-mail | Provedor a definir, se mantido no fluxo final | Planejado |

A stack poderá ser ajustada quando houver justificativa técnica, acadêmica ou operacional, sem alterar desnecessariamente a arquitetura já estabelecida.

---

## Integração contínua

O projeto utiliza GitHub Actions para iniciar o processo de integração contínua.

O workflow deve evoluir junto com o desenvolvimento e contemplar progressivamente:

```text
Pull Request / push
        │
        ├── instalação reproduzível de dependências
        ├── auditoria de dependências de produção
        ├── validação do Prisma
        ├── lint
        ├── testes automatizados
        ├── verificação de cobertura
        ├── build
        ├── análise estática e segurança
        └── deploy automatizado nas branches definidas
```

A configuração atual cobre a validação técnica inicial de frontend e backend. Testes, cobertura, análise estática e CD serão adicionados conforme as respectivas etapas forem implementadas.

---

## Qualidade e requisitos acadêmicos

A linha Web Apps exige que a versão final seja uma aplicação real e publicamente acessível.

O Portal Bamak deverá chegar ao final do PAC VIII com:

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

Os testes devem acompanhar a implementação das funcionalidades, evitando concentrar toda a atividade de QA no final do projeto.

O `lint` não substitui a ferramenta de análise estática e segurança exigida pela disciplina.

O endpoint de healthcheck também não substitui a ferramenta de observabilidade exigida para a entrega final.

---

## QA e validação

O PAC VIII exige validação técnica por pares e validação extensionista com o parceiro externo.

### Revisão por pares

O desenvolvimento utiliza branches e Pull Requests.

As funcionalidades devem passar progressivamente por:

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

Bugs efetivamente encontrados durante testes cruzados devem ser registrados como Issues.

PRs, comentários de revisão e Issues funcionam também como evidências do processo de QA.

### Validação com a Bamak

As versões funcionais serão demonstradas à empresa ao longo do PAC VIII.

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

O ambiente final deverá ser acessível publicamente.

A estratégia prevista é utilizar uma VPS Linux com Docker Compose:

```text
GitHub
   │
   │ CI/CD
   ▼
VPS Linux
   │
   ├── reverse proxy / HTTPS
   │
   └── Docker Compose
       ├── web
       ├── api
       └── PostgreSQL
```

A VPS permite manter domínio técnico sobre frontend, backend, banco, containers, configuração do servidor e processo de publicação.

O acesso SSH poderá ser utilizado para administração inicial e manutenção do servidor, mas o processo normal de deploy da aplicação deverá ser automatizado pelo pipeline.

O PostgreSQL de produção não deverá expor publicamente sua porta para acesso externo desnecessário.

---

## Organização do trabalho

O projeto utiliza GitHub Issues, Milestones, Projects, branches e Pull Requests para rastrear o desenvolvimento.

### Milestones

```text
P7-M1, P7-M2, ...       PAC VII
PRE8-M1, PRE8-M2, ...   Linha de base histórica
P8-M1, P8-M2, ...       PAC VIII
```

Os milestones anteriores permanecem como histórico. O trabalho funcional corrente deve ser associado ao PAC VIII.

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
etapa:pre-pac-viii
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

Formulários que tratem dados pessoais devem apresentar consentimento explícito quando aplicável.

Protótipos, testes, documentação e exemplos devem utilizar dados fictícios, sintéticos ou anonimizados.

Dependências de produção devem ser acompanhadas durante o desenvolvimento. Correções automáticas que provoquem alterações incompatíveis de versão não devem ser aplicadas sem análise.

---

## Status de implementação

A base técnica do PAC VIII está em execução.

### Implementado até o momento

- frontend Next.js com TypeScript;
- Tailwind CSS;
- backend NestJS com TypeScript;
- PostgreSQL em Docker;
- Prisma integrado ao PostgreSQL;
- configuração de variáveis de ambiente;
- CORS entre frontend e API;
- prefixo `/api`;
- endpoint de healthcheck;
- verificação real da conexão com o banco no healthcheck;
- integração local entre frontend, API e banco;
- build reproduzível da API com geração prévia do Prisma Client;
- lint de frontend e backend;
- auditoria das dependências de produção;
- workflow inicial de integração contínua.

### Ainda não implementado

- páginas públicas finais;
- formulários funcionais de negócio;
- modelo definitivo das entidades;
- migrations das entidades reais;
- fluxo de Atendimentos;
- fluxo funcional de Cabo Aéreo;
- Ficha de Aplicação;
- autenticação;
- painel administrativo funcional;
- gerenciamento de Comunicação;
- storage de arquivos;
- serviço de e-mail;
- testes unitários das funcionalidades;
- metas de cobertura;
- análise estática e segurança;
- observabilidade;
- Dockerfiles de produção;
- reverse proxy;
- HTTPS;
- deploy público;
- CD;
- release final.

Não serão criados modelos, funcionalidades ou artefatos artificiais apenas para demonstrar tecnologia. A implementação deve avançar a partir das entidades e fluxos reais do Portal Bamak.

---

## Próximas etapas técnicas

A sequência imediata de execução é:

1. concluir a configuração inicial de CI;
2. validar o primeiro Pull Request;
3. manter revisão por pares no fluxo de desenvolvimento;
4. preparar a estrutura para deploy público;
5. implementar as interfaces públicas;
6. modelar as primeiras entidades reais;
7. implementar contato e Cabo Aéreo;
8. implementar autenticação e painel administrativo;
9. introduzir testes em conjunto com as funcionalidades;
10. evoluir o pipeline com cobertura, análise estática, segurança e CD;
11. configurar observabilidade;
12. validar os MVPs com a Bamak;
13. corrigir os problemas encontrados em QA e validação;
14. preparar a release final.

---

## Entregáveis

### PAC VII

```text
entregaveis/pac-vii/bamak-pac-vii-artigo.pdf
entregaveis/pac-vii/bamak-pac-vii-pitch.pdf
entregaveis/pac-vii/bamak-pac-vii-relatorio.pdf
```

### Linha de base entre PAC VII e PAC VIII

```text
entregaveis/pre-pac-viii/
```

### PAC VIII

```text
entregaveis/pac-viii/
```

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