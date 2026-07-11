# Tipografia operacional

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak |
| Fase | Pré-PAC VIII |
| Escopo | Portal público e painel administrativo |
| Status | Em definição |
| Última atualização | 11/07/2026 |

## 1. Objetivo

Registrar a direção tipográfica preliminar do Portal Bamak antes da criação do style tile e das variáveis no Figma.

O sistema precisa atender dois contextos com a mesma base:

- comunicação institucional no portal público;
- leitura e operação no painel administrativo.

A tipografia deve reforçar o caráter técnico e industrial da Bamak sem comprometer legibilidade, densidade de informação ou consistência entre os dois ambientes.

## 2. Decisão preliminar

| Função | Família |
|---|---|
| Displays e headings institucionais | `Archivo Variable` |
| Textos, componentes e interface | `Source Sans 3 Variable` |
| Marca BAMAK | Assets vetoriais existentes |
| Terceira família | Não utilizar |

A combinação será validada no style tile antes de ser considerada consolidada.

### 2.1 Archivo Variable

Uso previsto:

- título principal da Home;
- títulos de páginas públicas;
- títulos de seções;
- títulos principais de páginas administrativas;
- chamadas institucionais de maior destaque.

Pesos previstos:

```text
600 — títulos regulares
700 — títulos principais e displays
```

Restrições:

- não usar em parágrafos;
- não usar em campos, tabelas, botões ou menus;
- não usar abaixo de `20 px`;
- não usar variações de largura nesta etapa;
- não carregar itálico inicialmente.

### 2.2 Source Sans 3 Variable

Uso previsto:

- textos corridos;
- navegação;
- botões;
- labels;
- inputs e selects;
- tabelas;
- badges;
- cards;
- mensagens;
- metadados;
- datas e números;
- conteúdo editorial.

Pesos previstos:

```text
400 — texto regular
500 — ênfase intermediária e dados
600 — labels, botões, navegação e títulos de componentes
700 — ênfase forte excepcional
```

Pesos `300`, `800` e `900` não fazem parte do sistema inicial.

## 3. Alternativas consideradas

| Família | Avaliação |
|---|---|
| `Inter` | tecnicamente adequada para telas, mas genérica demais para a área institucional |
| `Archivo` | mais firme e coerente com o caráter industrial; adequada para títulos |
| `Source Sans 3` | adequada para interface, formulários, tabelas e leitura prolongada |
| Fonte serifada | não resolve necessidade funcional e acrescentaria uma terceira linguagem visual |

A combinação selecionada distribui funções sem depender de uma única fonte para todos os contextos.

## 4. Escala tipográfica preliminar

Os valores são apresentados como `tamanho / altura de linha`.

| Estilo | Família | Peso | Desktop | Mobile | Tracking |
|---|---|---:|---:|---:|---:|
| `display/lg` | Archivo | 700 | `56 / 64 px` | `40 / 48 px` | `-0,02em` |
| `heading/xl` | Archivo | 700 | `40 / 48 px` | `32 / 40 px` | `-0,015em` |
| `heading/lg` | Archivo | 600 | `32 / 40 px` | `28 / 36 px` | `-0,01em` |
| `heading/md` | Archivo | 600 | `24 / 32 px` | igual | `0` |
| `heading/sm` | Archivo | 600 | `20 / 28 px` | igual | `0` |
| `title/lg` | Source Sans 3 | 600 | `18 / 24 px` | igual | `0` |
| `title/md` | Source Sans 3 | 600 | `16 / 24 px` | igual | `0` |
| `body/lg` | Source Sans 3 | 400 | `18 / 30 px` | igual | `0` |
| `body/md` | Source Sans 3 | 400 | `16 / 26 px` | igual | `0` |
| `body/sm` | Source Sans 3 | 400 | `14 / 20 px` | igual | `0` |
| `label/lg` | Source Sans 3 | 600 | `16 / 20 px` | igual | `0` |
| `label/md` | Source Sans 3 | 600 | `14 / 20 px` | igual | `0` |

Decisões da escala:

- texto-base em `16 px`;
- menor tamanho regular em `14 px`;
- redução responsiva apenas nos maiores títulos;
- estilos nomeados por função, não por elemento HTML;
- nenhum estilo de `12 px` nesta etapa.

## 5. Aplicação no produto

### 5.1 Portal público

| Elemento | Estilo |
|---|---|
| Título principal da Home | `display/lg` |
| Título de página | `heading/xl` |
| Título de seção principal | `heading/lg` |
| Subseção | `heading/md` |
| Título de card institucional | `title/lg` |
| Texto introdutório destacado | `body/lg` |
| Texto corrente | `body/md` |
| Metadado de notícia ou evento | `body/sm` |
| Navegação principal | `label/lg` |
| Botão principal | `label/lg` |
| Botão compacto | `label/md` |

