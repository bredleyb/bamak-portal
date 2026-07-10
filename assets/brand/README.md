# Assets da marca Bamak

Acervo de marca utilizado no Portal Bamak, nos protótipos e nos entregáveis do projeto.

A Bamak não possui manual formal de identidade visual. O verde `#00421F`, a organização dos arquivos e a assinatura empilhada foram padronizados para este projeto a partir dos materiais institucionais disponíveis.

## Estrutura

```text
assets/brand/
├── source/
│   └── bamak-brand-master.ai
├── svg/
├── png/
└── README.md
```

- `source/bamak-brand-master.ai`: arquivo mestre editável.
- `svg/`: arquivos principais para uso digital.
- `png/`: versões rasterizadas para compatibilidade.

Alterações devem ser feitas no arquivo mestre e seguidas pela nova exportação dos SVGs e PNGs correspondentes.

## Arquivos

O padrão de nomenclatura é:

```text
bamak-[composition]-[color].[extension]
```

| Composição | Conteúdo |
|---|---|
| `lockup-horizontal` | símbolo e nome dispostos horizontalmente |
| `lockup-stacked` | símbolo acima do nome |
| `wordmark` | somente o nome BAMAK |
| `symbol` | somente o símbolo |

Cada composição possui as variantes:

- `green`: `#00421F`
- `white`: `#FFFFFF`

Os nomes técnicos usam letras minúsculas, hífens e caracteres sem acento.

## Uso

- Use as versões verdes sobre fundos claros.
- Use as versões brancas sobre fundos escuros.
- Prefira `lockup-horizontal` quando houver largura disponível.
- Use `lockup-stacked` em áreas mais verticais ou compactas.
- Use `wordmark` quando o símbolo já estiver presente no contexto.
- Use `symbol` em avatares, ícones e espaços reduzidos.

Preserve a proporção, a geometria, as cores e a posição relativa dos elementos. Não aplique efeitos, contornos, gradientes ou fundos incorporados.

## Exportação

Antes de exportar no Illustrator:

```text
brand-assets: visível
preview-backgrounds: oculta
```

As pranchetas possuem margem técnica mínima de `2 px` em cada lado. Essa margem evita cortes e não substitui a área de proteção aplicada no layout.

### SVG

```text
Exportação: por pranchetas
Escala: 1x
Estilo: atributos de apresentação
Fontes: converter em contornos
IDs de objeto: mínimos
Casas decimais: 3
Minificar: ativado
Responsivo: ativado
```

### PNG

```text
Fundo: transparente
Espaço de cor: sRGB
Suavização: otimizada para arte
```

| Composição | Largura do PNG |
|---|---:|
| `lockup-horizontal` | 1600 px |
| `lockup-stacked` | 1600 px |
| `wordmark` | 1600 px |
| `symbol` | 1024 px |

A altura deve permanecer proporcional. As versões verde e branca da mesma composição devem ter dimensões idênticas.
