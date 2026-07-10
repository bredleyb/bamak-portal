# Mudanças do PAC VII para a linha de base do PAC VIII

## 1. Finalidade

Este documento registra as mudanças entre a proposta aprovada no PAC VII e a linha de base refinada para o PAC VIII.

O PAC VII permanece como histórico da fase de concepção. Os ajustes descritos aqui orientam o Pré-PAC VIII e a futura implementação, sem reescrever os entregáveis já concluídos.

## 2. Elementos mantidos do PAC VII

Permanecem válidos:

- portal web institucional-comercial para a Bamak;
- área pública e área administrativa autenticada;
- catálogo consultivo;
- FAQ;
- contato por canais humanos;
- publicação de notícias e agenda;
- arquitetura cliente-servidor;
- frontend, backend e banco de dados próprios;
- stack prevista com Next.js, NestJS, PostgreSQL, Prisma, JWT e Docker;
- exclusão de e-commerce, orçamento automático, CRM, ERP e área de cliente;
- implementação funcional reservada ao PAC VIII.

Também permanece o princípio de que o portal prepara o contato comercial e organiza informações antes do atendimento humano.

## 3. Mudança de foco

No PAC VII, o projeto foi apresentado principalmente como reorganização da apresentação institucional, comercial e dos caminhos de contato da Bamak.

Na linha de base atual, o foco passa a explicitar que:

- o site atual praticamente não participa da geração de contatos;
- a empresa ainda depende de indicação, relacionamento direto e canais tradicionais;
- o portal será a primeira estrutura digital mais organizada da Bamak;
- a nova presença digital deve atender pessoas que pesquisam a empresa antes de iniciar contato;
- o sistema deve apoiar descoberta, consulta e início do atendimento;
- a continuidade comercial e técnica permanece com a equipe da empresa.

A inovação passa a ser tratada como estruturação de presença digital institucional-comercial e operacionalmente viável para uma empresa sem equipe dedicada aos canais digitais.

## 4. Navegação pública

### 4.1 Estrutura aprovada no PAC VII

1. Home
2. A Bamak
3. Segmentos
4. Soluções
5. Catálogo
6. FAQ
7. Contato
8. Notícias
9. Agenda

### 4.2 Estrutura refinada

1. Home
2. Institucional
3. Aplicações
4. Catálogo
5. Cabo Aéreo
6. FAQ
7. Comunicação
8. Contato

### 4.3 Ajustes realizados

- `A Bamak` foi renomeada para `Institucional`.
- `Segmentos` e `Soluções` foram reorganizados em `Aplicações`.
- `Cabo Aéreo` passou a ter página e fluxo próprios.
- `Notícias` e `Agenda` foram reunidas em `Comunicação`.
- A navegação principal passou de nove para oito áreas.
- Páginas de detalhe continuam previstas como rotas derivadas, sem ocupar a navegação principal.

## 5. Navegação administrativa

### 5.1 Escopo previsto no PAC VII

O módulo administrativo previa manutenção de:

- conteúdos institucionais;
- segmentos;
- soluções;
- catálogo;
- FAQ;
- notícias;
- agenda;
- mensagens recebidas.

### 5.2 Escopo refinado

A navegação administrativa passa a ser:

1. Painel
2. Atendimentos
3. Comunicação
4. Configurações

### 5.3 Ajustes realizados

O painel deixa de funcionar como CMS amplo.

A administração passa a concentrar:

- acompanhamento de solicitações;
- consulta de registros internos;
- gestão limitada de conteúdos de Comunicação;
- configurações essenciais;
- operação compatível com a rotina do escritório.

A manutenção estrutural das páginas públicas permanece técnica.

Perfis administrativos diferentes continuam previstos, porém usuários, permissões e responsabilidades ainda serão definidos.

## 6. Cabo Aéreo

O PAC VII não possuía um fluxo próprio para Cabo Aéreo.

A linha de base acrescenta:

- página pública específica;
- formulário estruturado;
- envio de fotos, mapa ou outras evidências quando aplicável;
- consentimento explícito para tratamento de dados;
- registro interno da solicitação;
- visualização da ficha dentro do painel;
- geração de PDF a partir da ficha;
- armazenamento do PDF junto ao atendimento;
- botão para envio do PDF ao e-mail da empresa;
- continuidade por WhatsApp, e-mail ou telefone;
- análise humana pela Bamak.

