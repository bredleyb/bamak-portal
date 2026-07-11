# Direção visual das interfaces

| Campo | Valor |
|---|---|
| Projeto | Portal Bamak |
| Fase | Pré-PAC VIII |
| Escopo | Área pública e painel administrativo |
| Status | Em definição |
| Última atualização | 11/07/2026 |

## 1. Objetivo

Registrar como a paleta, a tipografia, o grid, a hierarquia e os cards devem se combinar na área pública e no painel administrativo do Portal Bamak.

Este documento complementa:

```text
paleta-operacional.md
tipografia-operacional.md
hierarquia-grid-cards.md
```

Ele não repete escalas, tokens ou medidas já definidos nesses artefatos. Seu foco é a aplicação conjunta dos fundamentos visuais, incluindo imagens, iconografia, navegação, elevação, movimento e estados de interface.

## 2. Conceito visual compartilhado

```text
Precisão industrial em contexto de campo
```

A expressão é uma direção interna de design, não um slogan comercial.

O sistema deve transmitir:

```text
técnico
confiável
direto
industrial
aplicado
contemporâneo
sem artificialidade
```

A marca não deve parecer:

- empresa de tecnologia futurista;
- e-commerce agrícola;
- marca ecológica genérica;
- indústria pesada escura e agressiva;
- plataforma SaaS desconectada da operação física.

### 2.1 Princípios

#### Evidência antes de decoração

Fotografias, mapas, equipamentos, instalações, produtos e informações operacionais devem sustentar a percepção visual. Elementos decorativos terão presença mínima.

#### Hierarquia antes de cor

Escala, alinhamento, espaço, imagem e contraste de superfície devem organizar a leitura antes do uso do verde.

#### Unidade sem uniformidade

Área pública e painel usarão:

- a mesma marca;
- a mesma paleta;
- as mesmas famílias tipográficas;
- a mesma iconografia;
- a mesma escala de espaçamento;
- os mesmos princípios de foco e feedback.

A diferença virá da proporção de uso, da densidade e da função de cada ambiente.

#### Verde como estrutura

O verde Bamak deve aparecer principalmente em:

- ação principal;
- navegação ativa;
- superfícies inversas estratégicas;
- destaques institucionais;
- elementos selecionados;
- marca.

Não deve colorir simultaneamente todos os títulos, ícones, bordas, cards e fundos.

## 3. Direção da área pública

### 3.1 Percepção pretendida

```text
institucional
técnica
fotográfica
clara
segura
próxima da operação real
```

A área pública pode ser mais expressiva que o painel, mas não excessivamente promocional.

### 3.2 Superfícies

A superfície predominante será clara:

```text
surface/page
```

Seções poderão alternar com:

```text
surface/subtle
```

O verde escuro será reservado a:

```text
surface/inverse
```

Não usar um fundo verde diferente em cada seção. Em uma mesma região da página, deve existir no máximo uma faixa inversa dominante.

### 3.3 Cabeçalho público

```text
Desktop: 72 px
Compacto: 64 px
Superfície: sólida e clara
Posição: sticky
Borda inferior: 1 px
Sombra permanente: não
```

Composição:

- lockup horizontal verde;
- links textuais;
- estado ativo em verde com indicador inferior de `2 px`;
- `Contato` como ação preenchida ao final;
- sem pills em todos os itens;
- sem ícone ao lado de cada destino;
- sem transparência sobre fotografia;
- sem animação de redução da altura durante a rolagem.

A implementação deve impedir que âncoras e elementos focados fiquem ocultos sob o cabeçalho sticky.

### 3.4 Navegação compacta

Quando os oito destinos deixarem de caber com folga:

- mostrar botão de menu;
- abrir uma sheet lateral;
- manter todos os destinos com rótulos;
- preservar foco visível;
- usar áreas de interação amplas;
- não substituir os destinos por ícones sem texto.

O ponto exato de troca será definido pelo conteúdo real.

### 3.5 Hero da Home

```text
texto: 7 colunas
imagem: 5 colunas
imagem: 4:3
```

Conteúdo:

- título;
- texto de apoio;
- até duas ações;
- imagem industrial relevante.

Não usar:

- cards sobrepostos à fotografia;
- carrossel automático;
- vídeo com reprodução automática;
- texto longo sobre imagem;
- métricas, notícias e vários destaques concorrendo com a mensagem principal.

