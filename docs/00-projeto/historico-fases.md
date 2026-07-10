# Histórico das fases

## 1. Finalidade

Este documento registra como o Portal Bamak evoluiu entre PAC VII, Pré-PAC VIII e PAC VIII.

Ele existe para impedir três erros:

- tratar decisões atuais como se já fizessem parte do PAC VII;
- iniciar o PAC VIII sem uma linha de base consolidada;
- misturar documentação histórica, preparação e execução funcional.

## 2. Visão geral

| Fase | Situação | Papel |
|---|---|---|
| PAC VII | Concluído | Concepção, diagnóstico, escopo inicial, arquitetura e prototipação de baixa fidelidade. |
| Pré-PAC VIII | Em andamento | Refinamento do produto e consolidação da linha de base antes da codificação. |
| PAC VIII | Não iniciado | Implementação, QA, validação funcional, release e aceite. |

## 3. PAC VII — concepção e proposta aprovada

### 3.1 Problema identificado

O site da Bamak apresentava informações institucionais e comerciais de forma limitada, com pouca conexão entre:

- quem é a empresa;
- áreas de atuação;
- produtos;
- dúvidas anteriores ao contato;
- canais comerciais.

A análise mostrou que a necessidade ultrapassava uma atualização visual. O projeto precisava reorganizar a consulta institucional e comercial antes do contato.

### 3.2 Solução definida naquela fase

O PAC VII propôs um portal institucional-comercial com:

- Home;
- A Bamak;
- Segmentos;
- Soluções;
- Catálogo;
- FAQ;
- Contato;
- Notícias;
- Agenda;
- módulo administrativo editorial.

O catálogo foi definido como consultivo. E-commerce, checkout, pagamento, orçamento automático, CRM, ERP e área de cliente ficaram fora do escopo.

### 3.3 Base técnica

A arquitetura inicial separou:

- aplicação web;
- API;
- banco relacional;
- serviço externo de e-mail.

A stack prevista foi:

- Next.js e TypeScript;
- Tailwind CSS e shadcn/ui;
- NestJS e TypeScript;
- PostgreSQL e Prisma;
- JWT;
- Docker.

### 3.4 Artefatos produzidos

O PAC VII concluiu:

- diagnóstico do site;
- benchmarking;
- matriz comparativa;
- escopo;
- requisitos;
- sitemap público e administrativo;
- wireflows;
- diagramas C1 e C2;
- decisões arquiteturais;
- nove wireframes públicos de baixa fidelidade;
- artigo;
- relatório;
- pitch;
- planejamento inicial de continuidade.

### 3.5 Validação e limite da fase

A Bamak aprovou o diagnóstico, o recorte consultivo e a utilidade da proposta.

O PAC VII encerrou com documentação e protótipos. Não houve:

- aplicação funcional;
- backend;
- banco implementado;
- autenticação;
- deploy;
- testes automatizados;
- validação de uso em sistema executável;
- release.

## 4. Transição após o PAC VII

Depois da entrega final, novas conversas com a empresa esclareceram aspectos que o PAC VII ainda tratava de forma ampla.

Foram confirmados:

- dependência de indicações de agricultores e empresas clientes;
- WhatsApp como principal canal comercial;
- telefone e e-mail como canais complementares;
- Facebook e Instagram usados principalmente como vitrine;
- visitas presenciais ocasionais, especialmente em Cabo Aéreo e relações já existentes;
- pouca participação do site atual na geração de contatos;
- ausência de equipe dedicada aos canais digitais.

Essa leitura refinou a tese do projeto. O valor central passou a ser a criação da primeira estrutura digital mais organizada da Bamak, adequada à operação real da empresa.

## 5. Reunião de alinhamento de 08/07/2026

Em reunião presencial com Leandro Bauer, gerente administrativo, foram confirmados:

- papel institucional-comercial do portal;
- manutenção do atendimento humano;
- recorte reduzido do painel;
- navegação pública refinada;
- Cabo Aéreo como aplicação consultiva principal;
- catálogo consultivo;
- limites operacionais da primeira versão;
- uso do projeto mestre como referência para o Pré-PAC VIII.

A aprovação foi verbal e registrada em:

`docs/20-pre-pac-viii/01-alinhamento/registro-bamak.md`

## 6. Pré-PAC VIII — consolidação da linha de base

### 6.1 Papel da fase

O Pré-PAC VIII prepara a execução. Ele não inclui codificação funcional.

A fase deve reduzir ambiguidades sobre:

- escopo;
- fluxos;
- requisitos;
- arquitetura;
- navegação;
- painel;
- privacidade;
- design;
- protótipos;
- validação.

### 6.2 Mudança de navegação pública

A navegação do PAC VII:

1. Home
2. A Bamak
3. Segmentos
4. Soluções
5. Catálogo
6. FAQ
7. Contato
8. Notícias
9. Agenda

foi refinada para:

1. Home
2. Institucional
3. Aplicações
4. Catálogo
5. Cabo Aéreo
6. FAQ
7. Comunicação
8. Contato

As mudanças foram:

- `A Bamak` passou a `Institucional`;
- Segmentos e Soluções foram reorganizados em Aplicações;
- Cabo Aéreo recebeu página e fluxo próprios;
- Notícias e Agenda foram reunidas em Comunicação;
- o contato permanece como formulário geral e canais diretos.

### 6.3 Mudança da área administrativa

O módulo editorial amplo previsto no PAC VII foi reduzido para:

1. Painel
2. Atendimentos
3. Comunicação
4. Configurações

