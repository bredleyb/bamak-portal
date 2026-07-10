# Portal Bamak

Repositório do projeto extensionista **Portal Bamak**, desenvolvido no curso de Engenharia de Software em parceria com a **Bamak Equipamentos LTDA**.

Este projeto faz parte da trajetória de **PAC Extensionista** e **Portfólio**. No contexto deste repositório, PAC é a etapa curricular que conecta prática de Engenharia de Software, documentação técnica, validação com parceiro externo e impacto extensionista. O projeto parte de uma demanda real da empresa parceira e evolui por fases documentadas, validadas e rastreáveis.

O Portal Bamak propõe uma solução Web Apps institucional-comercial para organizar a presença digital da empresa, apresentar aplicações, produtos, conteúdos e canais de contato, além de preparar uma base técnica para execução no PAC VIII.

---

## Finalidade extensionista

A Bamak possui atuação comercial fortemente baseada em relacionamento direto, indicações, contatos por canais tradicionais e visitas presenciais. O projeto extensionista busca apoiar essa realidade com uma estrutura digital mais organizada, sem substituir o atendimento humano que já faz parte da operação da empresa.

A solução proposta procura gerar valor para a parceira ao:

- estruturar uma presença digital institucional-comercial mais consistente;
- facilitar a apresentação da empresa, suas aplicações e produtos;
- organizar informações que hoje ficam dispersas entre site estático, redes sociais e contato direto;
- qualificar solicitações iniciais, especialmente no fluxo de Cabo Aéreo;
- criar uma base técnica, visual e documental para execução no PAC VIII.

A proposta considera que a empresa ainda não possui equipe dedicada à gestão de site ou canais digitais. Por isso, o escopo administrativo deve permanecer simples e compatível com a rotina do escritório.

---

## O que é PAC neste projeto

O repositório está organizado em três momentos:

| Fase | Papel no projeto |
|---|---|
| **PAC VII** | Concepção da solução: diagnóstico, problema, escopo, benchmarking, arquitetura, requisitos, protótipos de baixa fidelidade, validação e entregáveis finais. |
| **Pré-PAC VIII** | Linha de base entre a concepção aprovada e a execução: RFC v2/adendo, refinamento de escopo, baseline, arquitetura revisada, protótipos low/mid fidelity, guia visual e validação com a Bamak. |
| **PAC VIII** | Execução funcional, QA, testes, validação por pares, validação com a empresa e entrega do MVP. |

O PAC VII já foi concluído. A etapa atual é o **pré-PAC VIII**, usada para consolidar a linha de base antes do desenvolvimento funcional.

---

## Estado atual

| Área | Situação |
|---|---|
| Documentação PAC VII | Concluída |
| Entregáveis PAC VII | Concluídos |
| Reorganização por fases | Em andamento |
| Linha de base pré-PAC VIII | Em preparação |
| Desenvolvimento funcional | Não iniciado |
| PAC VIII | Não iniciado |

No estado atual, o repositório ainda não contém frontend, backend, banco de dados, autenticação, deploy ou testes automatizados. Esses elementos pertencem à fase PAC VIII.

---

## Objetivo do Portal Bamak

Estruturar e evoluir um portal institucional-comercial para a Bamak, com base documental, visual, arquitetural e funcional suficiente para orientar a implementação no PAC VIII.

O projeto conecta três frentes:

1. **Presença institucional-comercial**  
   Organização da apresentação pública da empresa, suas aplicações, produtos, conteúdos e canais de contato.

2. **Pré-atendimento qualificado**  
   Estruturação inicial de fluxos como o Cabo Aéreo, com coleta de informações mínimas para apoiar a análise interna.

3. **Operação administrativa simples**  
   Painel restrito para acompanhar atendimentos, comunicação e configurações essenciais, sem escopo de CMS completo, CRM, ERP ou automação comercial avançada.

---

## Escopo funcional previsto

### Área pública

A navegação pública refinada do Portal Bamak é:

1. Home
2. Institucional
3. Aplicações
4. Catálogo
5. Cabo Aéreo
6. FAQ
7. Comunicação
8. Contato

### Área administrativa

A navegação administrativa prevista é:

1. Painel
2. Atendimentos
3. Comunicação
4. Configurações

A área administrativa deve apoiar a operação interna de forma limitada. Ela não substitui sistemas de gestão, CRM, ERP, ferramentas de marketing ou atendimento automatizado.

---

## Cabo Aéreo

O fluxo de Cabo Aéreo é a principal aplicação consultiva prevista na linha de base.

A proposta é permitir que o visitante envie informações iniciais sobre sua necessidade, incluindo dados de contato, contexto da aplicação e evidências mínimas. Internamente, a empresa recebe uma ficha de aplicação para orientar análise e retorno.

O cliente não recebe relatório técnico privado pelo portal. A comunicação permanece por canais humanos, como WhatsApp ou e-mail, com base nas informações enviadas.

---

## Estrutura do repositório

A organização prevista separa materiais globais e fases do projeto.

