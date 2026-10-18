# Handoff visual — Portal Bamak (consolidação do Figma)

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak — PAC VIII |
| Status | Design e protótipos documentados; implementação, testes funcionais e validação da Bamak pendentes |
| Data da revisão | 17/10/2026 |
| Escopo | Fundamentos, componentes, áreas pública e administrativa, fluxos e especificações de implementação |
| Fonte de design | [Figma — Bamak](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/Bamak-%7C-Arquitetura-da-Informa%C3%A7%C3%A3o-e-Prot%C3%B3tipos) |
| Origem | Evolução do style tile v3, consolidada em sete páginas definitivas no Figma |

## 1. Organização definitiva no Figma

| Página | Conteúdo atual | Referência |
|---|---|---|
| 00 — Fundamentos de design | Marca, cor, tipografia, grids, imagem e iconografia. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=120-2) |
| 01 — Biblioteca de componentes | Variantes, componentes independentes e exemplos instanciados. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=299-225) |
| 02 — Portal público | PUB-01 a PUB-14 e estados pertinentes em quatro larguras. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=324-58) |
| 03 — Experiência guiada | Mapa de Cabo Aéreo e alternativa progressiva em avaliação. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=324-59) |
| 04 — Painel administrativo | ADM-01 a ADM-12, acessos e estados operacionais. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=324-60) |
| 05 — Protótipos navegáveis | Três fluxos FL, cenários de revisão e apresentação mobile. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=324-61) |
| 06 — Especificações e handoff | Critérios por tela, rastreabilidade, dependências e decisões. | [Abrir](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=324-62) |

A estrutura reúne **14 áreas públicas e 12 administrativas**, representadas em **157 telas e estados-base** (74 públicos e 83 administrativos). O trabalho inclui **35 cenários de revisão**, **36 apresentações mobile** e **10 telas exploratórias** da proposta progressiva de Cabo Aéreo. Essas categorias têm finalidades diferentes.

Os antigos endereços das páginas 07 e 99 e de nós removidos representam uma organização superada. Os wireframes do PAC VII continuam preservados como referência histórica daquela fase. A finalização do desenho **não representa aprovação da Bamak**. Nomes, imagens e dados de demonstração precisam de validação institucional ou substituição antes da publicação.

## 2. Direção visual mantida

**Precisão industrial em contexto de campo.** Uso contido do verde institucional, predominância de superfícies neutras, Archivo para títulos e Source Sans 3 para textos e interface, iconografia outline oficial da Lucide, fotografias documentais autorizadas e mínima decoração.

Não adicionar efeitos futuristas, gradientes sem função, imagens artificiais para simular a operação da Bamak nem dashboard de métricas sem indicador realmente calculável.

## 3. Cores e tokens

| Papel | Valor | Uso |
|---|---|---|
| Identidade | `#00421F` | Marca, ação principal, seleção e superfícies inversas |
| Texto principal | `#181C19` | Conteúdo dominante |
| Texto secundário | `#575C58` | Informações auxiliares |
| Superfície principal | `#FFFFFF` | Fundo padrão |
| Superfície discreta | `#F8FBF9` | Separação leve |
| Borda de campo funcional | `#767C78` | Contorno necessário à identificação de controle |
| Informação | `#35576A` | Estado informativo |
| Sucesso | `#145930` | Operação concluída |
| Atenção | `#865528` | Condição que exige ação |
| Erro | `#963C38` | Falha ou validação |

Feedback: manter superfície e borda predominantemente neutras. O significado deve ser transmitido por texto, ícone e acento semântico, não somente por cor.

### 3.1 Nomes canônicos existentes no Figma

A nomenclatura **efetivamente implementada no Figma** é:

- `primitive/brand/*`, `primitive/neutral/*`
- `primitive/feedback/{info,success,warning,danger}/{surface,border,accent,content}`
- `semantic/feedback/{info,success,warning,danger}/{background,border,icon,content}`
- `semantic/surface/*`, `semantic/content/*`, `semantic/action/*`, `semantic/field/*`, `semantic/border/*`
- `semantic/focus/ring`, `semantic/focus/offset`, `semantic/focus/ring-inverse`, `semantic/focus/offset-inverse`
- `spacing/{4,8,12,16,24,32,48,64,80,96}`; `radius/{none,sm,md,lg,full}`

