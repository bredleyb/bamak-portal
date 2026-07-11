# Hierarquia visual, grid e cards

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak |
| Fase | Pré-PAC VIII |
| Escopo | Portal público e painel administrativo |
| Status | Em definição |
| Última atualização | 11/07/2026 |

## 1. Objetivo

Registrar a direção preliminar de hierarquia visual, grid responsivo, espaçamento e estilo de cards antes da criação do style tile no Figma.

As decisões partem dos wireframes lo-fi do PAC VII, que permanecem como referência estrutural, mas precisam ser refinados para evitar uma interface formada por blocos visualmente equivalentes, excesso de cards e pouca diferenciação entre o portal público e o painel administrativo.

## 2. Referências estruturais

A análise considerou os wireframes lo-fi de:

```text
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

A arquitetura pública atual é:

```text
Home
Institucional
Portfólio
Catálogo
Cabo Aéreo
FAQ
Comunicação
Contato
```

Os wireframes definem corretamente:

- versões desktop e mobile;
- ordem geral das seções;
- grids de conteúdo;
- catálogo com busca, filtros e resultados;
- formulários com área auxiliar;
- FAQ em acordeão;
- áreas institucionais, CTA e rodapé.

Ainda precisavam ser definidos:

- intensidade da hierarquia;
- dimensões da malha;
- densidade por ambiente;
- diferenças entre cards, painéis, listas e seções;
- comportamento responsivo intermediário.

## 3. Decisões gerais

O Portal Bamak usará:

```text
grid responsivo de 4, 8 e 12 colunas
escala espacial baseada em 8 px
hierarquia pública mais editorial
hierarquia administrativa mais operacional
cards planos, contornados e sem sombra permanente
```

O grid de 12 colunas no desktop atende às divisões recorrentes do produto:

```text
7 + 5
8 + 4
3 + 9
3 cards
4 cards
```

O portal público e o painel administrativo compartilharão o mesmo sistema-base, mas terão diferentes densidades, proporções de superfícies e padrões de composição.

## 4. Hierarquia visual

### 4.1 Níveis

A interface terá cinco níveis recorrentes.

#### Nível 1 — estrutura global

- cabeçalho;
- navegação;
- área principal;
- rodapé;
- navegação administrativa.

#### Nível 2 — introdução da página

- trilha de navegação, quando necessária;
- título principal;
- texto introdutório;
- ação principal;
- imagem principal opcional.

Cada página deve possuir somente um título principal e uma ação dominante nessa região.

#### Nível 3 — seções

Cada seção poderá conter:

- título;
- introdução curta;
- ação secundária;
- conteúdo principal.

O espaço acima da seção deve ser maior que o espaço entre o título e seu conteúdo.

#### Nível 4 — componentes e coleções

- cards;
- acordeões;
- listas;
- filtros;
- formulários;
- tabelas;
- painéis operacionais.

Cada coleção deve ter uma função clara. Não haverá um card genérico para qualquer tipo de conteúdo.

#### Nível 5 — metadados e estados

- datas;
- categorias;
- códigos;
- status;
- textos auxiliares;
- paginação;
- mensagens de validação.

Esses elementos terão menor destaque, mas continuarão legíveis e acessíveis.

### 4.2 Dominância

Cada seção ou viewport deve possuir um elemento dominante identificável.

A dominância será construída por:

1. escala tipográfica;
2. peso;
3. posição;
4. espaço ao redor;
5. contraste de superfície;
6. imagem;
7. cor institucional.

O verde não será usado como principal recurso de hierarquia em todos os elementos.

### 4.3 Portal público

A área pública poderá usar:

- composições assimétricas;
- imagens maiores;
- superfícies inversas;
- maior espaçamento vertical;
- títulos maiores;
- alternância controlada de superfícies.

A assimetria será concentrada em:

- hero da Home;
- introdução institucional;
- destaques de Portfólio;
- apresentação do Cabo Aéreo.

Listagens, formulários e conteúdos extensos permanecerão mais regulares.

### 4.4 Painel administrativo

O painel terá:

- menor espaçamento vertical;
- títulos menores;
- superfícies neutras;
- maior repetição de alinhamentos;
- mais tabelas, filtros e estados;
- verde concentrado em ações e seleção.

A hierarquia deve priorizar:

```text
tarefa atual
→ informação necessária
→ ação disponível
→ estado do processo
```

Cards não substituirão tabelas ou listas quando a comparação entre dados for importante.

## 5. Superfícies e agrupamento

Serão usados três níveis principais:

```text
surface/page
surface/subtle
surface/inverse
```

### `surface/page`

Fundo geral da página.

### `surface/subtle`

Usado para:

- alternância de seção;
- área de filtros;
- bloco operacional;
- conteúdo auxiliar.

### `surface/inverse`

Usado com moderação em:

- CTA institucional;
- rodapé;
- faixa estratégica;
- destaque principal.

Fundos podem ocupar toda a largura do viewport, mas o conteúdo interno permanece alinhado ao container.

Evitar:

```text
fundo da página
└── caixa grande
    └── caixas menores
        └── cards
