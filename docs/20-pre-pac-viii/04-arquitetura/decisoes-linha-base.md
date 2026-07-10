# Decisões da linha de base

## 1. Catálogo consultivo

**Decisão**

O Catálogo apresenta produtos para consulta e encaminha o visitante ao contato.

**Aplicação no produto**

- listagem;
- busca;
- filtros;
- detalhe de produto;
- relação com Aplicações;
- CTA para Contato.

**Exclusões**

- carrinho;
- checkout;
- pagamento;
- cálculo de frete;
- preço obrigatório;
- disponibilidade em tempo real;
- orçamento automático.

**Motivo**

A Bamak conduz preço, disponibilidade e negociação por atendimento humano. Transformar o Catálogo em loja exigiria regras comerciais que não fazem parte do problema atual.

## 2. Aplicações substituem Segmentos e Soluções na navegação principal

**Decisão**

A área pública usa `Aplicações` como ponto de entrada para contextos de uso.

**Aplicação no produto**

- listagem de aplicações;
- páginas de detalhe;
- associação com produtos;
- CTA para Catálogo, Cabo Aéreo ou Contato.

**Motivo**

A divisão anterior entre Segmentos e Soluções criava duas leituras próximas. `Aplicações` aproxima o conteúdo da forma como o visitante identifica a própria necessidade.

## 3. Comunicação reúne Notícias e Agenda

**Decisão**

Notícias, agenda, eventos, feiras e comunicados ficam na área `Comunicação`.

**Aplicação no produto**

- um módulo administrativo;
- tipos de conteúdo distintos;
- rascunho;
- publicação;
- ocultação;
- listagem pública;
- detalhe.

**Motivo**

A Bamak publica pouco e não possui equipe digital dedicada. Dois módulos separados aumentariam a manutenção sem ganho operacional.

## 4. Comunicação é o único conteúdo público administrável na primeira versão

**Decisão**

O painel permite administrar Comunicação. Institucional, Aplicações, Catálogo, FAQ e Cabo Aéreo permanecem mantidos tecnicamente.

**Motivo**

A empresa não possui rotina nem equipe para editar toda a estrutura do portal. Um CMS amplo criaria complexidade de uso, permissões e validação de conteúdo.

**Consequência**

Alterações estruturais exigirão intervenção técnica na primeira versão.

## 5. Atendimentos é uma fila operacional

**Decisão**

A área `Atendimentos` reúne:

- contato geral;
- solicitação de Cabo Aéreo;
- ficha interna;
- anexos;
- PDF;
- estado do atendimento.

**Exclusões**

- funil de vendas;
- lead scoring;
- carteira comercial;
- automação de follow-up;
- histórico completo de negociação;
- gestão de propostas;
- CRM.

**Motivo**

O portal deve organizar a entrada. A negociação continua por WhatsApp, telefone ou e-mail.

## 6. Painel administrativo mínimo

**Decisão**

A navegação administrativa possui:

1. Painel
2. Atendimentos
3. Comunicação
4. Configurações

**Função de cada área**

- **Painel:** resumo de entradas, estados e alertas.
- **Atendimentos:** consulta e tratamento das solicitações.
- **Comunicação:** publicação de conteúdo controlado.
- **Configurações:** usuários, acessos e integrações essenciais.

**Exclusões**

- edição estrutural de páginas;
- CRM;
- ERP;
- gestão financeira;
- estoque;
- automação comercial.

## 7. Perfis Administrador e Operador

**Decisão**

A primeira versão terá dois perfis.

### Administrador

Pode:

- acessar todas as áreas;
- gerenciar usuários;
- alterar configurações;
- publicar Comunicação;
- tratar atendimentos;
- gerar e enviar PDFs.

### Operador

Pode:

- acessar Painel;
- acessar Atendimentos;
- consultar anexos;
- consultar ficha;
- gerar e enviar PDF;
- alterar estados permitidos.

**Pendência**

As permissões finais do Operador serão validadas com a Bamak.

## 8. Contato geral simples

**Decisão**

O formulário geral coleta:

- nome;
- contato;
- assunto;
- mensagem;
- consentimento.

**Resultado**

A entrada aparece em Atendimentos e segue por canal humano.

**Exclusões**

- anexos;
- mapa;
- ficha estruturada;
- PDF;
- automação de resposta.

## 9. Cabo Aéreo com fluxo próprio

**Decisão**

O Cabo Aéreo possui formulário específico.

**Elementos**

- dados de contato;
- descrição;
- localização textual;
- mapa opcional;
- até cinco imagens;
- consentimento;
- ficha interna;
- PDF;
- envio do PDF ao e-mail da empresa.

**Motivo**

A demanda exige contexto e evidências que o contato geral não coleta.

## 10. Mapa opcional e sem cálculo técnico

**Decisão**

O formulário usa Leaflet e OpenStreetMap para marcação opcional.

**Alternativa**

O visitante pode descrever o local em texto.

**Exclusões**

- cálculo de rota;
- cálculo de distância;
- análise de desnível;
- leitura automática do terreno;
- conclusão de viabilidade.

**Motivo**

O mapa serve para contextualização. A análise continua humana.

## 11. Ficha e PDF internos

**Decisão**

A solicitação de Cabo Aéreo gera uma ficha visível no painel.

A equipe pode:

- consultar a ficha;
- gerar PDF;
- armazenar o PDF;
- enviar o PDF ao e-mail da empresa.

**Limite**

O cliente não recebe esse documento pelo portal.

**Pendência**

O nome definitivo da ficha e do PDF ainda será definido.

## 12. Storage privado compatível com S3

**Decisão**

Imagens e PDFs ficam fora do banco e são armazenados em serviço compatível com S3.

**Regras**

- acesso autenticado;
- URLs temporárias;
- associação ao atendimento;
- validação de tipo e tamanho;
- ausência de links públicos permanentes.

**Motivo**

O repositório e a aplicação pública não podem expor fotos, localizações ou documentos de clientes.

## 13. Atendimento humano preservado

**Decisão**

O portal encerra sua função após organizar e registrar a entrada.

A continuidade ocorre por:

- WhatsApp;
- telefone;
- e-mail;
- visita, quando necessária.

**Exclusões**

- chatbot;
- resposta automática de negócio;
- negociação dentro do portal;
- área privada do cliente;
- acompanhamento comercial completo.

## 14. Três fluxos de negócio

Os três fluxos obrigatórios da linha Web Apps são:

1. descoberta e contato geral;
2. solicitação de Cabo Aéreo;
3. publicação de Comunicação.

O tratamento administrativo do atendimento é fluxo de apoio e será testado junto ao Cabo Aéreo e ao contato geral.

## 15. Stack e operação

**Stack confirmada**

- Next.js;
- NestJS;
- PostgreSQL;
- Prisma;
- JWT;
- Docker;
- Leaflet;
- OpenStreetMap;
- storage compatível com S3;
- GitHub Actions;
- SonarCloud;
- Sentry;
- healthcheck;
- logs estruturados.

**Decisões ainda abertas**

- provedor de deploy;
- provedor de storage;
- serviço de e-mail;
- biblioteca de PDF.
