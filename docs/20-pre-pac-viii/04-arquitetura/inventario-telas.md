# Inventário de telas da linha de base

## 1. Regra de inventário

Cada item deste inventário corresponde a uma tela, rota ou estado que precisa ser considerado em arquitetura, prototipação ou implementação.

Legenda de prototipação:

- **Lo-fi:** estrutura e fluxo;
- **Mid-fi público:** área pública;
- **Mid-fi admin:** área administrativa;
- **Sem tela própria:** estado incorporado a outra tela.

## 2. Telas públicas

| ID | Tela | Rota | Finalidade | Entrada principal | Saída principal | Requisitos | Protótipo | Prioridade |
|---|---|---|---|---|---|---|---|---|
| PUB-01 | Home | `/` | Apresentar a Bamak e distribuir o visitante. | Acesso direto ou busca. | Institucional, Aplicações, Catálogo, Cabo Aéreo, Contato. | RF-PUB-01 a 03 | Lo-fi + Mid-fi público | Alta |
| PUB-02 | Institucional | `/institucional` | Organizar história, atuação e credibilidade. | Home ou menu. | Aplicações, Catálogo, Contato. | RF-INS-01 a 03 | Lo-fi + Mid-fi público | Alta |
| PUB-03 | Aplicações | `/aplicacoes` | Listar contextos de uso. | Home ou menu. | Detalhe de aplicação. | RF-APL-01 | Lo-fi + Mid-fi público | Alta |
| PUB-04 | Detalhe de aplicação | `/aplicacoes/[slug]` | Explicar um contexto e relacionar produtos. | PUB-03. | Catálogo, produto, Contato ou Cabo Aéreo. | RF-APL-02 e 03 | Mid-fi público | Alta |
| PUB-05 | Catálogo | `/catalogo` | Permitir busca e filtro de produtos. | Home, menu ou Aplicações. | Detalhe de produto. | RF-CAT-01 a 03 | Lo-fi + Mid-fi público | Alta |
| PUB-06 | Detalhe de produto | `/catalogo/[slug]` | Exibir descrição, aplicação e CTA. | PUB-05 ou PUB-04. | Contato. | RF-CAT-04 e 05 | Mid-fi público | Alta |
| PUB-07 | Cabo Aéreo | `/cabo-aereo` | Explicar a aplicação e receber solicitação estruturada. | Menu, Home ou Aplicações. | Confirmação de envio. | RF-CAB-01 a 09 | Lo-fi + Mid-fi público | Alta |
| PUB-08 | Confirmação de Cabo Aéreo | estado de `/cabo-aereo` | Confirmar o registro sem expor ficha interna. | Envio válido. | Home ou canais de contato. | RF-CAB-09 | Sem tela própria ou Mid-fi público | Alta |
| PUB-09 | FAQ | `/faq` | Responder dúvidas anteriores ao contato. | Menu ou páginas públicas. | Contato ou Cabo Aéreo. | RF-FAQ-01 a 03 | Lo-fi + Mid-fi público | Média |
| PUB-10 | Comunicação | `/comunicacao` | Listar notícias, agenda, eventos, feiras e comunicados. | Home ou menu. | Detalhe de conteúdo. | RF-COM-01, 02 e 04 | Lo-fi + Mid-fi público | Média |
| PUB-11 | Detalhe de Comunicação | `/comunicacao/[slug]` | Exibir conteúdo publicado. | PUB-10. | Comunicação ou Contato. | RF-COM-03 | Mid-fi público | Média |
| PUB-12 | Contato | `/contato` | Exibir canais e receber formulário geral. | Menu, CTA ou rodapé. | Confirmação de contato. | RF-CON-01 a 06 | Lo-fi + Mid-fi público | Alta |
| PUB-13 | Confirmação de contato | estado de `/contato` | Confirmar o registro da mensagem. | Envio válido. | Home ou canais externos. | RF-CON-05 | Sem tela própria ou Mid-fi público | Alta |
| PUB-14 | Política de privacidade | `/privacidade` | Explicar uso, finalidade, acesso e retenção dos dados. | Formulários e rodapé. | Retorno à página anterior. | LGPD da RFC v2 | Mid-fi público | Alta |

