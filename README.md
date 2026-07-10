# Portal Bamak

Repositório do projeto extensionista **Portal Bamak**, desenvolvido no curso de Engenharia de Software em parceria com a **Bamak Equipamentos LTDA**.

O projeto integra a trajetória de **PAC Extensionista** e **Portfólio**. O PAC organiza diagnóstico, escopo, qualidade, validação e evidências extensionistas; Portfólio concentrará a implementação funcional no PAC VIII.

O Portal Bamak é uma solução Web Apps institucional-comercial voltada a estruturar a primeira presença digital mais organizada da empresa, apresentar aplicações e produtos, publicar conteúdos controlados e iniciar contatos por meios digitais sem substituir o atendimento humano.

---

## Finalidade extensionista

A Bamak atua principalmente por indicações de agricultores e empresas clientes, relacionamento direto, WhatsApp, telefone, e-mail e visitas presenciais ocasionais. O site atual participa pouco da descoberta e do início dos contatos.

A solução busca:

- organizar a apresentação institucional e comercial da empresa;
- apresentar Aplicações e produtos em uma estrutura consultiva;
- oferecer informações úteis antes do contato;
- criar um fluxo específico para Cabo Aéreo;
- registrar contatos gerais e solicitações em um painel simples;
- permitir atualização limitada de Comunicação;
- preparar uma base técnica, visual e documental para o PAC VIII.

A empresa não possui equipe dedicada ao site ou às redes sociais. O painel administrativo foi reduzido para funções compatíveis com a rotina do escritório.

---

## Fases do projeto

| Fase | Papel |
|---|---|
| **PAC VII** | Concepção aprovada: diagnóstico, benchmarking, escopo, requisitos, arquitetura inicial, decisões, wireframes lo-fi e entregáveis finais. |
| **Pré-PAC VIII** | Consolidação da linha de base: alinhamento, baseline, RFC v2, requisitos, arquitetura revisada, inventário de telas, design, protótipos e validação com a Bamak. |
| **PAC VIII** | Implementação, QA, revisão por pares, testes cruzados, validação funcional, release, aceite e Demo Day. |

O PAC VII está concluído. A etapa atual é o **Pré-PAC VIII: Linha de Base**.

---

## Estado atual

| Frente | Situação |
|---|---|
| PAC VII | Concluído |
| Reorganização do repositório por fases | Concluída |
| PRE8-M1: Alinhamento e baseline | Concluído |
| PRE8-M2: RFC v2 e requisitos | Concluído |
| PRE8-M3: Artefatos e arquitetura | Concluído |
| PRE8-M4: Protótipos e guia visual | Planejado |
| PRE8-M5: Fechamento da linha de base | Planejado |
| Desenvolvimento funcional | Não iniciado |
| PAC VIII | Não iniciado |

O repositório ainda não contém frontend, backend, banco implementado, autenticação funcional, deploy ou testes automatizados. Esses elementos pertencem ao PAC VIII.

---

## Objetivo do Portal Bamak

Estruturar e implementar um portal institucional-comercial que:

1. apresente a Bamak, sua atuação, suas aplicações e seus produtos;
2. permita descoberta, consulta e início de contato por visitantes;
3. organize contatos gerais e solicitações de Cabo Aéreo;
4. mantenha o atendimento comercial e técnico com a equipe da empresa;
5. ofereça uma administração restrita a Atendimentos, Comunicação e Configurações essenciais.

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
4. Configurações

### Perfis administrativos

- **Administrador:** acesso completo ao painel, Comunicação, usuários e configurações.
- **Operador:** acesso operacional ao Painel e aos Atendimentos, conforme permissões definidas.

A estrutura pública permanece mantida tecnicamente na primeira versão. Comunicação será o conteúdo público administrável pelo painel.

---

## Fluxos de negócio

A linha de base define três fluxos completos:

1. **Descoberta e contato geral**  
   Consulta pública → formulário → consentimento → registro em Atendimentos → continuidade por canal humano.

2. **Solicitação de Cabo Aéreo**  
   Página específica → formulário → localização textual ou mapa opcional → imagens → consentimento → ficha interna → PDF → armazenamento → envio ao e-mail da empresa.