```

Os retângulos dos wireframes não devem ser convertidos automaticamente em caixas visuais finais.

## 6. Grid responsivo

### 6.1 Container público

```text
largura máxima: 1280 px
alinhamento: centralizado
padding lateral: responsivo
```

Fundos e fotografias podem ocupar toda a largura. Textos e componentes permanecem contidos.

### 6.2 Configuração por frame

| Frame | Colunas | Margem | Gutter |
|---|---:|---:|---:|
| `390 px` | 4 | `16 px` | `16 px` |
| `768 px` | 8 | `24 px` | `16 px` |
| `1024 px` | 8 | `32 px` | `24 px` |
| `1440 px` | 12 | `80 px` | `24 px` |

No frame de `1440 px`:

```text
1440 - 80 - 80 = 1280 px
```

### 6.3 Faixas operacionais

```text
Compacto: 320–767 px
Médio: 768–1279 px
Expandido: 1280 px ou mais
```

Os componentes podem mudar em pontos intermediários quando o conteúdo exigir.

### 6.4 Reflow

Em `320 CSS px`, as estruturas públicas devem funcionar em uma coluna, exceto componentes genuinamente bidimensionais.

Quando uma tabela exigir rolagem horizontal, a rolagem deve ficar restrita ao componente.

### 6.5 Ordem de empilhamento

```text
título e contexto
imagem ou visual de apoio
conteúdo
ação
```

A ordem deve preservar leitura e foco.

## 7. Escala de espaçamento

A base será `8 px`, com `4 px` para ajustes internos pequenos.

```text
spacing/4   = 4 px
spacing/8   = 8 px
spacing/12  = 12 px
spacing/16  = 16 px
spacing/24  = 24 px
spacing/32  = 32 px
spacing/48  = 48 px
spacing/64  = 64 px
spacing/80  = 80 px
spacing/96  = 96 px
```

### Valores operacionais

| Relação | Expandido | Médio | Compacto |
|---|---:|---:|---:|
| Padding vertical de seção pública | `96 px` | `64 px` | `48 px` |
| Título de seção → conteúdo | `32 px` | `24 px` | `24 px` |
| Gutter entre cards | `24 px` | `24 px` | `16 px` |
| Padding de página administrativa | `32 px` | `24 px` | `16 px` |
| Padding de card padrão | `24 px` | `24 px` | `20 px` |
| Padding de card compacto | `16 px` | `16 px` | `16 px` |

Valores arbitrários devem ser evitados.

## 8. Aplicação por página

### 8.1 Home

#### Hero

```text
Expandido: texto 7 + imagem 5
Médio: 4 + 4 ou empilhado
Compacto: 1 coluna
```

Conteúdo máximo:

- título;
- texto de apoio;
- até duas ações;
- imagem industrial relevante.

#### Destaques

```text
Expandido: 3 ou 4 cards
Médio: 2 cards
Compacto: 1 card
```

#### FAQ resumido

```text
Expandido:
introdução: 4 colunas
acordeão: 8 colunas

Compacto:
introdução
acordeão
```

#### Comunicação

```text
Expandido: 3 cards
Médio: 2 cards
Compacto: 1 card
```

A Home não deve parecer uma sequência de caixas equivalentes.

### 8.2 Institucional

#### Introdução

```text
Expandido: texto 6 + imagem 6
Médio: 4 + 4
Compacto: empilhado
```

#### Indicadores

Os indicadores serão tiles de dados.

```text
Expandido: 4
Médio: 2
Compacto: 1 ou 2
```

#### Linha do tempo

- horizontal no desktop;
- vertical no compacto;
- cada evento será um item da timeline, não um card isolado.

### 8.3 Portfólio

```text
Expandido: 3 colunas
Médio: 2 colunas
Compacto: 1 coluna
```

Um projeto em destaque pode ocupar seis ou oito colunas.

### 8.4 Catálogo

#### Expandido

```text
filtros: 3 colunas
resultados: 9 colunas
cards: 3 por linha
```

#### Entre 1024 e 1279 px

```text
filtros: 2 de 8 colunas
resultados: 6 de 8 colunas
cards: 2 por linha
```

#### Abaixo de 1024 px

Os filtros passam para:

```text
botão “Filtros”
→ drawer, sheet ou painel expansível
```

Resultados:

```text
640–1023 px: 2 cards
320–639 px: 1 card
```

Dois cards lado a lado não serão usados no mobile estreito.

### 8.5 Cabo Aéreo e Contato

#### Expandido

```text
formulário ou fluxo: 7 colunas
apoio, contato ou mapa: 5 colunas
```

#### Médio

```text
formulário: 5 de 8
apoio: 3 de 8
```

#### Compacto

```text
formulário
apoio
mapa ou canais
```

O bloco lateral será um painel de apoio, não um card promocional.

### 8.6 FAQ

```text
Expandido:
introdução: 4 colunas
acordeão: 8 colunas