## 3. Estados públicos de suporte

| ID | Estado | Aplicação | Comportamento esperado | Protótipo |
|---|---|---|---|---|
| SUP-PUB-01 | Página não encontrada | Rotas inexistentes. | Informar erro e oferecer retorno à Home. | Mid-fi público |
| SUP-PUB-02 | Listagem vazia | Catálogo e Comunicação. | Explicar ausência de resultado e permitir limpar filtros. | Mid-fi público |
| SUP-PUB-03 | Erro de formulário | Contato e Cabo Aéreo. | Identificar campos e preservar dados válidos. | Mid-fi público |
| SUP-PUB-04 | Erro de upload | Cabo Aéreo. | Informar formato, tamanho ou quantidade inválida. | Mid-fi público |
| SUP-PUB-05 | Erro de mapa | Cabo Aéreo. | Manter alternativa textual disponível. | Mid-fi público |
| SUP-PUB-06 | Carregamento | Listagens e formulários. | Bloquear ação duplicada e informar progresso. | Mid-fi público |

## 4. Telas administrativas

| ID | Tela | Rota | Perfil | Finalidade | Entrada | Saída | Requisitos | Protótipo | Prioridade |
|---|---|---|---|---|---|---|---|---|---|
| ADM-01 | Login | `/admin/login` | Público restrito | Autenticar usuário administrativo. | Acesso direto. | Painel. | RF-ADM-01 | Lo-fi + Mid-fi admin | Alta |
| ADM-02 | Painel | `/admin` | Administrador e Operador | Exibir resumo de entradas e alertas. | Login. | Atendimentos, Comunicação ou Configurações. | RF-PAI-01 a 03 | Lo-fi + Mid-fi admin | Alta |
| ADM-03 | Atendimentos | `/admin/atendimentos` | Administrador e Operador | Listar e filtrar entradas. | Painel ou menu. | Detalhe de atendimento. | RF-ATE-01 e 02 | Lo-fi + Mid-fi admin | Alta |
| ADM-04 | Detalhe de contato geral | `/admin/atendimentos/[id]` | Administrador e Operador | Exibir mensagem, contato, datas e estado. | ADM-03. | Atualização de estado. | RF-ATE-03 e 04 | Mid-fi admin | Alta |
| ADM-05 | Detalhe de Cabo Aéreo | `/admin/atendimentos/[id]` | Administrador e Operador | Reunir dados, localização, anexos, ficha e PDF. | ADM-03. | Ficha, anexos, geração e envio de PDF. | RF-ATE-03 a 10 | Lo-fi + Mid-fi admin | Alta |
| ADM-06 | Visualização da ficha | estado de ADM-05 | Administrador e Operador | Exibir a solicitação em formato interno organizado. | ADM-05. | Gerar PDF. | RF-ATE-06 e 07 | Mid-fi admin | Alta |
| ADM-07 | Visualização do PDF | estado ou modal de ADM-05 | Administrador e Operador | Conferir o documento armazenado. | PDF existente. | Enviar ou baixar conforme permissão. | RF-ATE-08 e 09 | Mid-fi admin | Alta |
| ADM-08 | Comunicação | `/admin/comunicacao` | Administrador | Listar rascunhos, publicados e ocultos. | Painel ou menu. | Novo ou editar conteúdo. | RF-CMA-01 a 05 | Lo-fi + Mid-fi admin | Média |
| ADM-09 | Novo conteúdo | `/admin/comunicacao/novo` | Administrador | Criar notícia, agenda, evento, feira ou comunicado. | ADM-08. | Rascunho ou publicação. | RF-CMA-01, 03 e 04 | Mid-fi admin | Média |
| ADM-10 | Editar conteúdo | `/admin/comunicacao/[id]/editar` | Administrador | Atualizar ou ocultar conteúdo. | ADM-08. | Comunicação pública ou listagem admin. | RF-CMA-02, 04 e 05 | Mid-fi admin | Média |
| ADM-11 | Configurações | `/admin/configuracoes` | Administrador | Acessar usuários e integrações essenciais. | Painel ou menu. | Usuários e parâmetros. | RF-CFG-01 a 04 | Lo-fi + Mid-fi admin | Média |
| ADM-12 | Usuários e acessos | `/admin/configuracoes/usuarios` | Administrador | Criar, alterar perfil, ativar e desativar usuários. | ADM-11. | Configurações. | RF-CFG-01 a 03 | Mid-fi admin | Média |

