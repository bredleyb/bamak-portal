# Histórico e governança — PAC VII e PAC VIII

## 1. Finalidade

Este documento registra a evolução do Portal Bamak entre as duas fases acadêmicas do projeto e estabelece regras para documentar alterações de escopo, requisitos e decisões técnicas.

O projeto possui exclusivamente duas fases:

- **PAC VII:** concepção, diagnóstico, proposta e prototipação inicial, concluído.
- **PAC VIII:** refinamento, planejamento, design, implementação, testes, validação e entrega, em andamento.

As atividades de planejamento e especificação realizadas após o PAC VII integram o próprio PAC VIII, independentemente de terem ocorrido antes da implementação funcional.

A documentação histórica do PAC VII deve permanecer fiel às decisões e entregas daquele período.

## 2. PAC VII — Concepção

### 2.1 Problema identificado

O site anterior da Bamak apresentava limitações na organização das informações institucionais e comerciais, na apresentação das aplicações e produtos e na orientação dos visitantes até o contato.

A proposta buscou melhorar a consulta institucional e comercial, não apenas modernizar a aparência do site.

### 2.2 Solução proposta

O PAC VII definiu um portal institucional-comercial, com catálogo consultivo, canais de contato e módulo administrativo editorial.

A navegação inicialmente proposta contemplava Home, A Bamak, Segmentos, Soluções, Catálogo, FAQ, Contato, Notícias e Agenda.

Foram excluídos e-commerce, checkout, pagamentos, orçamentos automáticos, CRM, ERP e área de cliente.

### 2.3 Arquitetura e entregáveis

A proposta técnica estabeleceu a separação entre aplicação web, API, banco relacional e integração externa de e-mail.

A stack inicial considerava Next.js, TypeScript, Tailwind CSS, shadcn/ui, NestJS, PostgreSQL, Prisma, JWT e Docker.

Foram produzidos diagnóstico, benchmarking, escopo, requisitos, arquitetura da informação, diagramas, decisões técnicas, wireframes de baixa fidelidade, planejamento de continuidade e entregáveis acadêmicos.

O PAC VII terminou com documentação e protótipos, sem aplicação funcional, banco implementado, autenticação, testes automatizados ou deploy.

A documentação original encontra-se em `docs/pac-vii/` e os entregáveis em `final/pac-vii/`.

## 3. PAC VIII — Refinamento e execução

### 3.1 Levantamento complementar

Após o PAC VII, o levantamento da operação comercial da Bamak confirmou:

- predominância de WhatsApp nas interações comerciais;
- telefone e e-mail como canais complementares;
- utilização de redes sociais principalmente como vitrine;
- visitas presenciais em determinadas negociações, especialmente relacionadas ao Cabo Aéreo;
- participação limitada do site anterior na geração de contatos;
- ausência de equipe dedicada à operação digital.

Essas informações orientaram o refinamento da solução, respeitando a capacidade operacional da empresa.

### 3.2 Alinhamento com a Bamak

Em 08/07/2026 ocorreu uma reunião presencial de alinhamento com representante da Bamak.

Foram discutidos e validados verbalmente o papel institucional-comercial do portal, a manutenção do atendimento humano, o recorte do painel administrativo, a navegação refinada, o catálogo consultivo e o destaque à aplicação de Cabo Aéreo.

Esse registro não equivale à aprovação final do software implementado, que depende de validação posterior.

O registro detalhado está em `../01-alinhamento/registro-bamak.md`.

### 3.3 Evolução da navegação

A navegação pública foi refinada para:

1. Home
2. Institucional
3. Aplicações
4. Catálogo
5. Cabo Aéreo
6. FAQ
7. Comunicação
8. Contato

As principais mudanças foram a reorganização de Segmentos e Soluções em Aplicações, a criação de uma área específica para Cabo Aéreo e a reunião de Notícias e Agenda em Comunicação.

### 3.4 Área administrativa

O painel foi delimitado às seguintes áreas:

- Painel
- Atendimentos
- Comunicação
- Configurações, conforme o recorte da primeira versão

Foram previstos os perfis Administrador e Operador.

O sistema não deverá assumir funções de CRM, ERP ou CMS estrutural completo.

