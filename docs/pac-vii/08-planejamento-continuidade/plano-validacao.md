# Plano de validação — PAC 8

## Finalidade

Este plano define como validar a continuidade do Portal Web Institucional-Comercial da Bamak no PAC 8.

A validação deve verificar se a solução implementada cumpre o recorte do projeto: orientar o visitante antes do contato comercial e permitir manutenção dos conteúdos centrais pelo módulo administrativo.

## Escopo da validação

Serão validados:

- navegação pública;
- clareza institucional;
- segmentos e soluções;
- catálogo consultivo;
- FAQ;
- formulário de contato;
- notícias e agenda, se implementadas;
- módulo administrativo;
- responsividade;
- coerência com o recorte sem funcionalidades transacionais.

Não serão validados:

- venda online;
- pagamento;
- checkout;
- cálculo de frete;
- orçamento automatizado;
- CRM;
- ERP;
- impacto comercial real;
- métricas de conversão em produção.

## Perfis de validação

| Perfil | Papel na validação |
|---|---|
| Representante da Bamak | Verificar se conteúdo, fluxo e linguagem representam a empresa. |
| Usuário-teste externo | Executar tarefas como visitante ou parceiro comercial. |
| Autor do projeto | Registrar evidências, observar problemas e aplicar ajustes. |
| Professor/orientador, se aplicável | Avaliar coerência acadêmica, técnica e documental. |

O usuário-teste não precisa conhecer o projeto previamente. O ideal é que ele tente usar o portal a partir das tarefas propostas, sem explicação excessiva antes do teste.

## Ambientes e artefatos usados

Artefatos de base:

- wireframes lo-fi em PDF;
- inventário de telas;
- sitemap público;
- sitemap administrativo;
- arquitetura Web Apps;
- backlog inicial;
- versão funcional do PAC 8.

Evidências esperadas:

- prints das telas;
- registro de execução das tarefas;
- lista de problemas encontrados;
- ajustes realizados;
- pendências justificadas;
- feedback resumido da Bamak ou de usuários-teste.

## Critérios gerais de sucesso

A validação será considerada satisfatória se:

1. o visitante entender quem é a Bamak;
2. o visitante localizar segmentos, soluções ou produtos;
3. o catálogo for entendido como consulta, não como loja;
4. a FAQ ajudar antes do contato;
5. o formulário permitir envio claro de demanda;
6. o administrador conseguir manter conteúdos centrais;
7. as principais páginas funcionarem em desktop e mobile;
8. o portal preservar o recorte sem e-commerce, CRM ou ERP.

## Validação 1 — Navegação pública principal

### Objetivo

Verificar se o visitante consegue percorrer o fluxo principal do portal.

Fluxo esperado:

```txt
Home
→ A Bamak
→ Segmentos ou Soluções
→ Catálogo
→ FAQ
→ Contato
```

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| VP-01 | Encontrar uma explicação sobre quem é a Bamak. | Usuário chega à página institucional ou entende a empresa pela Home. |
| VP-02 | Localizar uma área que mostre segmentos atendidos. | Usuário encontra a página Segmentos. |
| VP-03 | Localizar soluções oferecidas. | Usuário encontra a página Soluções. |
| VP-04 | Acessar o catálogo. | Usuário encontra produtos ou lista de produtos. |
| VP-05 | Sair do catálogo para contato. | Usuário encontra CTA ou caminho claro para contato. |

### Evidência

- rota percorrida;
- pontos de dúvida;
- cliques errados relevantes;
- tempo aproximado por tarefa, se for medido;
- observações do usuário.

## Validação 2 — Catálogo consultivo

### Objetivo