```text
bamak-portal/
├── README.md
├── docs/
│   ├── 00-projeto/
│   │   ├── estado-geral.md
│   │   ├── mapa-artefatos.md
│   │   ├── historico-fases.md
│   │   └── convencoes-repositorio.md
│   │
│   ├── 10-pac-vii/
│   │   ├── README.md
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
│   │   ├── README.md
│   │   ├── 00-visao-geral/
│   │   ├── 01-alinhamento/
│   │   ├── 02-proposta/
│   │   ├── 03-produto/
│   │   ├── 04-arquitetura/
│   │   ├── 05-design/
│   │   ├── 06-prototipos/
│   │   │   ├── low-fi/
│   │   │   └── mid-fi/
│   │   │       ├── publico/
│   │   │       └── admin/
│   │   └── 07-validacao/
│   │
│   └── 30-pac-viii/
│       ├── README.md
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

## Como navegar

| Caminho | Conteúdo |
|---|---|
| `docs/00-projeto/` | Visão geral do projeto, mapa global de artefatos, histórico das fases e convenções do repositório. |
| `docs/10-pac-vii/` | Materiais aprovados no PAC VII: diagnóstico, benchmarking, escopo, arquitetura, decisões, wireframes lo-fi e planejamento de continuidade. |
| `docs/20-pre-pac-viii/` | Linha de base refinada antes do PAC VIII: RFC v2/adendo, baseline, requisitos, protótipos, guia visual e validações. |
| `docs/30-pac-viii/` | Espaço reservado para execução, QA, validação e entrega funcional no PAC VIII. |
| `entregaveis/pac-vii/` | PDFs finais e fontes dos entregáveis concluídos no PAC VII. |
| `entregaveis/pre-pac-viii/` | Entregáveis consolidados da fase pré-PAC VIII, quando houver. |
| `entregaveis/pac-viii/` | Entregáveis finais do PAC VIII, quando houver. |

---

## Fases do projeto

### PAC VII: concepção e RFC

O PAC VII consolidou a proposta inicial do Portal Bamak.

Principais entregas:

- diagnóstico do site atual;
- problema central;
- benchmarking e matriz comparativa;
- escopo funcional;
- requisitos;
- arquitetura da informação;
- arquitetura técnica;
- decisões de escopo e tecnologia;
- wireframes públicos de baixa fidelidade;
- artigo, relatório e pitch final.

Os materiais dessa fase devem ser preservados como histórico aprovado. Ajustes posteriores devem ser registrados na fase pré-PAC VIII.

---

### Pré-PAC VIII: linha de base

A fase pré-PAC VIII refina a proposta antes da execução.

Principais entregas previstas:

- alinhamento com a Bamak;
- baseline de presença digital e atendimento;
- mudanças em relação ao PAC VII;
- RFC v2/adendo;
- requisitos, user stories, fluxos e métricas;
- arquitetura e inventário de telas revisados;
- style tile e guia visual;
- protótipos low fidelity;
- protótipos mid fidelity da área pública;
- protótipos mid fidelity do painel administrativo;
- validação da linha de base com a Bamak;
- fechamento do repositório antes do PAC VIII.

Essa fase não inclui desenvolvimento funcional do software.

---

### PAC VIII: execução, QA e validação

O PAC VIII será a fase de implementação, qualidade e validação.

Escopo previsto:

- desenvolvimento da aplicação;
- organização de frontend, backend e banco de dados;
- uso de issues, milestones, pull requests e revisões;
- testes e evidências de qualidade;
- validação com a empresa;
- consolidação do MVP;
- entrega final.

A estrutura técnica de código será adicionada quando o PAC VIII iniciar.

---

## Stack prevista

A stack técnica prevista para execução é:

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |

A stack poderá ser revista durante o PAC VIII caso haja justificativa técnica, acadêmica ou operacional.

---

## Organização do trabalho

O projeto usa GitHub Issues, Milestones e Projects para rastrear entregas por fase.

Convenção de milestones:

```text
P7-M1, P7-M2, ...       PAC VII
PRE8-M1, PRE8-M2, ...   Pré-PAC VIII
P8-M1, P8-M2, ...       PAC VIII
```

Convenção de labels:

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

Este repositório é público e não deve armazenar dados reais sensíveis.

Não devem ser versionados:

- contatos reais de clientes;
- números de telefone;
- e-mails pessoais;
- endereços específicos;
- prints de conversas;
- fotos privadas de propriedades;
- áudios;
- coordenadas ou localizações precisas;
- documentos internos não autorizados;
- chaves de API;
- variáveis de ambiente com valores reais.

Quando necessário para documentação, devem ser usados dados fictícios, anonimizados ou descrições sintéticas.

---

## Status de implementação

Ainda não há aplicação funcional neste repositório.

Não existem, nesta fase:

- frontend implementado;
- backend implementado;
- banco modelado em código;
- autenticação funcional;
- deploy;
- testes automatizados;
- release.

Esses itens pertencem ao PAC VIII.

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