3. **Publicação de Comunicação**  
   Login → criação ou edição → rascunho ou publicação → visualização pública.

---

## Cabo Aéreo

O Cabo Aéreo é a principal aplicação consultiva da primeira versão.

O visitante poderá informar dados de contato, contexto da instalação, descrição do local, marcação opcional em mapa e até cinco imagens nos formatos JPG, PNG ou WebP, com limite inicial de 10 MB por arquivo. O formulário exigirá consentimento explícito para tratamento dos dados.

A solicitação será exibida como ficha interna no painel. Administrador ou Operador poderá:

- consultar dados e anexos;
- gerar um PDF;
- armazenar o PDF junto ao atendimento;
- enviar o PDF ao e-mail da empresa;
- continuar o atendimento por WhatsApp, telefone ou e-mail.

O portal não realizará orçamento automático, cálculo de rota, distância, desnível ou viabilidade técnica. O cliente não receberá o documento interno pelo portal.

---

## Fora de escopo

- e-commerce;
- carrinho, checkout, pagamento e frete;
- orçamento automático;
- cálculo técnico de Cabo Aéreo;
- CRM e ERP;
- funil de vendas e lead scoring;
- área privada do cliente;
- CMS estrutural completo;
- chatbot;
- automação comercial;
- relatório técnico privado para o cliente.

---

## Estrutura do repositório

```text
bamak-portal/
├── README.md
├── docs/
│   ├── 00-projeto/
│   │   ├── mapa-artefatos.md
│   │   └── historico-fases.md
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
│   │   │   ├── registro-bamak.md
│   │   │   └── baseline-presenca-digital-atendimento.md
│   │   ├── 02-proposta/
│   │   │   ├── mudancas-pac-vii-para-pac-viii.md
│   │   │   └── rfc-v2-adendo-pac-viii.md
│   │   ├── 03-produto/
│   │   │   └── requisitos-user-stories-fluxos-metricas.md
│   │   ├── 04-arquitetura/
│   │   │   ├── arquitetura-web-apps.md
│   │   │   ├── decisoes-linha-base.md
│   │   │   └── inventario-telas.md
│   │   ├── 05-design/
│   │   ├── 06-prototipos/
│   │   │   ├── lo-fi/
│   │   │   └── mid-fi/
│   │   │       ├── publico/
│   │   │       └── admin/
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
└── .gitignore
```

---

## Documentos centrais

| Documento | Função |
|---|---|
| [Mapa global de artefatos](docs/00-projeto/mapa-artefatos.md) | Localizar artefatos históricos, concluídos, planejados e reservados. |
| [Histórico das fases](docs/00-projeto/historico-fases.md) | Entender a evolução e a separação entre PAC VII, Pré-PAC VIII e PAC VIII. |
| [Registro de alinhamento](docs/20-pre-pac-viii/01-alinhamento/registro-bamak.md) | Consultar decisões confirmadas com a Bamak. |
| [Baseline digital](docs/20-pre-pac-viii/01-alinhamento/baseline-presenca-digital-atendimento.md) | Consultar o ponto de partida da presença digital e do início do atendimento. |
| [Mudanças em relação ao PAC VII](docs/20-pre-pac-viii/02-proposta/mudancas-pac-vii-para-pac-viii.md) | Verificar o que foi mantido, refinado, pendente ou deslocado. |
| [RFC v2](docs/20-pre-pac-viii/02-proposta/rfc-v2-adendo-pac-viii.md) | Consultar a linha de base formal do produto. |
| [Requisitos, fluxos e métricas](docs/20-pre-pac-viii/03-produto/requisitos-user-stories-fluxos-metricas.md) | Consultar requisitos verificáveis, user stories, fluxos e métricas. |
| [Arquitetura Web Apps](docs/20-pre-pac-viii/04-arquitetura/arquitetura-web-apps.md) | Consultar containers, módulos, integrações e fluxos técnicos. |
| [Decisões da linha de base](docs/20-pre-pac-viii/04-arquitetura/decisoes-linha-base.md) | Consultar decisões de escopo, painel e operação. |
| [Inventário de telas](docs/20-pre-pac-viii/04-arquitetura/inventario-telas.md) | Consultar telas, rotas, estados e prioridades de prototipação. |