Compacto:
1 coluna
```

Perguntas e respostas permanecem em acordeão.

### 8.7 Comunicação

```text
Expandido: 3 cards
Médio: 2 cards
Compacto: 1 card
```

Filtros ficam acima da coleção. Não haverá sidebar permanente.

## 9. Grid administrativo

### 9.1 Shell

```text
Expandido:
sidebar = 256 px
conteúdo = restante

Médio:
rail = 72 px
conteúdo = restante

Compacto:
sidebar = drawer
conteúdo = largura total
```

### 9.2 Conteúdo

- tabelas podem usar toda a largura;
- formulários terão largura limitada;
- painéis de detalhe podem ocupar até `960 px`;
- textos e campos simples não devem atravessar telas ultralargas.

### 9.3 Painel

```text
Expandido: 4 tiles
Médio: 2 tiles
Compacto: 1 tile
```

### 9.4 Atendimentos

Usar:

- toolbar;
- busca;
- filtros;
- tabela;
- status;
- paginação;
- página ou painel de detalhe.

Não representar cada atendimento como card no desktop.

### 9.5 Comunicação administrativa

Usar tabela ou lista estruturada.

Cards apenas para:

- preview de publicação;
- seleção de modelo;
- visualização de mídia.

## 10. Estilo dos cards

### 10.1 Direção visual

```text
contorno discreto
superfície plana
raio moderado
sem sombra permanente
sem efeito de flutuação exagerado
```

### 10.2 Aparência-base

```text
raio: 8 px
borda: 1 px
padding: 24 px
padding compacto: 16 px
sombra padrão: nenhuma
```

Não usar:

- raio de `20–32 px`;
- escala no hover;
- rotação;
- gradientes decorativos;
- sombras pesadas;
- contornos duplos;
- card dentro de card.

### 10.3 Anatomia

Um card pode conter:

```text
media opcional
metadado ou categoria
título
descrição
dado auxiliar
ação
```

Ordem padrão:

```text
imagem
categoria ou status
título
descrição
metadado complementar
ação
```

### 10.4 Espaçamento interno

```text
imagem → conteúdo: 20 ou 24 px
categoria → título: 8 px
título → descrição: 8 px
descrição → metadado: 12 px
conteúdo → ação: 16 ou 24 px
```

### 10.5 Altura

Cards da mesma linha podem ter altura visual igual e ação alinhada ao rodapé.

Não usar altura fixa para o conteúdo textual. Imagens podem ter proporção fixa.

### 10.6 Estados

#### Default

- borda discreta;
- fundo neutro;
- título com contraste principal.

#### Hover

- borda mais forte;
- mudança sutil de superfície;
- sombra leve opcional;
- sem alteração de tamanho.

#### Active

- superfície selecionada;
- borda institucional;
- sem deslocamento físico.

#### Focus

- anel de foco;
- não depender apenas da borda;
- visível em fundos claros e escuros.

#### Selected

Somente para cards realmente selecionáveis.

## 11. Variantes do projeto

### 11.1 Card de Portfólio

```text
imagem 16:9
segmento ou tipo
título
contexto ou resultado curto
link para o projeto
```

Grid:

```text
3 / 2 / 1
```

### 11.2 Card de produto

```text
imagem 4:3
categoria
nome
descrição curta ou aplicação
código opcional
“Ver detalhes”
```

Grid:

```text
3 / 2 / 1
```

Não incluir:

- preço;
- compra;
- carrinho;
- estrelas;
- selo promocional.

### 11.3 Card de Comunicação

```text
imagem 16:9, quando existir
categoria
data
título
resumo
link
```

Grid:

```text
3 / 2 / 1
```

### 11.4 Card de contato

```text
ícone
nome do canal
informação principal
horário ou observação
ação
```

Grid:

```text
4 / 2 / 1
```

### 11.5 Tile de indicador

```text
rótulo
valor
contexto ou período
tendência opcional
```

Não usa a mesma anatomia de um card editorial.

### 11.6 Card administrativo compacto

Uso apenas para:

- resumo de estado;
- preview;
- configuração;
- ação isolada.

## 12. Ações nos cards

### Card com um destino

Título e área principal podem formar uma área clicável ampla.

### Card com múltiplas ações

Usar controles explícitos.

Não tornar o card inteiro clicável quando houver:

- menu;
- checkbox;
- botão secundário;
- download;
- ações administrativas.

Textos preferidos:

```text
Ver produto
Ver projeto
Ler comunicado
Abrir atendimento
```

Evitar:

```text
Saiba mais
Detalhes
Clique aqui
```

## 13. O que não será tratado como card

| Conteúdo | Componente |
|---|---|
| Perguntas frequentes | Acordeão |
| Atendimentos | Tabela ou lista |
| Filtros | Painel de filtros |
| Formulário | Grupo de campos |
| Linha do tempo | Timeline |
| Métricas | Tiles de dados |
| CTA isolado | Botão ou faixa |
| Texto institucional | Seção editorial |
| Dados tabulares | Tabela |
| Mapa | Painel de mapa |
| Mensagem de estado | Alert |

## 14. Configuração no Figma

### 14.1 Frames-base

```text
Desktop / 1440
Laptop / 1024
Tablet / 768
Mobile / 390
Mobile mínimo / 320
```

### 14.2 Layout grids

#### Desktop / 1440

```text
Type: Columns
Count: 12
Margin: 80
Gutter: 24
Alignment: Stretch
```

#### Laptop / 1024

```text
Type: Columns
Count: 8
Margin: 32
Gutter: 24
Alignment: Stretch
```

#### Tablet / 768

```text
Type: Columns
Count: 8
Margin: 24
Gutter: 16
Alignment: Stretch
```

#### Mobile / 390

```text
Type: Columns
Count: 4
Margin: 16
Gutter: 16
Alignment: Stretch
```

### 14.3 Variáveis de espaçamento

```text
spacing/4
spacing/8
spacing/12
spacing/16
spacing/24
spacing/32
spacing/48
spacing/64
spacing/80
spacing/96
```

### 14.4 Componentes iniciais

```text
Card/Portfolio
Card/Product
Card/Communication
Card/Contact
Tile/Metric
Card/Admin compact
```

Propriedades previstas:

```text
media: on/off
status: on/off
metadata: on/off
action: on/off
orientation: vertical/horizontal
state: default/hover/active/focus/selected
```

## 15. Validação no style tile

Testar:

1. hero público `7 + 5`;
2. introdução interna;
3. seção pública neutra;
4. seção inversa;
5. card de Portfólio;
6. card de produto;
7. card de Comunicação;
8. canal de contato;
9. tile de métrica;
10. formulário `7 + 5`;
11. FAQ `4 + 8`;
12. catálogo com filtros e resultados;
13. tabela administrativa;
14. estado vazio;
15. hover e focus;
16. desktop, laptop e mobile.

Critérios:

- a Home não parece uma sequência de caixas iguais;
- títulos e espaço orientam a leitura antes da cor;
- o verde não domina todos os componentes;
- cards diferentes permanecem parte do mesmo sistema;
- o catálogo não parece e-commerce;
- o painel não parece grade promocional;
- formulários e tabelas têm espaço adequado;
- não há rolagem horizontal da página em `320 CSS px`;
- cards suportam conteúdo real longo;
- foco é perceptível;
- portal público e painel compartilham a mesma base.

## 16. Pendências

- [ ] Confirmar as proporções dos frames no Figma.
- [ ] Criar os grids de `390`, `768`, `1024` e `1440 px`.
- [ ] Criar as variáveis de espaçamento.
- [ ] Testar a Home com hierarquia assimétrica.
- [ ] Testar o catálogo em `3 / 2 / 1` cards.
- [ ] Testar filtros laterais e filtros em drawer.
- [ ] Testar formulários em `7 + 5`.
- [ ] Testar FAQ em `4 + 8`.
- [ ] Criar as variantes iniciais de card.
- [ ] Testar cards com conteúdo real longo.
- [ ] Testar foco, hover, active e selected.
- [ ] Testar o painel com tabela e tiles.
- [ ] Validar reflow em `320 CSS px`.
- [ ] Montar o style tile.
- [ ] Registrar ajustes identificados no Figma.
- [ ] Validar a direção visual com a Bamak.

## 17. Critério para consolidação

A direção poderá ser marcada como consolidada quando:

- os grids funcionarem nos quatro frames-base;
- a mesma estrutura atender ao portal e ao painel;
- os cards forem usados somente onde houver uma coleção modular;
- tabelas, acordeões, formulários e timelines permanecerem componentes próprios;
- a Home apresentar hierarquia clara;
- o catálogo funcionar em desktop e mobile;
- os componentes suportarem conteúdo real;
- os estados interativos forem acessíveis;
- os ajustes finais estiverem registrados neste documento.

## 18. Referências de trabalho

- [USWDS — Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)
- [USWDS — Card](https://designsystem.digital.gov/components/card/)
- [Carbon Design System — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)
- [Carbon Design System — Spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Material Design 3 — Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [Material Design 3 — Cards](https://m3.material.io/components/cards/overview)
- [Tailwind CSS — Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 2.2 — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 — Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