CTA principal previsto:

```text
Veja o que podemos fazer por você
```

### 3.6 Páginas internas

A introdução padrão poderá conter:

- breadcrumb;
- título;
- parágrafo introdutório curto;
- ação opcional;
- imagem separada, quando acrescentar informação.

O texto introdutório não deve ocupar toda a largura do container.

Imagens podem aparecer:

- ao lado da introdução;
- abaixo dela;
- entre seções.

Não serão usadas como fundo permanente atrás de textos longos.

### 3.7 Rodapé

```text
fundo: verde escuro
marca: versão branca
texto: branco e branco atenuado
```

Conteúdo previsto:

- marca;
- navegação essencial;
- canais de contato;
- localização;
- informações legais;
- acesso administrativo discreto, caso permaneça público.

Não usar fotografia, textura ou gradiente.

## 4. Direção do painel administrativo

### 4.1 Percepção pretendida

```text
operacional
calmo
objetivo
preciso
confiável
compacto sem ser apertado
```

O painel não deve parecer:

- CRM complexo;
- dashboard financeiro;
- painel futurista escuro;
- grade de cards promocionais;
- versão decorativa do site público.

### 4.2 Uso de imagem

Fotografia no painel será funcional.

Pode aparecer em:

- miniatura de publicação;
- imagem de produto;
- foto enviada no Cabo Aéreo;
- mapa;
- anexo;
- preview de conteúdo.

Não aparecerá em:

- fundo do painel;
- página inicial administrativa;
- navegação;
- cards de métricas;
- formulários sem necessidade;
- cabeçalhos de página.

### 4.3 Navegação lateral

```text
Expandido: 256 px
Recolhido: 72 px
Compacto: drawer
```

A sidebar usará superfície neutra sutil e borda à direita.

#### Estado ativo

```text
fundo institucional claro
indicador vertical de 4 px
ícone verde
texto em peso 600
```

Não usar um bloco verde escuro inteiro para cada item ativo.

#### Rail recolhido

- símbolo Bamak no topo;
- ícones de `20 px`;
- áreas interativas de pelo menos `44 px`;
- tooltip com o nome do destino;
- nenhum rótulo truncado permanentemente.

### 4.4 Barra superior

```text
altura: 64 px
superfície: clara
borda inferior: 1 px
```

Funções:

- contexto da página;
- ação principal da tela;
- acesso ao perfil e configurações;
- botão de menu no compacto.

O título principal permanece no conteúdo. A barra superior não deve duplicar títulos grandes.

### 4.5 Conteúdo administrativo

#### Painel

Priorizar:

- indicadores operacionais;
- atendimentos recentes;
- pendências;
- conteúdos que exigem ação;
- atalhos coerentes com a rotina.

Não incluir gráficos sem função clara.

#### Atendimentos

Usar:

```text
toolbar
busca
filtros
tabela ou lista estruturada
status
paginação
detalhe
```

Não representar cada atendimento como card grande no desktop.

#### Comunicação

Usar listagem estruturada para:

- título;
- tipo;
- estado;
- data;
- última alteração;
- ações.

No editor, testar:

```text
formulário: 8 colunas
preview e dados auxiliares: 4 colunas
```

#### Detalhe do Cabo Aéreo

Estrutura:

- cabeçalho do atendimento;
- status;
- dados do solicitante;
- contexto da aplicação;
- localização e mapa;
- imagens e anexos;
- observações internas;
- ações de retorno;
- geração do PDF.

O agrupamento ocorrerá por seções e divisores, não por um card para cada campo.

## 5. Fotografia e mídia

### 5.1 Prioridade de fontes

1. fotografias reais da Bamak;
2. fotografias autorizadas de equipamentos, instalações e aplicações;
3. registros reais de produtos;
4. imagens documentais de apoio;
5. banco de imagem apenas quando não simular um caso real da empresa.

Imagens geradas por IA não serão usadas para representar:

- fábrica;
- equipamentos;
- instalações;
- clientes;
- funcionários;
- plantações;
- Cabo Aéreo;
- resultados de projetos;
- produtos.

### 5.2 Temas prioritários

- produção e montagem;
- equipamentos em contexto;
- detalhes mecânicos relevantes;
- aplicação em propriedades rurais;
- Cabo Aéreo instalado;
- instalações da empresa;
- transporte e logística;
- equipe trabalhando naturalmente;
- produtos isolados quando a identificação exigir clareza.

