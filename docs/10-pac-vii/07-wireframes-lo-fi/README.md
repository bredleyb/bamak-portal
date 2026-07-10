# Wireframes lo-fi

Esta pasta reúne os wireframes de baixa fidelidade produzidos no PAC VII para o Portal Web Institucional-Comercial da Bamak.

Os arquivos registram a estrutura inicial das páginas públicas principais. Eles servem para orientar navegação, hierarquia de conteúdo, componentes previstos e continuidade técnica no PAC 8.

## Como ler estes arquivos

Os wireframes devem ser lidos como artefatos estruturais, não como telas finais.

Eles indicam:

- organização das seções;
- ordem de leitura das páginas;
- presença de cards, CTAs, filtros, formulários, acordeões e paginação;
- relação entre navegação pública e contato comercial;
- base para páginas de detalhe no PAC 8;
- componentes que precisarão ser considerados na arquitetura e na implementação.

Eles não definem:

- identidade visual final;
- cores finais;
- tipografia final;
- imagens finais;
- textos finais;
- espaçamentos finais;
- microinterações finais;
- implementação funcional pronta.

Os termos genéricos usados nos PDFs, como `placeholder`, `rótulo`, `descrição`, `dados`, `categoria`, `SKU-000` e `título do card`, indicam posições e tipos de conteúdo. Eles devem ser substituídos por conteúdo real validado com a Bamak na continuidade do projeto.

## Arquivos

| Arquivo | Página representada | Função no projeto |
|---|---|---|
| `wf-01-home.pdf` | Home | Estrutura a porta de entrada do portal, com chamadas para páginas internas, cards, CTAs, notícias, agenda e blocos de contato. |
| `wf-02-a-bamak.pdf` | A Bamak | Organiza apresentação institucional, indicadores, linha do tempo e chamadas para contato. |
| `wf-03-segmentos.pdf` | Segmentos | Lista contextos atendidos pela empresa e prepara navegação para detalhes de segmento. |
| `wf-04-solucoes.pdf` | Soluções | Lista frentes de solução da Bamak e prepara navegação para detalhes de solução. |
| `wf-05-catalogo.pdf` | Catálogo | Define o catálogo como área consultiva, com busca, filtros, ordenação, cards, SKU opcional, paginação e acesso a detalhes. |
| `wf-06-faq.pdf` | FAQ | Estrutura perguntas frequentes em formato expansível para orientar o visitante antes do contato. |
| `wf-07-contato.pdf` | Contato | Organiza formulário, dados de contato, confirmação de envio e blocos auxiliares. |
| `wf-08-noticias.pdf` | Notícias | Define listagem de publicações com filtros, categoria, data, paginação e acesso a detalhes. |
| `wf-09-agenda.pdf` | Agenda | Define listagem de eventos, separação entre próximos e históricos, filtros, data, localização e acesso a detalhes. |

## Escopo representado

Os wireframes cobrem as páginas públicas principais previstas para o PAC VII:

```txt
Home
→ A Bamak
→ Segmentos
→ Soluções
→ Catálogo
→ FAQ
→ Contato
→ Notícias
→ Agenda
```

As páginas de detalhe permanecem previstas para continuidade no PAC 8:

```txt
/segmentos/[slug]
/solucoes/[slug]
/catalogo/[slug]
/noticias/[slug]
/agenda/[slug]
```

O módulo administrativo também permanece previsto para o PAC 8 em nível de detalhamento visual. No PAC VII, ele foi definido em escopo, arquitetura e decisões técnicas, mas não foi desenhado nesta pasta.

## Relação com decisões do projeto

Os wireframes reforçam quatro decisões principais:

1. **Catálogo consultivo**  
   O catálogo foi desenhado para busca, refinamento e consulta de produtos. Ele não representa loja virtual.

2. **Contato comercial como saída do fluxo**  
   As páginas públicas conduzem o visitante para contato, não para compra automática.

3. **Conteúdo estruturado e administrável**  
   Cards, notícias, agenda, FAQ, segmentos, soluções e catálogo indicam conteúdos que precisarão ser mantidos pelo módulo administrativo.

4. **Arquitetura Web Apps**  
   Filtros, formulários, listagens, páginas de detalhe e conteúdo administrável justificam frontend, backend, banco de dados e autenticação administrativa.

## O que deve ser validado no PAC 8

Antes de transformar estes wireframes em interface final, será necessário validar com a Bamak:

- conteúdo real da página institucional;
- lista de segmentos atendidos;
- lista de soluções;
- categorias do catálogo;
- dados reais dos produtos;
- uso ou não de SKU/código interno;
- dúvidas frequentes reais;
- canais corretos de contato;
- notícias ou comunicados que farão sentido no portal;
- eventos e feiras que devem aparecer na agenda.

## Padrão de nomeação

Os arquivos usam o prefixo `wf-XX` para manter a ordem de leitura no repositório.

```txt
wf-01-home.pdf
wf-02-a-bamak.pdf
wf-03-segmentos.pdf
wf-04-solucoes.pdf
wf-05-catalogo.pdf
wf-06-faq.pdf
wf-07-contato.pdf
wf-08-noticias.pdf
wf-09-agenda.pdf
```

## Artefatos relacionados

- `docs/03-escopo/inventario-telas.md`
- `docs/04-arquitetura-informacao/fluxo-descoberta-contato.md`
- `docs/04-arquitetura-informacao/sitemap-publico.png`
- `docs/04-arquitetura-informacao/wireflow-publico.png`
- `docs/05-arquitetura-tecnica/arquitetura-web-apps.md`
- `docs/06-decisoes/0001-catalogo-consultivo.md`
- `docs/06-decisoes/0002-modulo-administrativo-editorial.md`
- `docs/06-decisoes/0004-recorte-sem-funcionalidades-transacionais.md`
- `docs/08-planejamento-pac-8/backlog-inicial.md`