`display/lg` deve permanecer restrito à Home ou a uma chamada institucional equivalente.

### 5.2 Catálogo

| Elemento | Estilo |
|---|---|
| Título do catálogo | `heading/xl` |
| Nome do produto | `title/lg` |
| Categoria | `label/md` |
| Descrição resumida | `body/md` |
| Código ou SKU | `body/sm` com números tabulares |
| Label de filtro | `label/md` |
| Valor do campo | `body/md` |
| Contagem de resultados | `body/sm` |

### 5.3 Cabo Aéreo e Contato

| Elemento | Estilo |
|---|---|
| Título do fluxo | `heading/xl` |
| Título de etapa | `heading/md` |
| Orientação da etapa | `body/md` |
| Label de campo | `label/md` |
| Conteúdo digitado | `body/md` |
| Ajuda e validação | `body/sm` |
| Consentimento LGPD | `body/sm` |
| Ação principal | `label/lg` |

### 5.4 Painel administrativo

| Elemento | Estilo |
|---|---|
| Título da página | `heading/lg` ou `heading/md` |
| Título de painel ou diálogo | `title/lg` |
| Título de card | `title/md` |
| Navegação lateral | `label/md` |
| Cabeçalho de tabela | `label/md` |
| Célula de tabela | `body/sm` |
| Campo de formulário | `body/md` |
| Label de formulário | `label/md` |
| Descrição auxiliar | `body/sm` |
| Badge de status | `label/md` |
| Métrica principal | `heading/md` com números tabulares |

A área administrativa não deve usar `display/lg` nem títulos de `40–56 px`.

## 6. Composição e leitura

### 6.1 Comprimento de linha

```text
Texto editorial: até 66ch
Texto introdutório: até 55ch
Texto de hero: até 45ch
```

Cards, tabelas e campos seguem a largura do componente.

### 6.2 Parágrafos

```text
body/md: 16 px / 26 px
body/lg: 18 px / 30 px
espaço entre parágrafos: 1em
alinhamento: à esquerda
```

Texto justificado não será usado.

### 6.3 Títulos

- evitar colunas excessivamente largas;
- preservar unidades de sentido nas quebras;
- evitar palavra isolada na última linha;
- não inserir quebras manuais para corrigir apenas um viewport.

### 6.4 Caixa e ênfase

O padrão será `sentence case`.

Exemplos corretos:

```text
Solicitar análise de Cabo Aéreo
Informações da empresa
Salvar alterações
```

Evitar caixa alta em:

- navegação;
- botões;
- labels;
- headings;
- cabeçalhos de tabela.

Pesos:

- `600` para hierarquia operacional;
- `700` para displays e títulos principais;
- não usar negrito em parágrafos inteiros.

Itálico não fará parte do núcleo inicial da interface.

## 7. Links, números e dados

### 7.1 Links

Links dentro de texto corrido devem possuir sublinhado visível.

Direção inicial:

```text
padrão: sublinhado
hover: reforço cromático ou de espessura
focus: indicador global de foco
visited: pendente de definição na paleta
```

Links de navegação, botões e cards clicáveis seguem o tratamento do componente.

### 7.2 Números tabulares

Aplicar números tabulares em:

- colunas numéricas;
- datas e horários;
- indicadores;
- quantidades;
- códigos de atendimento;
- códigos de produtos;
- paginação;
- valores que mudam dinamicamente.

Implementação prevista:

```css
font-variant-numeric: tabular-nums;
```

Não será adicionada fonte monoespaçada apenas para esses casos.

## 8. Semântica e acessibilidade

### 8.1 Headings

Estilo visual e nível HTML são decisões independentes.

Exemplo público:

```text
h1 → heading/xl
h2 → heading/lg
h3 → heading/md
```

Exemplo administrativo:

```text
h1 → heading/lg
h2 → title/lg
h3 → title/md
```

A hierarquia HTML deve representar a estrutura real do conteúdo.

### 8.2 Redimensionamento e reflow

A implementação deverá:

- usar `rem` para tamanhos;
- manter o tamanho raiz em `100%`;
- permitir ampliação de texto em até `200%`;
- evitar alturas fixas em componentes com texto;
- permitir crescimento vertical de botões, campos, cards e mensagens;
- manter o conteúdo utilizável em largura equivalente a `320 CSS px`;
- restringir rolagem horizontal a componentes realmente bidimensionais, como tabelas.

### 8.3 Espaçamento personalizado

A interface deve continuar funcional quando o usuário aplicar:

```text
altura de linha: 1,5 × o tamanho da fonte
espaço após parágrafo: 2 × o tamanho da fonte
tracking: 0,12em
espaço entre palavras: 0,16em
```

### 8.4 Texto real

Todo conteúdo da interface deve permanecer como texto HTML.

A única exceção é o wordmark da marca dentro dos assets vetoriais.

## 9. Estrutura no Figma

```text
Typography
├── Families
│   ├── Display: Archivo
│   └── Sans: Source Sans 3
└── Styles
    ├── Display
    │   └── L
    ├── Heading
    │   ├── XL
    │   ├── L
    │   ├── M
    │   └── S
    ├── Title
    │   ├── L
    │   └── M
    ├── Body
    │   ├── L
    │   ├── M
    │   └── S
    └── Label
        ├── L
        └── M
```

Nomes dos estilos:

```text
Typography/Display/L
Typography/Heading/XL
Typography/Heading/L
Typography/Heading/M
Typography/Heading/S
Typography/Title/L
Typography/Title/M
Typography/Body/L
Typography/Body/M
Typography/Body/S
Typography/Label/L
Typography/Label/M
```

Não criar estilos vinculados a páginas ou elementos específicos, como `H1`, `Título da Home` ou `Texto do card`.

## 10. Implementação prevista

Variáveis:

```text
--font-display: Archivo
--font-sans: Source Sans 3
```

Carregamento previsto:

```text
Archivo Variable
Source Sans 3 Variable
Subconjunto Latin
Estilo Roman
```

Não carregar inicialmente:

- Archivo Italic;
- Source Sans 3 Italic;
- eixos de largura alternativos;
- pesos fora da faixa utilizada;
- terceira família.

A implementação deve usar fontes hospedadas e otimizadas pela própria aplicação.

## 11. Validação no style tile

A combinação deve ser testada em:

- Home com logo, hero, fotografia e CTA;
- página institucional com texto longo;
- card e filtros do Catálogo;
- formulário do Cabo Aéreo;
- notícia ou comunicado;
- tabela de Atendimentos;
- formulário administrativo;
- mensagens de sucesso, atenção e erro;
- superfícies claras e inversas;
- desktop e mobile.

Critérios de aceitação:

- Archivo não compete com o wordmark;
- os títulos transmitem firmeza sem parecerem excessivamente promocionais;
- Source Sans 3 permanece legível em campos, tabelas e textos longos;
- portal público e painel permanecem visualmente relacionados;
- a hierarquia não depende apenas de cor;
- os estilos resistem a zoom e espaçamento ampliados;
- o custo de carregamento das duas famílias permanece aceitável.

Plano de simplificação:

> Caso Archivo se mostre incompatível com a marca ou dominante demais, Source Sans 3 será usada em todo o sistema, mantendo a mesma escala e os mesmos papéis. Não será introduzida uma terceira candidata durante o style tile.

## 12. Pendências

- [ ] Instalar e conferir Archivo Variable no ambiente de design.
- [ ] Instalar e conferir Source Sans 3 Variable no ambiente de design.
- [ ] Criar os estilos tipográficos no Figma.
- [ ] Testar Archivo junto ao lockup horizontal e ao wordmark.
- [ ] Testar a escala em desktop e mobile.
- [ ] Testar textos longos com largura máxima de `66ch`.
- [ ] Testar campos, tabelas, badges e mensagens administrativas.
- [ ] Verificar números tabulares.
- [ ] Verificar zoom de `200%`.
- [ ] Verificar reflow em `320 CSS px`.
- [ ] Verificar espaçamento personalizado.
- [ ] Medir o custo de carregamento das fontes.
- [ ] Montar o style tile.
- [ ] Registrar ajustes decorrentes da aplicação visual.
- [ ] Validar a direção visual com a Bamak.

## 13. Critério para consolidação

A direção tipográfica poderá ser marcada como consolidada quando:

- as duas famílias estiverem aplicadas no style tile;
- a escala funcionar no portal público e no painel;
- os tamanhos mínimos permanecerem legíveis;
- os testes de zoom, reflow e espaçamento não revelarem perdas;
- Archivo permanecer compatível com a marca;
- a implementação prevista não exigir arquivos ou pesos desnecessários;
- os ajustes finais forem registrados neste documento.

## 14. Referências de trabalho

- [Archivo](https://fonts.google.com/specimen/Archivo)
- [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3)
- [Material Design 3 — Typography](https://m3.material.io/styles/typography/overview)
- [USWDS — Typography](https://designsystem.digital.gov/components/typography/)
- [WAI — Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [WCAG 2.2 — Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 2.2 — Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [WCAG 2.2 — Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html)
- [MDN — font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