O nome definitivo da ficha e do PDF ainda será definido.

O portal não entregará relatório técnico privado ao cliente.

## 7. Contato geral e Atendimentos

O contato geral permanece como formulário simples.

Fluxo previsto:

1. visitante envia nome, contato, assunto e mensagem;
2. sistema registra a solicitação;
3. equipe consulta o conteúdo no painel;
4. atendimento continua por canal humano.

A área de Atendimentos deve reunir:

- contatos gerais;
- solicitações de Cabo Aéreo;
- diferenciação entre os tipos de entrada;
- ficha interna do Cabo Aéreo;
- evidências anexadas;
- PDF gerado;
- status básicos.

A área não deve incluir:

- funil de vendas;
- lead scoring;
- carteira comercial;
- automação de negociação;
- CRM;
- acompanhamento completo do processo comercial.

## 8. Catálogo

O catálogo continua consultivo.

Permanecem fora do escopo:

- carrinho;
- checkout;
- pagamento online;
- cálculo de frete;
- orçamento automático;
- disponibilidade em tempo real;
- preço obrigatório.

Categorias, filtros, aplicações relacionadas e chamadas para contato serão refinados durante o Pré-PAC VIII.

## 9. Comunicação

Notícias e Agenda passam a formar a área `Comunicação`.

Essa área poderá reunir:

- notícias;
- agenda;
- eventos;
- feiras;
- comunicados institucionais.

A gestão será limitada a conteúdos previstos na solução.

Ainda precisam ser definidos:

- responsáveis;
- frequência de atualização;
- fluxo de aprovação;
- tipos de conteúdo usados na primeira versão.

## 10. Primeira versão

A primeira versão deve contemplar:

- Home;
- Institucional;
- Aplicações;
- Catálogo;
- Cabo Aéreo;
- FAQ;
- Comunicação;
- Contato;
- formulário geral;
- fluxo estruturado de Cabo Aéreo;
- ficha interna;
- geração de PDF;
- armazenamento do PDF no painel;
- envio do PDF por e-mail;
- Painel;
- Atendimentos;
- Comunicação administrativa;
- Configurações;
- perfis administrativos;
- catálogo consultivo;
- continuidade do atendimento por canais humanos.

## 11. Definições pendentes para o Pré-PAC VIII

Ainda precisam ser definidos:

- campos definitivos do Cabo Aéreo;
- nome definitivo da ficha e do PDF;
- estados dos atendimentos;
- permissões dos perfis administrativos;
- responsáveis internos;
- categorias e filtros do catálogo;
- regras de publicação em Comunicação;
- comportamentos de interface;
- critérios de validação.

Essas definições devem ser registradas nos próximos artefatos e submetidas à validação da Bamak.

## 12. Itens fora da primeira versão

Permanecem fora de escopo:

- e-commerce;
- carrinho;
- checkout;
- pagamento online;
- cálculo de frete;
- orçamento automático;
- CRM;
- ERP;
- área privada do cliente;
- CMS estrutural completo;
- chatbot;
- automação comercial;
- relatório técnico privado para o cliente;
- cálculo técnico automático.

## 13. Efeito sobre o PAC VIII

O PAC VIII deve implementar a linha de base refinada.

A execução deverá considerar:

- frontend, backend e banco próprios;
- painel administrativo reduzido;
- fluxo de Cabo Aéreo;
- formulário geral;
- catálogo consultivo;
- geração e armazenamento de PDF;
- envio do PDF por e-mail;
- autenticação e perfis;
- testes;
- QA por pares;
- validação com a Bamak;
- deploy público;
- release final.

## 14. Síntese

O PAC VII definiu a concepção do Portal Bamak.

A linha de base para o PAC VIII mantém a proposta institucional-comercial e refina o produto para:

- estruturar a primeira presença digital organizada da empresa;
- reduzir a navegação pública;
- criar a área de Aplicações;
- introduzir o fluxo próprio de Cabo Aéreo;
- simplificar o painel administrativo;
- separar contato geral de solicitação técnica;
- manter o atendimento posterior sob responsabilidade da Bamak.