Verificar se o catálogo apoia consulta comercial sem parecer e-commerce.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| CAT-01 | Procurar um produto pelo campo de busca. | Usuário entende onde pesquisar. |
| CAT-02 | Usar filtros ou categorias. | Usuário consegue refinar a listagem. |
| CAT-03 | Identificar categoria, nome e código/SKU, se houver. | Card comunica dados mínimos. |
| CAT-04 | Acessar detalhe de produto. | Usuário encontra “Ver detalhes” ou caminho equivalente. |
| CAT-05 | Solicitar contato a partir do produto. | Usuário encontra CTA comercial. |
| CAT-06 | Identificar se há compra online. | Usuário entende que o portal não vende diretamente. |

### Critérios de atenção

Problemas críticos:

- usuário procura carrinho;
- usuário acha que o produto está à venda online;
- filtro não ajuda a encontrar produto;
- detalhe do produto não orienta próximo passo;
- CTA de contato fica escondido.

### Evidência

- produto usado no teste;
- filtros utilizados;
- tela de detalhe acessada;
- feedback sobre clareza do catálogo;
- print do fluxo.

## Validação 3 — FAQ antes do contato

### Objetivo

Verificar se a FAQ reduz dúvidas básicas antes do formulário.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| FAQ-01 | Encontrar informações sobre orçamento ou pedido. | Usuário localiza pergunta relacionada. |
| FAQ-02 | Expandir uma pergunta. | Acordeão funciona e resposta é legível. |
| FAQ-03 | Ir da FAQ para contato. | CTA ou link de contato está claro. |

### Evidência

- perguntas acessadas;
- dúvidas que não foram respondidas;
- sugestões de novas perguntas;
- print da FAQ.

## Validação 4 — Formulário de contato

### Objetivo

Verificar se o visitante consegue enviar uma demanda comercial com dados suficientes para retorno.

### Campos mínimos

- nome;
- empresa;
- e-mail;
- telefone/WhatsApp;
- assunto;
- mensagem;
- produto de interesse, se aplicável.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| CT-01 | Preencher contato com dados válidos. | Formulário aceita envio. |
| CT-02 | Tentar enviar sem campo obrigatório. | Sistema aponta erro. |
| CT-03 | Enviar mensagem relacionada a produto. | Produto/contexto é registrado, se implementado. |
| CT-04 | Ver confirmação de envio. | Usuário entende que a mensagem foi enviada. |
| CT-05 | Verificar registro no admin. | Mensagem aparece no painel. |

### Evidência

- print do formulário preenchido;
- print da confirmação;
- registro da mensagem no admin;
- erros encontrados.

## Validação 5 — Notícias e agenda

### Objetivo

Verificar se notícias e agenda funcionam como áreas de atualização pública, sem competir com o fluxo comercial principal.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| NA-01 | Encontrar notícias. | Usuário acessa listagem. |
| NA-02 | Filtrar ou navegar pelas notícias. | Usuário entende cards, categoria e data. |
| NA-03 | Abrir detalhe de notícia. | Conteúdo detalhado aparece. |
| AG-01 | Encontrar eventos futuros. | Usuário entende a agenda. |
| AG-02 | Identificar data e localização. | Card comunica dados mínimos. |
| AG-03 | Acessar histórico, se implementado. | Separação entre futuro e histórico é compreensível. |

### Evidência

- itens acessados;
- problemas de nomenclatura;
- sugestões da Bamak sobre eventos e notícias.

## Validação 6 — Módulo administrativo

### Objetivo

Verificar se a Bamak consegue manter conteúdos centrais sem alteração direta no código.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| ADM-01 | Entrar no painel com usuário administrativo. | Login funciona. |
| ADM-02 | Tentar acessar admin sem login. | Acesso é bloqueado. |
| ADM-03 | Criar ou editar produto. | Produto é salvo. |
| ADM-04 | Publicar ou ocultar produto. | Estado reflete na área pública. |
| ADM-05 | Criar ou editar FAQ. | Pergunta aparece corretamente. |
| ADM-06 | Criar ou editar notícia. | Notícia aparece na listagem pública. |
| ADM-07 | Criar ou editar evento. | Evento aparece na agenda. |
| ADM-08 | Visualizar mensagem de contato. | Dados enviados aparecem no painel. |

