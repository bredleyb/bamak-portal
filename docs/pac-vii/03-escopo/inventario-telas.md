# Inventário de telas

Este documento lista as telas definidas para o **Portal Web Institucional-Comercial para a Bamak**.

O inventário registra o estado do PAC VII e separa o que já foi materializado em wireframe lo-fi do que ficou previsto para o PAC 8.

## 1. Legenda

| Status | Significado |
|---|---|
| Lo-fi | Tela representada em baixa fidelidade no PAC VII. |
| Definida | Tela incluída no escopo, sem wireframe final nesta etapa. |
| PAC 8 | Tela prevista para detalhamento, refinamento ou implementação. |
| Suporte | Estado auxiliar necessário para funcionamento posterior. |

## 2. Telas públicas principais

| ID | Tela | Função | Entrada provável | Saída esperada | Status |
|---|---|---|---|---|---|
| PUB-01 | Home | Sintetizar a Bamak e direcionar para áreas centrais. | Acesso direto ao site. | A Bamak, Segmentos, Soluções, Catálogo, FAQ ou Contato. | Lo-fi |
| PUB-02 | A Bamak | Explicar empresa, atuação e contexto institucional. | Home ou menu. | Segmentos, Soluções ou Contato. | Lo-fi |
| PUB-03 | Segmentos | Mostrar contextos atendidos pela empresa. | Home, menu ou A Bamak. | Detalhe de segmento ou Soluções. | Lo-fi |
| PUB-04 | Soluções | Organizar frentes de solução. | Home, Segmentos ou menu. | Detalhe de solução ou Catálogo. | Lo-fi |
| PUB-05 | Catálogo | Permitir consulta de produtos. | Home, Soluções, menu ou busca interna futura. | Detalhe de produto, FAQ ou Contato. | Lo-fi |
| PUB-06 | FAQ | Responder dúvidas antes do orçamento. | Home, Catálogo, Contato ou menu. | Contato. | Lo-fi |
| PUB-07 | Contato | Centralizar formulário e canais comerciais. | Qualquer página pública. | Envio de mensagem ou contato direto. | Lo-fi |
| PUB-08 | Notícias | Listar publicações institucionais. | Home ou menu. | Detalhe de notícia. | Lo-fi |
| PUB-09 | Agenda | Listar eventos e feiras. | Home ou menu. | Detalhe de evento. | Lo-fi |

## 3. Telas públicas de detalhe

| ID | Tela | Função | Dependência principal | Status |
|---|---|---|---|---|
| PUB-10 | Detalhe de segmento | Explicar segmento e relacionar com soluções/produtos. | Conteúdo real sobre segmentos atendidos. | PAC 8 |
| PUB-11 | Detalhe de solução | Explicar solução, contexto e relação com oferta. | Conteúdo real sobre frentes de solução. | PAC 8 |
| PUB-12 | Detalhe de produto | Mostrar descrição, categoria, aplicação e chamada para contato. | Catálogo validado com a Bamak. | PAC 8 |
| PUB-13 | Detalhe de notícia | Exibir publicação completa. | Conteúdo de notícias. | PAC 8 |
| PUB-14 | Detalhe de evento | Exibir data, local, descrição e contexto. | Conteúdo de agenda. | PAC 8 |

## 4. Telas administrativas

| ID | Tela | Função | Conteúdo administrado | Status |
|---|---|---|---|---|
| ADM-01 | Login administrativo | Autenticar administrador. | Credenciais administrativas. | Definida |
| ADM-02 | Painel inicial | Exibir atalhos e visão geral de manutenção. | Resumos de conteúdo e mensagens. | PAC 8 |
| ADM-03 | Gestão de notícias | Criar, editar, publicar ou ocultar notícias. | Notícias. | PAC 8 |
| ADM-04 | Gestão de agenda | Criar, editar, publicar ou ocultar eventos. | Agenda. | PAC 8 |
| ADM-05 | Gestão de FAQ | Criar, editar, ordenar ou ocultar perguntas. | FAQ. | PAC 8 |
| ADM-06 | Gestão de catálogo | Criar, editar, categorizar ou ocultar produtos. | Produtos e categorias. | PAC 8 |
| ADM-07 | Gestão de segmentos | Manter contextos atendidos. | Segmentos. | PAC 8 |
| ADM-08 | Gestão de soluções | Manter frentes de solução. | Soluções. | PAC 8 |
| ADM-09 | Conteúdos institucionais | Atualizar textos da apresentação da empresa. | Blocos institucionais. | PAC 8 |
| ADM-10 | Mensagens de contato | Consultar mensagens enviadas pelo formulário. | Mensagens recebidas. | PAC 8 |

## 5. Estados de suporte previstos

| ID | Estado | Onde aparece | Motivo |
|---|---|---|---|
| SUP-01 | Página não encontrada | Rotas públicas inexistentes. | Evitar erro sem orientação. |
| SUP-02 | Listagem vazia | Catálogo, Notícias, Agenda, FAQ. | Tratar ausência de conteúdo publicado. |
| SUP-03 | Erro de envio | Formulário de contato. | Informar falha sem perder contexto. |
| SUP-04 | Envio confirmado | Formulário de contato. | Confirmar recebimento da mensagem. |
| SUP-05 | Acesso negado | Área administrativa. | Bloquear usuário sem autenticação. |
| SUP-06 | Sessão expirada | Área administrativa. | Exigir novo login. |

## 6. Mapa público resumido

```txt
Home
├── A Bamak
├── Segmentos
│   └── Detalhe de segmento
├── Soluções
│   └── Detalhe de solução
├── Catálogo
│   └── Detalhe de produto
├── FAQ
├── Contato
├── Notícias
│   └── Detalhe de notícia
└── Agenda
    └── Detalhe de evento
```

## 7. Mapa administrativo resumido

```txt
Login administrativo
└── Painel inicial
    ├── Gestão de notícias
    ├── Gestão de agenda
    ├── Gestão de FAQ
    ├── Gestão de catálogo
    ├── Gestão de segmentos
    ├── Gestão de soluções
    ├── Conteúdos institucionais
    └── Mensagens de contato
```

## 8. Telas priorizadas no PAC VII

As telas públicas principais foram priorizadas porque definem o percurso-base do visitante.

```txt
Home
A Bamak
Segmentos
Soluções
Catálogo
FAQ
Contato
Notícias
Agenda
```

As telas administrativas foram delimitadas, mas não refinadas visualmente. Essa decisão mantém o PAC VII concentrado em diagnóstico, proposta, arquitetura e baixa fidelidade.

## 9. Prioridade para PAC 8

Ordem recomendada:

1. Detalhar páginas de segmento, solução e produto.
2. Definir dashboard administrativo e formulários de gestão.
3. Refinar visual das telas públicas.
4. Implementar fluxo público principal.
5. Implementar autenticação e manutenção de conteúdos.
6. Validar fluxo descoberta-contato e autonomia administrativa.