### 5.3 Enquadramento

Preferir:

- altura natural dos olhos;
- vista superior ou aérea quando explicar escala;
- contexto visível;
- ponto focal principal;
- linhas estruturais coerentes com o grid;
- nitidez suficiente para reconhecer equipamento e ambiente.

Evitar:

- ângulos inclinados sem função;
- close excessivamente abstrato;
- desfoque intenso;
- vários focos concorrentes;
- enquadramentos que escondam o funcionamento do equipamento.

### 5.4 Proporções

| Uso | Proporção |
|---|---:|
| Hero dividido | `4:3` |
| Portfólio | `16:9` |
| Comunicação | `16:9` |
| Produto | `4:3` |
| Faixa panorâmica | `2:1` |
| Avatar ou marcador excepcional | `1:1` |
| Evidência enviada | proporção original no detalhe |

### 5.5 Tratamento

Aplicar somente:

- correção moderada de exposição;
- equilíbrio de branco;
- corte;
- alinhamento;
- redução de ruído;
- nitidez controlada.

Não aplicar:

- lavagem verde;
- duotone;
- overlay colorido permanente;
- glow;
- flare artificial;
- vinheta;
- filtro cinematográfico;
- saturação extrema;
- substituição de fundo;
- montagem que altere a realidade.

### 5.6 Texto sobre imagem

Regra padrão:

```text
texto e fotografia ocupam áreas separadas
```

Quando texto sobre imagem for inevitável:

- usar bloco opaco;
- garantir contraste estável;
- limitar a mensagem;
- preservar o ponto focal;
- testar todos os recortes responsivos.

### 5.7 Imagem ausente

Quando não houver fotografia aceitável:

- usar placeholder neutro;
- mostrar o nome do produto ou conteúdo;
- não ampliar imagem pequena até expor artefatos;
- não preencher com fotografia genérica irrelevante.

### 5.8 Acessibilidade e rastreabilidade

Cada imagem publicada deve registrar:

```text
origem
autorização ou direito de uso
contexto
ponto focal, quando necessário
texto alternativo ou indicação decorativa
```

Imagens informativas recebem descrição curta. Imagens redundantes ou decorativas usam `alt=""`.

## 6. Iconografia

### 6.1 Biblioteca

```text
Lucide
```

Motivos:

- SVG;
- linguagem consistente;
- integração com React;
- importação apenas dos ícones usados;
- ajuste por tamanho, cor e espessura.

### 6.2 Construção visual

```text
canvas-base: 24 × 24 px
stroke: 2 px
caps: arredondados
joins: arredondados
preenchimento: não
```

### 6.3 Tamanhos

| Uso | Tamanho |
|---|---:|
| Tabela e conteúdo inline | `16 px` |
| Botões, campos e navegação | `20 px` |
| Ação isolada ou mobile | `24 px` |
| Estado vazio ou indicador destacado | `32 px` |

### 6.4 Cor

- usar `currentColor`;
- acompanhar o token do texto;
- manter monocromia;
- não colorir cada destino da navegação;
- não misturar ícones preenchidos e contornados;
- não usar emojis como iconografia funcional.

### 6.5 Rótulos

Controles apenas com ícone ficam restritos a ações reconhecíveis, como:

- menu;
- fechar;
- buscar;
- expandir;
- mais opções;
- excluir, quando o contexto for inequívoco.

Todo controle icon-only deve ter:

- nome acessível;
- tooltip quando necessário;
- foco visível;
- alvo de `44 × 44 px` sempre que possível.

### 6.6 Símbolo Bamak

Usar apenas como:

- identidade;
- favicon;
- avatar institucional;
- marca no rail recolhido.

Não usar como ícone genérico de navegação ou status.

## 7. Formas, bordas e elevação

### 7.1 Raios

```text
radius/none = 0 px
radius/sm   = 4 px
radius/md   = 8 px
radius/lg   = 12 px
radius/full = 9999 px
```

| Token | Uso |
|---|---|
| `none` | tabelas contíguas, divisores e mídia alinhada |
| `sm` | badges e tags |
| `md` | botões, campos, cards e acordeões |
| `lg` | dialogs, drawers e painéis destacados |
| `full` | avatar, ponto de status ou marcador circular |