### Critérios de atenção

Problemas críticos:

- painel permite acesso sem autenticação;
- conteúdo editado não aparece na área pública;
- administrador não entende campos;
- edição permite quebrar layout;
- mensagem de contato não fica registrada.

### Evidência

- prints do login;
- prints das listagens administrativas;
- antes/depois de uma edição;
- registro de mensagem recebida;
- problemas encontrados.

## Validação 7 — Responsividade

### Objetivo

Verificar se as páginas principais funcionam em desktop e mobile.

### Telas mínimas

- Home;
- Catálogo;
- FAQ;
- Contato;
- Admin, pelo menos login e listagem principal.

### Tarefas

| ID | Tarefa | Critério de sucesso |
|---|---|---|
| RESP-01 | Abrir Home em largura mobile. | Menu e CTAs continuam acessíveis. |
| RESP-02 | Usar catálogo no mobile. | Busca, filtros e cards continuam utilizáveis. |
| RESP-03 | Preencher formulário no mobile. | Campos são legíveis e envio funciona. |
| RESP-04 | Usar FAQ no mobile. | Acordeões funcionam sem quebra visual. |
| RESP-05 | Acessar admin em tela menor. | Operações básicas continuam possíveis. |

### Evidência

- prints desktop;
- prints mobile;
- problemas de quebra visual;
- ajustes aplicados.

## Validação 8 — Coerência com o recorte do projeto

### Objetivo

Confirmar que a implementação não desviou para funcionalidades fora do escopo.

### Checklist

| Item | Esperado |
|---|---|
| Catálogo | Consulta e detalhe, sem compra. |
| Produto | CTA para contato, sem carrinho. |
| Contato | Mensagem enviada para atendimento humano. |
| Admin | Gestão de conteúdo, sem CRM/ERP. |
| Notícias/Agenda | Atualização pública, sem função comercial automatizada. |
| Área de cliente | Ausente. |
| Pagamento | Ausente. |
| Orçamento automático | Ausente. |

### Evidência

- prints do catálogo;
- prints do detalhe de produto;
- prints do contato;
- prints do admin;
- observação final sobre escopo.

## Registro de problemas

Cada problema encontrado deve ser registrado no seguinte formato:

| Campo | Descrição |
|---|---|
| ID | Código do problema. |
| Tela | Página ou área afetada. |
| Tipo | Navegação, conteúdo, visual, técnico, admin ou escopo. |
| Descrição | O que aconteceu. |
| Gravidade | Alta, média ou baixa. |
| Ação | Corrigir, ajustar depois ou aceitar limitação. |
| Status | Aberto, corrigido ou pendente. |

Exemplo:

| ID | Tela | Tipo | Descrição | Gravidade | Ação | Status |
|---|---|---|---|---|---|---|
| VAL-01 | Catálogo | Navegação | Usuário não percebeu o botão de contato no detalhe do produto. | Alta | Reposicionar CTA. | Aberto |

## Critérios de fechamento da validação

A validação pode ser encerrada quando:

- fluxos P0 foram testados;
- problemas críticos foram corrigidos ou documentados;
- Bamak revisou os pontos centrais;
- formulário de contato foi testado;
- admin foi testado em pelo menos dois conteúdos;
- evidências foram salvas;
- limitações restantes foram registradas.

## Resultado esperado

Ao final da validação, o projeto deve demonstrar que:

- o portal organiza melhor a apresentação da Bamak;
- o visitante encontra segmentos, soluções, catálogo, FAQ e contato;
- o catálogo funciona como consulta comercial;
- o formulário conduz a demanda para atendimento humano;
- o painel permite manutenção básica dos conteúdos;
- a solução continua dentro do recorte definido no PAC VII.