## 5. Estados administrativos de suporte

| ID | Estado | Aplicação | Comportamento esperado | Protótipo |
|---|---|---|---|---|
| SUP-ADM-01 | Acesso negado | Rota sem permissão. | Informar restrição e oferecer retorno permitido. | Mid-fi admin |
| SUP-ADM-02 | Sessão expirada | Qualquer rota administrativa. | Redirecionar ao login e informar o motivo. | Mid-fi admin |
| SUP-ADM-03 | Atendimento vazio | Lista sem registros. | Informar ausência e manter filtros disponíveis. | Mid-fi admin |
| SUP-ADM-04 | Falha na geração do PDF | ADM-05. | Preservar atendimento e permitir nova tentativa. | Mid-fi admin |
| SUP-ADM-05 | Falha no envio por e-mail | ADM-05. | Registrar falha e exibir ação de reenvio. | Mid-fi admin |
| SUP-ADM-06 | Falha ao carregar anexo | ADM-05. | Informar indisponibilidade sem expor URL direta. | Mid-fi admin |
| SUP-ADM-07 | Conteúdo não publicado | ADM-08 a 10. | Exibir status de rascunho ou oculto. | Mid-fi admin |

## 6. Componentes funcionais que não geram tela própria

| Componente | Aplicação |
|---|---|
| Menu público | Todas as telas públicas. |
| Rodapé | Todas as telas públicas. |
| Busca e filtros | Catálogo, Comunicação e Atendimentos. |
| Mapa | Parte do formulário de Cabo Aéreo. |
| Upload de imagens | Parte do formulário de Cabo Aéreo. |
| Checkbox LGPD | Contato e Cabo Aéreo. |
| Alteração de estado | Detalhe de atendimento. |
| Confirmação de publicação | Comunicação administrativa. |
| Modal de envio do PDF | Detalhe de Cabo Aéreo. |
| Alertas operacionais | Painel e detalhe de atendimento. |

## 7. Dependências para prototipação

Antes dos protótipos mid fidelity, precisam estar definidos:

- campos finais do Cabo Aéreo;
- conteúdo institucional aprovado para uso;
- taxonomia inicial de Aplicações;
- categorias iniciais do Catálogo;
- estados de Atendimentos usados no protótipo;
- permissões do Operador;
- tipos de conteúdo ativos em Comunicação;
- texto preliminar de consentimento e privacidade.

## 8. Relação com os três fluxos obrigatórios

| Fluxo | Telas principais |
|---|---|
| Descoberta e contato geral | PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06, PUB-09, PUB-12, PUB-13, ADM-03, ADM-04 |
| Cabo Aéreo | PUB-07, PUB-08, ADM-03, ADM-05, ADM-06, ADM-07 |
| Publicação de Comunicação | ADM-01, ADM-02, ADM-08, ADM-09, ADM-10, PUB-10, PUB-11 |

## 9. Telas fora da primeira versão

Não entram no inventário da primeira versão:

- cadastro de cliente;
- login de cliente;
- área privada;
- orçamento;
- proposta comercial;
- carrinho;
- checkout;
- pagamento;
- CRM;
- funil de vendas;
- dashboard comercial;
- gestão de estoque;
- chatbot;
- cálculo técnico de Cabo Aéreo.