### 3.5 Fluxos de negócio

Os três fluxos principais são:

1. **Contato geral:** envio de solicitação, consentimento, registro e acompanhamento interno.
2. **Cabo Aéreo:** formulário específico, informações da aplicação, localização ou referência textual, até cinco imagens, consentimento, ficha interna e PDF.
3. **Comunicação:** autenticação, criação e edição de conteúdo, validação, rascunho, publicação e gerenciamento da visibilidade pública.

A Ficha de Aplicação de Cabo Aéreo deverá permitir geração de PDF, armazenamento associado ao atendimento e envio ao e-mail da empresa, com registro da operação.

O documento é de uso interno. O portal não realiza avaliação técnica automatizada nem entrega automaticamente esse relatório ao cliente.

### 3.6 Requisitos técnicos e acadêmicos

A solução deverá contemplar frontend, backend, banco de dados com persistência real, três fluxos completos, CI/CD, análise estática, observabilidade, testes e publicação acessível.

As metas de cobertura estabelecidas são de 75% para o backend e 25% para o frontend.

A implementação é incremental. Tecnologias previstas, infraestrutura preparada e funcionalidades concluídas devem ser distinguidas nos registros de andamento.

As especificações vigentes encontram-se em:

- [RFC v2 do PAC VIII](../02-escopo/rfc-v2-pac-viii.md)
- [Requisitos, histórias de usuário, fluxos e métricas](../03-requisitos/requisitos-user-stories-fluxos-metricas.md)
- [Arquitetura Web Apps](../04-arquitetura/arquitetura-web-apps.md)
- [Decisões de produto](../04-arquitetura/decisoes-de-produto.md)

### 3.7 Consolidação dos protótipos e especificações visuais

Em 17/10/2026, o design do Portal Bamak foi consolidado no Figma em sete páginas definitivas, com fundamentos, biblioteca de componentes, áreas pública e administrativa, experiência guiada, protótipos navegáveis e handoff de implementação. A documentação vigente encontra-se em [Handoff visual](../05-design/style-tile-v3-consolidacao.md).

Essa conclusão representa o estado do desenho e da especificação visual. Conteúdos institucionais, fotografias, decisões de uso e validação final pela Bamak permanecem sujeitos à aprovação; a implementação funcional, seus testes e a publicação pública seguem as evidências correspondentes.

## 4. Regras de governança documental

### 4.1 Preservação histórica

Decisões tomadas no PAC VIII não devem ser incorporadas retroativamente aos documentos históricos do PAC VII.

A evolução deve ser registrada nos documentos atuais, mantendo a origem e a data das decisões.

### 4.2 Alterações de requisitos e escopo

Mudanças devem ser refletidas nos documentos pertinentes, incluindo RFC, requisitos, arquitetura, protótipos e critérios de validação.

Uma alteração de prioridade não deve ser apresentada como funcionalidade implementada ou requisito validado.

### 4.3 Alterações durante a implementação

Decisões técnicas, correções relevantes e mudanças funcionais devem ser rastreadas, conforme aplicável, por Issues, Pull Requests, revisão de código e documentação do PAC VIII.

Os testes devem acompanhar a implementação, e as evidências precisam corresponder a resultados efetivamente verificados.

### 4.4 Solicitações da Bamak

Uma solicitação ou alteração acordada com a empresa deve registrar:

- contexto e data;
- decisão ou solicitação;
- responsável e forma de validação;
- impacto sobre escopo e implementação;
- documentos e funcionalidades afetados;
- situação de execução.

Uma aprovação verbal ou parcial não deve ser apresentada como aceite final.

### 4.5 Retirada de funcionalidades

Itens retirados da primeira versão devem ser identificados como fora de escopo, melhoria futura, decisão pendente ou requisito substituído.

O histórico da decisão deve permanecer rastreável.

## 5. Consulta ao estado atual

O `README.md` é o índice principal do repositório e apresenta o estado atual da implementação.

Os documentos deste diretório registram decisões, requisitos e evidências do PAC VIII. O andamento operacional deve ser acompanhado também pelas Issues e Pull Requests do GitHub.

Os documentos do PAC VII permanecem como registro histórico, e não como especificação funcional vigente da aplicação.