A primeira versão terá perfis:

- Administrador;
- Operador.

O painel não será CRM, ERP nem CMS estrutural completo. A manutenção da estrutura pública permanece técnica.

### 6.4 Contato geral

O contato geral deverá:

- receber nome, contato, assunto e mensagem;
- exigir consentimento;
- registrar a entrada no painel;
- permitir continuidade por WhatsApp, telefone ou e-mail.

Ele não gera ficha estruturada nem PDF.

### 6.5 Cabo Aéreo

O fluxo refinado prevê:

1. explicação da aplicação;
2. formulário específico;
3. descrição da necessidade;
4. mapa opcional com alternativa textual;
5. até cinco imagens;
6. consentimento explícito;
7. registro no painel;
8. ficha interna;
9. geração de PDF;
10. armazenamento do PDF;
11. botão de envio ao e-mail da empresa;
12. continuidade do atendimento por pessoas da Bamak.

O portal não calcula viabilidade, rota, distância, desnível, preço ou orçamento. O cliente não recebe relatório interno pelo portal.

### 6.6 Linha técnica consolidada

A base técnica atual prevê:

- Next.js;
- NestJS;
- PostgreSQL;
- Prisma;
- JWT;
- Docker;
- Leaflet e OpenStreetMap;
- storage compatível com S3;
- GitHub Actions;
- SonarCloud;
- logs estruturados;
- healthcheck;
- Sentry;
- deploy público conteinerizado.

### 6.7 Requisitos acadêmicos incorporados

A linha Web Apps exige:

- frontend e backend próprios;
- banco com persistência real;
- três fluxos de negócio completos;
- CI/CD;
- análise estática;
- observabilidade;
- documentação técnica;
- deploy público;
- cobertura mínima de 75% no backend e 25% no frontend.

Os três fluxos definidos para a linha de base são:

1. descoberta e contato geral;
2. solicitação de Cabo Aéreo;
3. publicação de Comunicação.

### 6.8 Artefatos concluídos até o momento

- `docs/20-pre-pac-viii/01-alinhamento/registro-bamak.md`
- `docs/20-pre-pac-viii/01-alinhamento/baseline-presenca-digital-atendimento.md`
- `docs/20-pre-pac-viii/02-proposta/mudancas-pac-vii-para-pac-viii.md`
- `docs/20-pre-pac-viii/02-proposta/rfc-v2-adendo-pac-viii.md`
- `docs/20-pre-pac-viii/03-produto/requisitos-user-stories-fluxos-metricas.md`
- `docs/00-projeto/mapa-artefatos.md`
- `docs/00-projeto/historico-fases.md`

### 6.9 Próximas frentes do Pré-PAC VIII

- atualizar arquitetura, decisões e inventário de telas;
- criar style tile;
- produzir protótipos low fidelity;
- produzir protótipos mid fidelity públicos;
- produzir protótipos mid fidelity administrativos;
- revisar a linha de base;
- validar RFC e protótipos com a Bamak;
- consolidar guia visual;
- incorporar ajustes;
- fechar o estado da linha de base.

## 7. PAC VIII — execução futura

### 7.1 Papel da fase

O PAC VIII transformará a linha de base em software funcional.

Portfólio concentrará a codificação. O PAC VIII concentrará:

- planejamento;
- QA;
- revisão por pares;
- testes cruzados;
- validação com a Bamak;
- evidências;
- aceite;
- socialização.

### 7.2 Entregas esperadas

- frontend;
- backend;
- banco;
- autenticação;
- painel;
- storage;
- e-mail;
- PDF;
- testes;
- pipeline;
- análise estática;
- observabilidade;
- deploy;
- release;
- documentação;
- termo de aceite;
- Demo Day.

### 7.3 Planejamento acadêmico

As NPs, datas, prioridades e recortes de entrega serão definidos pela professora no início do semestre.

Documentos do Pré-PAC VIII não devem antecipar a distribuição das funcionalidades por NP.

## 8. Regras para registrar mudanças futuras

### 8.1 Mudança em decisão do PAC VII

Registre a mudança no Pré-PAC VIII ou PAC VIII.

Não edite o PAC VII para fazer a decisão parecer anterior.

### 8.2 Mudança antes da implementação

Registre em:

- RFC v2;
- requisitos;
- arquitetura;
- protótipos;
- validação da linha de base.

### 8.3 Mudança durante a implementação

Registre em:

- issue;
- pull request;
- documento de decisão técnica;
- evidência de validação;
- documentação do PAC VIII.

### 8.4 Mudança solicitada pela Bamak

Registre:

- contexto;
- decisão;
- impacto;
- responsável;
- artefatos afetados;
- status de aplicação.

### 8.5 Item removido da primeira versão

Classifique como:

- fora de escopo;
- melhoria futura;
- decisão pendente;
- requisito substituído.

Evite apagar o histórico da decisão.

## 9. Estado atual consolidado

| Área | Situação |
|---|---|
| PAC VII | Concluído |
| Repositório separado por fases | Concluído |
| Alinhamento com a Bamak | Concluído |
| Baseline digital | Concluído |
| Mudanças em relação ao PAC VII | Concluído |
| RFC v2 | Concluído |
| Requisitos, user stories, fluxos e métricas | Concluído |
| Mapa global e histórico | Concluídos |
| Arquitetura refinada | Planejada |
| Guia visual | Planejado |
| Protótipos da linha de base | Planejados |
| Validação final com a Bamak | Planejada |
| Desenvolvimento funcional | Não iniciado |
| PAC VIII | Não iniciado |
