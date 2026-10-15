# Style tile v3 — Consolidação técnica e handoff

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak — PAC VIII |
| Status | Referência visual v3 preparada para prototipação e implementação; validação institucional pendente |
| Data da revisão | 15/10/2026 |
| Escopo | Área pública, painel administrativo, fundamentos, componentes e estudos responsivos |
| Fonte de design | [Figma — Bamak](https://www.figma.com/design/v8isMyxA5VJCqYOimNlGjd/Bamak-%7C-Arquitetura-da-Informa%C3%A7%C3%A3o-e-Prot%C3%B3tipos) |
| Origem | Revisão técnica da v2, preservada no arquivo Figma como página 99 |

## 1. Organização no Figma

- **05 — Style tile:** fundamentos, collage público, collage administrativo, estados e Setup.
- **06 — Componentes | v3:** mestres, conjuntos de variantes e galeria de exemplos instanciados.
- **07 — Responsividade | v3:** composição pública de 390 px, lista administrativa mobile de 390 px, detalhe de Cabo Aéreo de 390 px e menu compacto.
- **99 — Arquivo | Style tile v2:** cópia de referência anterior às alterações estruturais.
- **Lo-fi Público:** wireframes históricos preservados, não equivalentes à RFC v2.

Página pública de referência: `node-id=120-2`; biblioteca: `node-id=299-225`; estudos responsivos: `node-id=303-58`.

A versão 3 **não representa aprovação da Bamak**. Exemplos de atendimento, nomes de empresas, textos de interface e fotografias em cinza são demonstrativos; não descrevem fatos, clientes nem instalações reais.

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

## 5. Componentes reais da v3

A página 06 contém componentes locais Figma para:

| Conjunto | Variantes |
|---|---:|
| Button | 30 — Primary, Secondary, Ghost × Small/Medium × Default/Hover/Pressed/Focused/Disabled |
| Field | 4 — Default, Focused, Error, ReadOnly |
| Select | 3 — Default, Focused, Error |
| Checkbox | 3 — Unchecked, Checked, Error |
| Badge | 4 — Neutral, New, InReview, Done |
| Notification | 4 — Info, Success, Warning, Danger |
| NavItem | 2 — Default, Active |
| TableRow | 3 — New, InReview, Done |
| ContentCard | 3 — Application, Product, Publication |

São **56 variantes** distribuídas em nove conjuntos, além dos componentes preexistentes da marca. Os grupos essenciais usam Auto Layout, estilos tipográficos e propriedades de texto, com instâncias demonstradas na galeria.

As cores de badges operacionais não devem se confundir com feedback: `Em análise` é um estado de processo neutro, não um aviso por padrão.

Os componentes da página 06 são padrões **visuais**, não controles funcionais. O comportamento, semântica DOM, acessibilidade e estados reais serão implementados e testados no frontend.

### 5.1 Iconografia

Padrão: **Lucide oficial**, SVG outline de 24 px, stroke 2 px, dimensões de 16/20/24/32 px conforme função. As amostras do Setup e a navegação administrativa usam SVGs oficiais provenientes de `lucide-icons/lucide`. Configurações usa `settings-2` (não engrenagem desenhada à mão). Ícones sem texto exigem nome acessível e alvo interativo adequado.

### 5.2 Princípios de utilização

- Uma ação dominante por região; botões secundários não concorrem com o principal.
- Checkbox de LGPD com rótulo persistente; validação no próprio campo e resumo de erros quando o formulário justificar.
- Foco perceptível por teclado; estado disabled apenas com justificativa funcional.
- Tabelas para dados comparáveis; lista estruturada na largura compacta quando a tabela não for adequada.
- Produto, Aplicação e Comunicação têm modelos distintos. Fotografias: Produto 4:3; Aplicações e Comunicação 16:9; hero 4:3.
- Estados de carregamento são visuais na prancha, mas devem ter sinalização apropriada durante a execução.

## 6. Estudos responsivos (página 07)

Foram criadas referências em 390 px para:
1. Interface pública: navegação compacta, hero empilhado, CTAs, cards reais instanciados e chamada institucional.
2. Administração: busca com rótulo persistente, filtros compactos e itens de atendimento com badges.
3. Detalhe de Cabo Aéreo: solicitante, contexto, localização, anexos e ação de gerar ficha PDF.
4. Menu público compacto com oito destinos e rótulos legíveis.

Separar listagem administrativa de detalhe evita apresentar operações de um registro arbitrário dentro de uma tabela sem seleção. Essa distinção deve ser preservada nos protótipos finais.

Não foram prototipadas ainda todas as telas da RFC v2. Estes são **estudos de sistema** para orientar sua produção.

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

## 9. Histórico e handoff

A v2 foi copiada para a página 99 dentro do Figma. Essa cópia **não é backup independente**. A página 05 permanece como style tile de apresentação; a biblioteca de componentes fica na 06; os estudos responsivos ficam na 07.

As demais notas em `docs/pac-viii/05-design/` são referências históricas e justificativas de decisão; onde houver conflito técnico, esta especificação v3 apresenta o estado mais recente do Figma, sujeito à validação funcional e aprovação futura.