Não usar `full` em todos os botões nem raios superiores a `12 px` em containers principais.

### 7.2 Bordas

```text
borda padrão: 1 px
borda forte: 1 px com maior contraste
foco: anel de 2 px
```

Borda e superfície devem separar componentes antes do uso de sombra.

### 7.3 Foco

```text
anel principal: 2 px
offset: 2 px
forma: acompanha o componente
```

Em superfícies variadas, combinar `focus/ring` e `focus/offset`.

### 7.4 Elevação

| Nível | Uso |
|---|---|
| `elevation/0` | páginas, cards, campos, tabelas e painéis normais |
| `elevation/1` | dropdown, popover, tooltip e menu |
| `elevation/2` | dialog, drawer e elemento modal |

Cards não terão sombra permanente.

O overlay modal será neutro e escuro, não verde.

## 8. Interação e movimento

### 8.1 Princípio

A linguagem será:

```text
rápida
discreta
explicativa
ligada à ação
sem chamar atenção para si mesma
```

### 8.2 Tokens preliminares

```text
motion/fast     = 110 ms
motion/standard = 150 ms
motion/panel    = 240 ms
```

| Token | Uso |
|---|---|
| `fast` | hover, focus, cor e opacidade |
| `standard` | acordeão, dropdown e seleção |
| `panel` | drawer, dialog, sheet e notificação |

### 8.3 Easing

```css
standard: cubic-bezier(0.2, 0, 0.38, 0.9);
entrance: cubic-bezier(0, 0, 0.38, 0.9);
exit: cubic-bezier(0.2, 0, 1, 0.9);
```

### 8.4 Movimentos não permitidos

- bounce;
- parallax;
- animação automática de números;
- carrossel automático;
- revelação de seções durante scroll;
- escala de card no hover;
- logo animado;
- pulsação contínua;
- deslocamento sem função;
- animação de fundo.

### 8.5 Movimento reduzido

Com:

```css
@media (prefers-reduced-motion: reduce)
```

remover:

- deslocamentos espaciais;
- expansões animadas não essenciais;
- transições de página;
- efeitos decorativos.

Os estados finais devem permanecer visíveis de forma imediata.

## 9. Estados de interface

### 9.1 Estados previstos

```text
loading
empty-initial
no-results
success
warning
error
validation-error
disabled
unauthorized
session-expired
uploading
upload-failed
offline
map-unavailable
```

### 9.2 Anatomia

Quando aplicável:

```text
ícone
título
explicação
contexto preservado
ação principal
ação secundária opcional
```

Cor nunca será o único indicador.

### 9.3 Loading

#### Ação localizada

Usar spinner pequeno em:

```text
Salvar
Enviar
Gerar PDF
Carregar arquivo
```

#### Conteúdo estruturado

Usar skeleton em:

- tabela;
- lista;
- cards;
- detalhe;
- painel.

Evitar vários spinners independentes na mesma página.

### 9.4 Estado vazio inicial

Exemplo:

```text
Ainda não há comunicados publicados.
Crie o primeiro comunicado para disponibilizá-lo no portal.
[ Criar comunicado ]
```

Não deve parecer erro.

### 9.5 Sem resultados

Exemplo:

```text
Nenhum produto corresponde aos filtros aplicados.
Remova alguns filtros ou faça uma nova busca.
[ Limpar filtros ]
```

Os filtros devem permanecer visíveis.

### 9.6 Erro de validação

Após envio inválido:

- mostrar resumo no início do formulário;
- indicar cada erro junto ao campo;
- preservar os valores preenchidos;
- mover o foco de forma coerente;
- explicar como corrigir.

### 9.7 Erro de sistema

A mensagem deve informar:

- o que não foi concluído;
- se os dados foram preservados;
- se é possível tentar novamente;
- qual canal usar se o problema persistir.

Não usar apenas:

```text
Algo deu errado.
```

### 9.8 Confirmação do Cabo Aéreo

Informar:

- recebimento da solicitação;
- número ou referência;
- canal de retorno informado;
- expectativa geral de continuidade;
- possibilidade de corrigir dados, quando aplicável;
- link para voltar ao portal.

Não prometer relatório privado, resposta automática ou prazo não validado.

### 9.9 Status administrativos

Exemplos preliminares:

```text
Novo
Em análise
Aguardando informações
Retorno enviado
Concluído
Cancelado
```

A forma visual deve combinar:

```text
forma ou ícone
cor semântica
texto explícito
```

A taxonomia final depende de validação com a operação.

### 9.10 Toasts

Usar apenas para confirmações transitórias de baixo risco:

```text
Alterações salvas
Link copiado
Arquivo removido
```

Não usar como único local para:

- erro que exige correção;
- ação destrutiva;
- falha de envio;
- expiração de sessão;
- perda de dados.

## 10. Diferença entre os ambientes

| Aspecto | Área pública | Painel administrativo |
|---|---|---|
| Objetivo | apresentar e orientar | operar e acompanhar |
| Expressividade | moderada | baixa |
| Fotografia | importante | funcional e localizada |
| Espaçamento | amplo | compacto |
| Verde | faixas, CTA e marca | ação, seleção e status |
| Superfícies inversas | estratégicas | raras |
| Cards | conteúdo editorial e comercial | resumos e previews |
| Estrutura dominante | seções e narrativa | toolbar, lista, tabela e formulário |
| Movimento | discreto | mínimo e produtivo |
| Imagem principal | permitida | não |
| Densidade | baixa a média | média |
| Tom | institucional e técnico | operacional e preciso |

## 11. Materialização no style tile

### 11.1 Área pública

Incluir:

1. cabeçalho público;
2. hero `7 + 5`;
3. fotografia real em `4:3`;
4. seção institucional clara;
5. seção inversa;
6. card de Portfólio;
7. card de produto;
8. card de Comunicação;
9. formulário com painel de apoio;
10. CTA;
11. rodapé;
12. estados hover e focus.

### 11.2 Painel administrativo

Incluir:

1. sidebar expandida;
2. rail recolhido;
3. barra superior;
4. título e toolbar;
5. tiles de indicadores;
6. tabela de atendimentos;
7. status;
8. formulário;
9. upload;
10. detalhe com anexos;
11. estado vazio;
12. loading;
13. erro;
14. dialog ou drawer;
15. focus.

Não é necessário desenhar páginas completas nesta etapa. O style tile deve testar combinações críticas.

## 12. Pendências

- [ ] Inventariar as fotografias reais disponíveis.
- [ ] Confirmar autorização para imagens de pessoas, clientes e propriedades.
- [ ] Selecionar imagens para Home, Institucional, Portfólio e Cabo Aéreo.
- [ ] Testar os oito destinos no cabeçalho expandido.
- [ ] Definir o ponto de troca para o menu compacto.
- [ ] Validar a taxonomia de status dos Atendimentos.
- [ ] Definir o comportamento da Comunicação administrativa.
- [ ] Testar Lucide junto à tipografia e à marca.
- [ ] Finalizar cores de borda, foco, overlay e elevação após a paleta.
- [ ] Testar Archivo junto às fotografias e ao lockup.
- [ ] Testar cabeçalho sticky com foco e âncoras.
- [ ] Testar movimento reduzido.
- [ ] Validar as duas direções no style tile.
- [ ] Registrar os ajustes identificados.
- [ ] Validar a direção visual com a Bamak.

## 13. Critério para consolidação

A direção poderá ser marcada como consolidada quando:

- as duas áreas estiverem representadas no style tile;
- fotografia, iconografia, navegação e estados seguirem a mesma linguagem;
- a área pública permanecer institucional sem se tornar publicitária;
- o painel permanecer funcional sem parecer genérico;
- o uso do verde estiver controlado;
- os estados funcionarem sem depender somente da cor;
- a navegação compacta e o cabeçalho sticky forem testados;
- o movimento reduzido estiver previsto;
- os ajustes finais estiverem registrados;
- a direção visual tiver sido validada com a Bamak.

## 14. Referências de trabalho

- [IBM Design Language — Photography](https://www.ibm.com/design/language/photography/)
- [Lucide](https://lucide.dev/)
- [Material Design 3 — Navigation drawer](https://m3.material.io/components/navigation-drawer/overview)
- [Carbon Design System — Motion](https://carbondesignsystem.com/elements/motion/overview/)
- [Carbon Design System — Status indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [Carbon Design System — Loading](https://carbondesignsystem.com/components/loading/usage/)
- [WAI — Images decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [WCAG 2.2 — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [WCAG 2.2 — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WCAG 2.2 — Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [WCAG 2.2 — Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WCAG 2.2 — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 — Reduced Motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
