# Paleta operacional

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak |
| Fase | Pré-PAC VIII |
| Escopo | Portal público e painel administrativo |
| Status | Em definição |
| Última atualização | 11/07/2026 |

## 1. Objetivo

Registrar a estrutura, os critérios e as pendências da paleta do Portal Bamak antes da criação do style tile e das variáveis no Figma.

Este documento não é um manual de identidade visual da empresa. Ele orienta o uso de cor na interface do portal, preservando a marca e evitando decisões cromáticas isoladas durante a prototipação e a implementação.

## 2. Ponto de partida

A Bamak não forneceu um manual formal com paleta digital, escalas tonais ou regras de interface. Os materiais disponíveis confirmam duas referências da marca:

| Referência | Valor | Uso de origem |
|---|---:|---|
| Verde Bamak | `#00421F` | versão principal da marca |
| Branco | `#FFFFFF` | versão negativa da marca |

O verde `#00421F` é a origem da família institucional, mas não será aplicado diretamente em todos os componentes. Os demais valores serão derivados e testados conforme sua função na interface.

## 3. Decisões estruturais

### 3.1 Organização em três níveis

A paleta será organizada em:

1. **Referências:** valores de origem da marca.
2. **Primitivos:** escalas cromáticas sem função de interface.
3. **Semânticos:** tokens nomeados pelo papel que exercem no produto.

Os componentes e protótipos devem consumir tokens semânticos. Valores HEX e tokens primitivos não devem ser aplicados diretamente de forma recorrente nos componentes.

Exemplo:

```text
reference/brand-green
        ↓
primitive/brand/[tom]
        ↓
semantic/action/primary/default
        ↓
botão de envio ou salvamento
```

### 3.2 Famílias primitivas previstas

```text
primitive/
├── brand/
│   └── 50–950
├── neutral/
│   └── 0–950
├── info/
├── success/
├── warning/
└── danger/
```

Diretrizes:

- `brand` será derivada do verde `#00421F`;
- `neutral` atenderá fundos, textos, bordas, campos e estados desabilitados;
- `info`, `success`, `warning` e `danger` terão valores próprios;
- o verde institucional não será usado automaticamente como cor de sucesso;
- as escalas de feedback serão menores que as escalas `brand` e `neutral`, contendo apenas os tons necessários para fundo, borda, conteúdo e preenchimento sólido.

A posição do verde `#00421F` dentro da escala `brand` ainda será definida. O índice deve refletir sua luminosidade e função, não apenas sua importância para a marca.

### 3.3 Grupos semânticos previstos

```text
semantic/
├── surface/
├── content/
├── border/
├── field/
├── action/
├── focus/
└── feedback/
```

#### Superfícies

```text
semantic/surface/page
semantic/surface/section
semantic/surface/subtle
semantic/surface/card
semantic/surface/raised
semantic/surface/selected
semantic/surface/inverse
semantic/surface/overlay
```

#### Conteúdo

```text
semantic/content/primary
semantic/content/secondary
semantic/content/muted
semantic/content/disabled
semantic/content/inverse
semantic/content/brand
semantic/content/link
semantic/content/link-hover
```

#### Bordas e campos

```text
semantic/border/subtle
semantic/border/default
semantic/border/strong
semantic/border/interactive
semantic/border/selected
semantic/border/disabled
semantic/border/danger

semantic/field/background
semantic/field/border
semantic/field/border-hover
semantic/field/border-focus
semantic/field/placeholder
```

#### Ações

```text
semantic/action/primary/{default,hover,active,disabled,foreground}
semantic/action/secondary/{default,hover,active,disabled,foreground}
semantic/action/ghost/{hover,active,foreground}
semantic/action/destructive/{default,hover,active,foreground}
```

#### Foco

```text
semantic/focus/ring
semantic/focus/offset
```

#### Feedback

Cada estado terá os mesmos papéis:

```text
semantic/feedback/[estado]/surface
semantic/feedback/[estado]/border
semantic/feedback/[estado]/icon
semantic/feedback/[estado]/text
semantic/feedback/[estado]/solid
semantic/feedback/[estado]/on-solid
```

Estados previstos:

```text
info
success
warning
danger
```

Os tokens poderão ser reduzidos durante a definição caso algum papel não tenha uso real no produto.

## 4. Aplicação no Portal Bamak

### 4.1 Sistema único

O portal público e o painel administrativo usarão a mesma base cromática. Não serão criadas paletas independentes para cada ambiente.

A diferença ocorrerá pela proporção de uso:

- **área pública:** maior presença institucional, superfícies inversas, fotografias e chamadas principais;
- **área administrativa:** predominância de superfícies neutras, campos, tabelas, bordas, estados e feedbacks operacionais.

### 4.2 Tema

A primeira versão terá:

- tema claro;
- superfícies inversas para áreas escuras ou institucionais.

Um modo escuro completo não faz parte desta etapa. A estrutura semântica deve permitir sua inclusão futura sem alterar os componentes.

### 4.3 Usos específicos do produto

A paleta deve cobrir, no mínimo:

