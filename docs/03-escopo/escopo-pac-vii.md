# Escopo PAC VII

Este documento delimita o escopo consolidado no PAC VII para o projeto **Portal Web Institucional-Comercial para a Bamak**.

A entrega deste semestre é uma proposta técnica documentada. O repositório registra diagnóstico, benchmarking, arquitetura da informação, arquitetura técnica, requisitos de referência, inventário de telas, wireframes lo-fi e planejamento de continuidade. Não registra implementação funcional.

## 1. Recorte do produto

O produto proposto é um portal web para organizar a presença institucional-comercial da **Bamak Equipamentos LTDA**.

O portal foi definido para resolver uma lacuna específica: o visitante B2B precisa entender a empresa, sua atuação, seus produtos e os caminhos de contato antes de pedir orçamento ou iniciar conversa comercial.

A solução foi recortada em duas frentes:

| Frente | Papel no projeto |
|---|---|
| Área pública | Orientar visitante, parceiro ou potencial cliente antes do contato comercial. |
| Módulo administrativo | Permitir manutenção de conteúdos do portal pela Bamak, sem alteração direta no código. |

## 2. O que o PAC VII entrega

| Entrega | Situação no PAC VII | Uso no projeto |
|---|---|---|
| Diagnóstico do site atual | Consolidado | Define o problema: baixa conexão entre apresentação institucional, oferta e contato. |
| Benchmarking | Consolidado | Compara artigos, sites de referência e o caso da Bamak. |
| Critérios de avaliação | Consolidado | Orienta decisões de escopo, navegação e conteúdo. |
| Escopo funcional | Consolidado | Define área pública, módulo administrativo e limites do projeto. |
| Requisitos consolidados | Consolidado como rastreabilidade | Liga problema, telas, arquitetura e continuidade. |
| Inventário de telas | Consolidado | Lista telas públicas, detalhes previstos e telas administrativas. |
| Arquitetura da informação | Consolidada | Define sitemaps, wireflows e fluxo descoberta-contato. |
| Arquitetura técnica | Consolidada | Define Web Apps, frontend, backend, banco e serviço de e-mail. |
| Stack tecnológica | Consolidada | Orienta continuidade com Next.js, NestJS, PostgreSQL, Prisma, JWT e Docker. |
| Wireframes lo-fi | Produzidos para páginas públicas principais | Materializam a estrutura inicial, sem acabamento visual final. |
| Planejamento PAC 8 | Projetado | Organiza refinamento, implementação e validação. |

## 3. Área pública no escopo

A área pública foi organizada em nove páginas principais. Cada página tem uma função dentro do percurso do visitante.

| Página | Função no portal | Decisão de escopo |
|---|---|---|
| Home | Apresentar a Bamak e direcionar para áreas centrais. | Porta de entrada e síntese do portal. |
| A Bamak | Explicar a empresa, atuação e contexto institucional. | Separa apresentação institucional do catálogo e contato. |
| Segmentos | Mostrar os contextos atendidos pela empresa. | Ajuda o visitante a reconhecer se a Bamak atende sua realidade. |
| Soluções | Organizar frentes de atuação da empresa. | Evita que a oferta fique limitada a uma lista de produtos. |
| Catálogo | Reunir produtos em área de consulta. | Funciona como apoio ao contato, não como loja. |
| FAQ | Responder dúvidas antes do orçamento. | Reduz contato exploratório e orienta próximo passo. |
| Contato | Centralizar formulário e canais comerciais. | Etapa final do fluxo público principal. |
| Notícias | Registrar comunicados e publicações institucionais. | Sinaliza atualização pública da empresa. |
| Agenda | Registrar eventos, feiras e acontecimentos relevantes. | Apoia presença institucional e atualização pública. |

Fluxo de referência:

```txt
Home → A Bamak → Segmentos/Soluções → Catálogo → FAQ → Contato
```

## 4. Páginas de detalhe previstas

As telas de detalhe pertencem ao escopo do produto, mas não foram aprofundadas visualmente no PAC VII. Elas exigem conteúdo real da empresa e validação na continuidade.

| Tela prevista | Por que existe | Estado no PAC VII |
|---|---|---|
| Detalhe de segmento | Explicar um segmento e relacionar com soluções/produtos. | Prevista para PAC 8. |
| Detalhe de solução | Apresentar uma solução com contexto de aplicação. | Prevista para PAC 8. |
| Detalhe de produto | Mostrar descrição, categoria, aplicação e chamada para contato. | Prevista para PAC 8. |
| Detalhe de notícia | Permitir leitura completa de publicação. | Prevista para PAC 8. |
| Detalhe de evento | Mostrar data, local, descrição e contexto do evento. | Prevista para PAC 8. |

Essas telas ficaram fora da prototipação principal para evitar páginas detalhadas com conteúdo genérico.

## 5. Módulo administrativo no escopo

O módulo administrativo foi definido em nível funcional e arquitetural.

| Área | Função esperada |
|---|---|
| Login administrativo | Proteger acesso à manutenção de conteúdos. |
| Painel inicial | Reunir atalhos para áreas editáveis. |
| Notícias | Criar, editar, publicar ou ocultar publicações. |
| Agenda | Manter eventos e datas relevantes. |
| FAQ | Manter perguntas e respostas sobre pedidos, orçamento e contato. |
| Catálogo | Manter produtos e informações de consulta. |
| Segmentos | Manter contextos de atuação. |
| Soluções | Manter frentes de solução. |
| Conteúdos institucionais | Atualizar blocos textuais da apresentação da empresa. |
| Mensagens de contato | Consultar registros enviados pelo formulário. |

O painel tem função editorial e comercial. Ele não foi definido como CRM, ERP, área de cliente ou sistema de vendas.

## 6. Escopo técnico definido

A arquitetura técnica adotada segue a linha **Web Apps**.

| Componente | Papel |
|---|---|
| Aplicação web frontend | Exibir área pública e acesso administrativo. |
| API backend | Concentrar autenticação, validações, regras e operações de conteúdo. |
| Banco de dados relacional | Persistir conteúdos administráveis e mensagens de contato. |
| Serviço externo de e-mail | Encaminhar mensagens enviadas pelo formulário. |

Stack proposta:

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |

A stack foi definida para continuidade. Ela não indica que o projeto já possui código funcional.

## 7. Critério de conclusão do PAC VII

O PAC VII está concluído quando o projeto possui:

- problema central documentado;
- diagnóstico do site atual;
- benchmarking com critérios de avaliação;
- escopo público e administrativo delimitado;
- requisitos de referência;
- inventário de telas;
- fluxo descoberta-contato;
- arquitetura Web Apps definida;
- stack tecnológica justificada;
- wireframes lo-fi das páginas públicas principais;
- planejamento do PAC 8.

## 8. Próxima etapa

O PAC 8 deve transformar esta base em:

- telas de detalhe públicas;
- painel administrativo refinado;
- interface visual final;
- implementação da área pública;
- implementação do módulo administrativo;
- validação com a Bamak;
- documentação final com evidências de uso.