Os quatro pares de primitivas `surface` e `border` do feedback são **aliases**, respectivamente, de `primitive/neutral/50` e `primitive/neutral/300`. Não voltar a duplicar hexadecimais desses papéis.

**Mapeamento de termos históricos:** na documentação preliminar, `feedback/*/surface` equivale a `semantic/feedback/*/background`, e `feedback/*/text` equivale a `semantic/feedback/*/content`. O desenvolvimento deve usar os nomes concretos canônicos acima, sem criar uma segunda paleta.

### 3.2 Contraste e foco

Principais pares calculados no Figma: texto principal/branco `17,23:1`; secundário/branco `6,82:1`; branco/verde institucional `11,67:1`; borda funcional/branco `4,26:1`.

Feedback sobre `#F8FBF9`: informação `7,40:1`; sucesso `8,06:1`; atenção `6,03:1`; erro `6,72:1`.

O foco padrão `#4D9163` tem contraste calculado de `3,79:1` no branco, `3,63:1` em superfície discreta e `3,08:1` no fundo verde escuro. Para uso inverso, foi criado `semantic/focus/ring-inverse = #FFFFFF` com `offset-inverse = #00421F`. A implementação deve testar foco real nos contextos de bordas adjacentes; não basta confiar apenas no par isolado.

As proporções são referências de cor, **não prova de conformidade integral** com WCAG 2.2.

## 4. Tipografia e grids

- **Archivo Variable:** títulos institucionais, níveis de 20 a 56 px, pesos 600/700.
- **Source Sans 3 Variable:** textos, ações, campos, tabelas, metadados e rótulos, 14–18 px, pesos 400/600.
- Estilos locais no Figma incluem 15 estilos desktop/mobile, com nomes funcionais.
- Corpo padrão `16/26 px`; corpo pequeno `14/20 px`; hierarquia HTML não é definida exclusivamente pelo estilo visual.
- Grids preservados: 1440/12 colunas/margem 80/gutter 24; 1024/8/32/24; 768/8/24/16; 390/4/16/16.
- A aplicação precisa testar reflow a 320 CSS px, textos ampliados e espaçamento personalizado. As pranchas não substituem testes de navegador.

## 5. Biblioteca de componentes vigente

A página 01 contém nove conjuntos com **59 variantes**:

| Conjunto | Variantes |
|---|---:|
| Button | 32 — Primary, Secondary e Ghost × Small/Medium × Default/Hover/Pressed/Focused/Disabled; dois Loading em Medium |
| Field | 4 — Default, Focused, Error, ReadOnly |
| Select | 3 — Default, Focused, Error |
| Checkbox | 4 — Unchecked, Checked, Error, Focused |
| Badge | 4 — Neutral, New, InReview, Done |
| Notification | 4 — Info, Success, Warning, Danger |
| NavItem | 2 — Default, Active |
| TableRow | 3 — New, InReview, Done |
| ContentCard | 3 — Application, Product, Publication |
| **Total** | **59 variantes** |

Cinco componentes independentes completam os **64 componentes da biblioteca**: `Icon/CaboAereo`, `FlowStep`, `FlowBranch`, `ScenarioRail` e `PrototypeAction`. Os quatro componentes de fluxo destinam-se à representação e prototipação. Três mestres de marca pertencem à página 00 e são contabilizados separadamente.

Variantes, instâncias, Auto Layout e tokens oferecem referências visuais; a implementação deve verificar semântica DOM, autorização, estados reais, responsividade e acessibilidade. Badges operacionais, como `Em análise`, expressam estados de processo sem implicar alerta automático.

### 5.1 Iconografia

Padrão: **Lucide oficial**, SVG outline de 24 px, stroke de 2 px e dimensões de 16/20/24/32 px conforme função. Configurações usa `settings-2`. `Icon/CaboAereo` é o pictograma específico do portal, utilizado por instância e sujeito à confirmação de fidelidade técnica com a Bamak. Ícones sem texto exigem nome acessível e alvo interativo adequado.

### 5.2 Princípios de utilização