- navegação pública e administrativa;
- cabeçalhos, rodapés e áreas institucionais;
- busca e filtros do Catálogo;
- formulário de Contato;
- formulário e consentimento do Cabo Aéreo;
- campos de mapa e upload de imagens;
- estados de envio, validação e falha;
- fila e estados de Atendimentos;
- criação, rascunho e publicação em Comunicação;
- geração e envio do PDF interno;
- ações destrutivas e confirmações no painel;
- foco de teclado em superfícies claras, neutras, verdes e fotográficas.

### 4.4 Restrições

Não serão criados nesta etapa:

- cores específicas para cada página;
- segunda cor institucional sem origem ou função;
- gradientes de marca;
- cores decorativas sem uso definido;
- paleta separada para o painel;
- escala própria para gráficos antes da definição dos gráficos;
- tokens exclusivos de componentes sem necessidade comprovada.

## 5. Contraste e acessibilidade

A validação seguirá a WCAG 2.2, considerando:

| Aplicação | Contraste mínimo |
|---|---:|
| Texto comum | `4,5:1` |
| Texto grande | `3:1` |
| Elementos gráficos e limites funcionais | `3:1` |

Também serão observadas estas regras:

- foco de teclado perceptível em todas as superfícies previstas;
- erro, sucesso, atenção e informação não dependem apenas da cor;
- placeholders não substituem rótulos;
- estados `hover`, `active`, `selected`, `disabled` e `focus` precisam ser distinguíveis;
- pares cromáticos só serão consolidados após teste de contraste;
- opacidade isolada não será usada como solução padrão para estados interativos.

A matriz de contraste será preenchida quando os valores forem definidos:

| Uso | Fundo | Conteúdo | Contraste | Resultado |
|---|---|---|---:|---|
| Texto principal | Pendente | Pendente | Pendente | Pendente |
| Texto secundário | Pendente | Pendente | Pendente | Pendente |
| Ação principal | Pendente | Pendente | Pendente | Pendente |
| Ação secundária | Pendente | Pendente | Pendente | Pendente |
| Borda de campo | Pendente | Pendente | Pendente | Pendente |
| Indicador de foco | Pendente | Pendente | Pendente | Pendente |
| Feedback de erro | Pendente | Pendente | Pendente | Pendente |
| Superfície inversa | Pendente | Pendente | Pendente | Pendente |

## 6. Mapeamento previsto

As variáveis do Figma devem preservar os mesmos nomes dos tokens do projeto:

```text
primitive/brand/...
primitive/neutral/...
semantic/surface/...
semantic/content/...
semantic/action/...
```

Na implementação, os tokens semânticos serão mapeados para os aliases usados pela base de componentes, por exemplo:

| Token do projeto | Alias de implementação previsto |
|---|---|
| `semantic/surface/page` | `background` |
| `semantic/content/primary` | `foreground` |
| `semantic/surface/card` | `card` |
| `semantic/action/primary/default` | `primary` |
| `semantic/action/primary/foreground` | `primary-foreground` |
| `semantic/content/muted` | `muted-foreground` |
| `semantic/border/default` | `border` |
| `semantic/field/border` | `input` |
| `semantic/focus/ring` | `ring` |
| `semantic/action/destructive/default` | `destructive` |

Este mapeamento é preliminar. Os nomes finais dependerão da stack consolidada e dos componentes realmente adotados.

## 7. Pendências antes do style tile

- [ ] Derivar e revisar a escala `brand`.
- [ ] Definir a posição de `#00421F` na escala institucional.
- [ ] Definir a temperatura e os valores da escala `neutral`.
- [ ] Definir as famílias `info`, `success`, `warning` e `danger`.
- [ ] Mapear os primitivos para os tokens semânticos.
- [ ] Definir estados `hover`, `active`, `selected` e `disabled`.
- [ ] Definir o indicador de foco para superfícies claras, escuras e fotográficas.
- [ ] Validar os pares de contraste.
- [ ] Testar a paleta em exemplos do portal público.
- [ ] Testar a paleta em campos, tabelas e feedbacks do painel.
- [ ] Criar as variáveis no Figma.
- [ ] Montar o style tile.
- [ ] Registrar os ajustes decorrentes da aplicação visual.
- [ ] Validar a direção visual com a Bamak.

## 8. Critério para avançar ao style tile

A paleta poderá ser materializada no style tile quando:

- as escalas primitivas tiverem valores definidos;
- os tokens semânticos essenciais estiverem mapeados;
- os pares principais atenderem aos critérios de contraste;
- ações, campos, foco e feedbacks tiverem estados previstos;
- a mesma base atender ao portal público e ao painel;
- as pendências que alteram a direção cromática estiverem resolvidas.

O style tile servirá para verificar a aplicação visual dessas decisões. Ajustes identificados no Figma devem retornar a este documento antes da consolidação da paleta.

## 9. Referências de trabalho

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Understanding Success Criterion 1.4.11: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [Understanding Success Criterion 2.4.13: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Material Design 3 — Design tokens](https://m3.material.io/foundations/design-tokens/overview)
- [USWDS — Color tokens](https://designsystem.digital.gov/design-tokens/color/overview/)
- [Carbon Design System — Color](https://carbondesignsystem.com/elements/color/overview/)
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming)
