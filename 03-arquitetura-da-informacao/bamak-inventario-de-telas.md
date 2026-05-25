# Inventário de Telas — Portal Bamak

## Telas públicas

|   ID   |       Tela       |                           Objetivo principal                           |       Origem principal      |                                    Destino principal                                     |
|--------|------------------|------------------------------------------------------------------------|-----------------------------|------------------------------------------------------------------------------------------|
| PUB-01 | Home             | Apresentar a empresa e orientar a navegação inicial do portal          | Acesso inicial              | Sobre a empresa, Segmentos, Soluções, Catálogo, FAQ, Contato, Notícias, Eventos e feiras |
| PUB-02 | Sobre a empresa  | Explicar quem é a Bamak, sua atuação e seus diferenciais               | Home                        | Contato                                                                                  |
| PUB-03 | Segmentos        | Apresentar os segmentos atendidos pela empresa                         | Home                        | PUB-04 Segmento detalhe, Contato                                                         |
| PUB-04 | Segmento detalhe | Detalhar um segmento específico e sua relação com soluções e produtos  | PUB-03 Segmentos            | Soluções, Catálogo, Contato                                                              |
| PUB-05 | Soluções         | Apresentar as soluções oferecidas pela empresa                         | Home                        | PUB-06 Solução detalhe, Contato                                                          |
| PUB-06 | Solução detalhe  | Detalhar uma solução específica e sua relação com segmentos e produtos | PUB-05 Soluções             | Catálogo, Contato                                                                        |
| PUB-07 | Catálogo         | Exibir os produtos da empresa organizados por categoria ou segmento    | Home                        | PUB-08 Produto detalhe, Contato                                                          |
| PUB-08 | Produto detalhe  | Apresentar um produto específico com informações mais detalhadas       | PUB-07 Catálogo             | Contato                                                                                  |
| PUB-09 | FAQ              | Orientar o visitante sobre orçamento e pedidos antes do contato        | Home                        | Contato                                                                                  |
| PUB-10 | Contato          | Permitir o contato comercial com a empresa                             | Home, FAQ, páginas internas | Envio de mensagem                                                                        |
| PUB-11 | Notícias         | Exibir notícias publicadas pela empresa                                | Home                        | PUB-12 Notícia detalhe                                                                   |
| PUB-12 | Notícia detalhe  | Apresentar o conteúdo completo de uma notícia                          | PUB-11 Notícias             | Notícias                                                                                 |
| PUB-13 | Eventos e feiras | Exibir eventos e feiras relacionados à empresa                         | Home                        | PUB-14 Evento detalhe                                                                    |
| PUB-14 | Evento detalhe   | Apresentar informações completas de um evento ou feira                 | PUB-13 Eventos e feiras     | Eventos e feiras, Contato                                                                |

## Telas administrativas

|   ID   |          Tela          |                     Objetivo principal                    |     Origem principal     |                               Destino principal                                |
|--------|------------------------|-----------------------------------------------------------|--------------------------|--------------------------------------------------------------------------------|
| ADM-01 | Login                  | Autenticar o acesso ao módulo administrativo              | Acesso direto            | ADM-02 Dashboard                                                               |
| ADM-02 | Dashboard              | Centralizar o acesso às funções administrativas do portal | ADM-01 Login             | Notícias, Eventos, FAQ, Catálogo, Conteúdo institucional, Mensagens de contato |
| ADM-03 | Notícias listagem      | Exibir e organizar as notícias cadastradas                | ADM-02 Dashboard         | ADM-04 Notícias formulário                                                     |
| ADM-04 | Notícias formulário    | Criar ou editar uma notícia                               | ADM-03 Notícias listagem | ADM-03 Notícias listagem                                                       |
| ADM-05 | Eventos listagem       | Exibir e organizar eventos e feiras cadastrados           | ADM-02 Dashboard         | ADM-06 Eventos formulário                                                      |
| ADM-06 | Eventos formulário     | Criar ou editar um evento ou feira                        | ADM-05 Eventos listagem  | ADM-05 Eventos listagem                                                        |
| ADM-07 | FAQ listagem           | Exibir e organizar os itens da FAQ                        | ADM-02 Dashboard         | ADM-08 FAQ formulário                                                          |
| ADM-08 | FAQ formulário         | Criar ou editar um item da FAQ                            | ADM-07 FAQ listagem      | ADM-07 FAQ listagem                                                            |
| ADM-09 | Catálogo listagem      | Exibir e organizar os produtos cadastrados                | ADM-02 Dashboard         | ADM-10 Produto formulário                                                      |
| ADM-10 | Produto formulário     | Criar ou editar um produto do catálogo                    | ADM-09 Catálogo listagem | ADM-09 Catálogo listagem                                                       |
| ADM-11 | Conteúdo institucional | Atualizar conteúdos institucionais centrais do portal     | ADM-02 Dashboard         | ADM-02 Dashboard                                                               |
| ADM-12 | Mensagens de contato   | Visualizar mensagens enviadas pelo formulário de contato  | ADM-02 Dashboard         | ADM-02 Dashboard                                                               |