---

## Como navegar

| Caminho | Conteúdo |
|---|---|
| `docs/00-projeto/` | Mapa global e histórico das fases. |
| `docs/10-pac-vii/` | Histórico aprovado do PAC VII. |
| `docs/20-pre-pac-viii/` | Linha de base atual antes da implementação. |
| `docs/30-pac-viii/` | Estrutura reservada para execução, QA e entrega. |
| `entregaveis/pac-vii/` | Artigo, relatório, pitch e fontes concluídos. |
| `entregaveis/pre-pac-viii/` | Entregáveis consolidados da linha de base, quando houver. |
| `entregaveis/pac-viii/` | Entregáveis finais da execução, quando houver. |

---

## Próximas frentes do Pré-PAC VIII

- style tile;
- guia visual;
- protótipos lo-fi;
- protótipos mid-fi da área pública;
- protótipos mid-fi do painel administrativo;
- revisão interna da linha de base;
- validação da RFC e dos protótipos com a Bamak;
- incorporação dos ajustes;
- fechamento do estado da linha de base.

Essa fase não inclui desenvolvimento funcional.

---

## PAC VIII

O PAC VIII deverá transformar a linha de base em aplicação funcional com:

- frontend, backend e banco próprios;
- autenticação;
- storage privado;
- geração de PDF;
- serviço de e-mail;
- testes automatizados;
- revisão por pares;
- testes cruzados;
- CI/CD;
- análise estática;
- observabilidade;
- deploy público;
- validação com a Bamak;
- release funcional;
- aceite final;
- Demo Day.

As NPs, datas e prioridades serão definidas pela professora no início do semestre.

---

## Stack prevista

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |
| Mapa | Leaflet + OpenStreetMap |
| Arquivos | Serviço compatível com S3 |
| CI/CD | GitHub Actions |
| Análise estática | SonarCloud |
| Observabilidade | Logs estruturados + healthcheck + Sentry |
| Deploy | Ambiente público conteinerizado, com provedor a definir |

A escolha dos fornecedores de deploy, storage e e-mail será concluída no PAC VIII.

---

## Organização do trabalho

O projeto usa GitHub Issues, Milestones e Projects para rastrear entregas por fase.

### Milestones

```text
P7-M1, P7-M2, ...       PAC VII
PRE8-M1, PRE8-M2, ...   Pré-PAC VIII
P8-M1, P8-M2, ...       PAC VIII
```

### Labels

```text
area:...
tipo:...
etapa:...
```

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

---

## Privacidade e dados sensíveis

Este repositório é público.

Não devem ser versionados:

- nomes, telefones ou e-mails reais de clientes;
- endereços e coordenadas reais;
- prints de conversas;
- fotos privadas de propriedades;
- anexos recebidos pelo portal;
- documentos comerciais internos;
- chaves de API;
- tokens;
- variáveis de ambiente com valores reais.

Formulários públicos devem exigir consentimento explícito. Protótipos, testes e documentação devem usar dados fictícios ou anonimizados.

---

## Status de implementação

Ainda não há aplicação funcional neste repositório.

Não existem nesta fase:

- frontend implementado;
- backend implementado;
- banco modelado em código;
- autenticação funcional;
- storage configurado;
- serviço de e-mail integrado;
- deploy;
- testes automatizados;
- release.

---

## Entregáveis

### PAC VII

```text
entregaveis/pac-vii/bamak-pac-vii-artigo.pdf
entregaveis/pac-vii/bamak-pac-vii-pitch.pdf
entregaveis/pac-vii/bamak-pac-vii-relatorio.pdf
```

### Pré-PAC VIII

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

Até a definição de uma licença formal, o conteúdo não deve ser tratado como material livre para reutilização externa. O uso de nomes, marca, materiais visuais e informações da empresa depende de autorização da Bamak.

---

## Autor

**Bredley Bauer**  
Curso de Engenharia de Software  
Centro Universitário Católica de Santa Catarina  
Jaraguá do Sul, SC, Brasil
