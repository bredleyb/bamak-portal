# Estado atual do projeto

Este repositório representa o estado do projeto ao final do **PAC VII**. Ele documenta a proposta técnica do **Portal Web Institucional-Comercial para a Bamak**, sem implementação funcional nesta etapa.

O material atual consolida diagnóstico, benchmarking, escopo, arquitetura da informação, arquitetura técnica, wireframes lo-fi e planejamento para o PAC 8.

## 1. Produto proposto

O projeto propõe um portal web para a **Bamak Equipamentos LTDA**, organizado em duas frentes:

| Frente | Papel no projeto |
|---|---|
| **Área pública institucional-comercial** | Orientar visitantes, parceiros e potenciais clientes antes do contato comercial. |
| **Módulo administrativo autenticado** | Permitir que a Bamak mantenha conteúdos do portal sem alteração direta no código. |

A área pública organiza o percurso do visitante em torno de apresentação institucional, segmentos, soluções, catálogo, FAQ, notícias, agenda e contato. O módulo administrativo permanece definido em nível funcional e arquitetural, com aprofundamento previsto para o PAC 8.

## 2. Problema que o projeto trata

O site atual da Bamak apresenta baixa articulação entre três pontos:

1. quem é a empresa;
2. o que ela oferece;
3. como o visitante inicia contato comercial.

O problema principal está na organização da informação e no caminho de navegação. O visitante B2B precisa entender a empresa, reconhecer se a oferta se relaciona com sua necessidade e chegar ao contato com mais contexto.

## 3. Entrega do PAC VII

A entrega atual é uma base de projeto. Ela inclui:

| Entrega | Estado |
|---|---|
| Diagnóstico do site atual | Consolidado |
| Problema central | Definido |
| Benchmarking e matriz comparativa | Consolidado |
| Critérios de avaliação | Definidos |
| Escopo público e administrativo | Delimitado |
| Requisitos consolidados | Registrados como rastreabilidade |
| Inventário de telas | Definido |
| Fluxo descoberta-contato | Definido |
| Arquitetura Web Apps | Definida |
| Stack tecnológica | Definida |
| Wireframes lo-fi das páginas públicas principais | Produzidos |
| Planejamento do PAC 8 | Projetado |

## 4. O que ainda não existe

Este repositório não deve ser interpretado como sistema pronto. No estado atual, ainda não existem:

- frontend implementado;
- backend implementado;
- banco configurado;
- autenticação funcionando;
- CRUDs administrativos;
- integração real com e-mail;
- deploy;
- testes funcionais;
- telas finais de alta fidelidade;
- validação de uso com sistema navegável.

Esses itens pertencem ao PAC 8.

## 5. Recorte funcional atual

O projeto está delimitado como portal institucional-comercial. O escopo atual inclui:

- apresentação da Bamak;
- organização de segmentos;
- organização de soluções;
- catálogo consultivo;
- FAQ antes do contato;
- página de contato;
- notícias;
- agenda;
- módulo administrativo para manutenção de conteúdo.

O catálogo foi definido como consulta, não como loja virtual. A FAQ foi definida como orientação pré-contato, não como substituta do atendimento comercial. O painel administrativo foi definido como ferramenta editorial e comercial, não como CRM ou ERP.

## 6. Fora do escopo do PAC VII

Ficam fora do estado atual:

| Item | Motivo |
|---|---|
| E-commerce | O projeto prepara contato comercial, não venda online. |
| Carrinho e checkout | Não há fluxo transacional previsto. |
| Pagamento online | A negociação permanece nos canais da empresa. |
| Orçamento automatizado | Regras comerciais não foram levantadas para automação. |
| CRM | Gestão de relacionamento ampliaria o escopo além do portal. |
| ERP | Processos internos não pertencem ao problema trabalhado. |
| Área de cliente | Login de cliente, histórico e pedidos não foram definidos como necessidade atual. |
| Métricas de impacto comercial | Dependem de uso real após implementação. |

## 7. Como ler este repositório

A leitura correta deve seguir esta ordem:

1. `README.md` para visão geral.
2. `entregaveis/bamak-pac-vii-artigo.pdf` para fundamentação acadêmica.
3. `docs/00-visao-geral/estado-atual.md` para entender o estado do repositório.
4. `docs/01-diagnostico/` para entender o problema.
5. `docs/02-benchmarking/` para entender os critérios.
6. `docs/03-escopo/` para entender limites e requisitos.
7. `docs/04-arquitetura-informacao/` para entender a navegação.
8. `docs/05-arquitetura-tecnica/` para entender a solução técnica proposta.
9. `docs/06-decisoes/` para entender decisões de recorte.
10. `docs/07-wireframes-lo-fi/` para ver a materialização inicial.
11. `docs/08-planejamento-pac-8/` para ver a continuidade.

## 8. Próximo estado esperado

No PAC 8, a base atual deve evoluir para:

- revisão do escopo com a Bamak;
- detalhamento das páginas de segmento, solução, produto, notícia e evento;
- aprofundamento do módulo administrativo;
- refinamento visual;
- implementação da área pública;
- implementação administrativa;
- testes constantes;
- validação com base no uso esperado pela Bamak e pelo visitante.

O critério central de continuidade é simples: o portal precisa orientar melhor o visitante antes do contato e permitir que a Bamak mantenha conteúdos centrais sem editar código.