- Uma ação dominante por região; botões secundários não concorrem com o principal.
- Checkbox de LGPD com rótulo persistente; validação no próprio campo e resumo de erros quando o formulário justificar.
- Foco perceptível por teclado; estado disabled apenas com justificativa funcional.
- Tabelas para dados comparáveis; lista estruturada na largura compacta quando a tabela não for adequada.
- Produto, Aplicação e Comunicação têm modelos distintos. Fotografias: Produto 4:3; Aplicações e Comunicação 16:9; hero 4:3.
- Estados de carregamento são visuais na prancha, mas devem ter sinalização apropriada durante a execução.

## 6. Responsividade, fluxos e decisão de Cabo Aéreo

Cada área PUB-01 a PUB-14 e ADM-01 a ADM-12 tem referência principal nos viewports **1440, 1024, 768 e 390 px**. Os estados alternativos podem ser apresentados na largura em que a diferença de comportamento é relevante. A aplicação deve ser validada em **320 CSS px**, zoom, textos ampliados, teclado e tecnologias assistivas.

Na página 05, os três fluxos navegáveis cobrem **FL-01 (contato geral), FL-02 (Cabo Aéreo, do visitante ao atendimento interno) e FL-03 (Comunicação)**. Os cenários e apresentações mobile exemplificam recuperação de erros e continuidade. As transições do Figma são simulações e não realizam autenticação, persistência, upload, geração de PDF ou envio de e-mail.

Na página 03 existe uma **alternativa progressiva de solicitação de Cabo Aéreo**, com dez telas exploratórias em 390 × 844 px. Segundo o [registro de decisão](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/?node-id=948-3), **PUB-07 permanece como referência vigente para implementação**. A substituição depende de decisão explícita e aprovação da Bamak. A confirmação pública PUB-08 ocorre após persistência; ficha, imagens e PDF interno continuam protegidos.

No painel, a listagem de atendimentos permanece distinta dos detalhes de registro. ADM-04/ADM-05 compartilham uma rota dinâmica proposta e ADM-06/ADM-07 são vistas ou estados internos. A adaptação mobile conserva as mesmas regras de acesso.

Para rastreabilidade, consultar a [RFC v2](../02-escopo/rfc-v2-pac-viii.md), o [cadastro detalhado de requisitos](../03-requisitos/requisitos-user-stories-fluxos-metricas.md) e o [inventário de telas](../04-arquitetura/inventario-telas.md).

## 7. Pendências e critérios de validação

### Dependências da Bamak

- Fotografias reais e autorizações de uso.
- Revisão de conteúdo institucional, produtos, aplicações e canais oficiais.
- Avaliação e aprovação das direções visuais e fluxos.

### Validação técnica na implementação

- Testar navegação por teclado, foco, identificação de controles, anúncios de status e mensagens de erro.
- Verificar contraste final em todos os pares realmente usados e nas imagens definitivas.
- Testar reflow a 320 CSS px, zoom de texto a 200%, espaçamento WCAG e alvos de toque.
- Validar filtros, formulários, consentimento LGPD, uploads, geração e envio de PDF e retornos de falha.
- Preservar dimensões e tokens compartilhados ao traduzir o Figma para CSS/React.
- Testar componentes no navegador; não declarar conformidade WCAG usando somente screenshots do Figma.

## 8. Referências oficiais e confiáveis

- [Figma — Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout-in-Figma)
- [Figma — Explore component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties)
- [Figma — Variants and component set fundamentals](https://help.figma.com/hc/en-us/articles/39636737843735-Components-collection-Variants-and-component-set-fundamentals)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — Non-text contrast 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C — Focus visible 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [W3C — Reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Lucide — ícones oficiais](https://lucide.dev/icons/settings-2)
- [IBM Carbon — Notificações](https://carbondesignsystem.com/components/notification/usage/)
- [GOV.UK Design System — Error summary](https://design-system.service.gov.uk/components/error-summary/)

## 9. Histórico e autoridade de implementação

O style tile v3 deu origem às diretrizes visuais; em 17/10/2026 o conteúdo passou a integrar as sete páginas definitivas do Figma. A estrutura antiga permanece como contexto histórico da evolução do arquivo.

A página 06 do Figma reúne contratos de tela, critérios e rastreabilidade para implementação. Esta especificação descreve fundamentos visuais; a RFC v2 e os requisitos detalhados definem escopo, regras e critérios funcionais. A conclusão do desenho permanece separada da aprovação institucional, da implementação e dos testes reais da solução.
