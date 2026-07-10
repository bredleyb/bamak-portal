# Fora de escopo

Este documento registra as funcionalidades e expectativas que não pertencem ao escopo atual do **Portal Web Institucional-Comercial para a Bamak**.

A delimitação existe para manter o projeto alinhado ao problema diagnosticado: organizar a apresentação institucional-comercial da Bamak e preparar melhor o visitante B2B antes do contato.

## 1. Limite central

O portal organiza informação e prepara contato comercial.

Ele não executa venda, não automatiza negociação e não gerencia relacionamento comercial completo.

```txt
Incluído: entender a empresa → consultar oferta → tirar dúvidas → iniciar contato
Excluído: comprar → pagar → acompanhar pedido → gerir cliente → automatizar venda
```

## 2. Funcionalidades excluídas

| Item fora de escopo | Motivo específico |
|---|---|
| E-commerce | O problema atual não é vender online; é orientar o visitante antes do contato. |
| Carrinho de compras | O catálogo foi definido como consulta, não como seleção de itens para compra. |
| Checkout | Não há fluxo de finalização de pedido no recorte do projeto. |
| Pagamento online | Condições comerciais e fechamento permanecem nos canais da empresa. |
| Orçamento automatizado | Preço, disponibilidade e condição de fornecimento dependem de análise comercial. |
| CRM | Controle de leads, pipeline e histórico comercial ampliaria o projeto para gestão de vendas. |
| Área de cliente | Login de cliente, pedidos, documentos e histórico não fazem parte da demanda atual. |
| ERP | Estoque, financeiro, compras, faturamento e operação interna são outro tipo de sistema. |
| Automação de negociação | O portal apoia a conversa comercial, mas não substitui atendimento humano. |
| Métricas de impacto comercial | Conversão, aumento de vendas e ROI dependem de implantação e tempo de uso real. |

## 3. Catálogo consultivo, não loja

O catálogo entra no projeto porque o visitante precisa consultar produtos antes do contato.

O catálogo não inclui:

- botão de comprar;
- carrinho;
- preço dinâmico;
- cálculo de frete;
- fechamento de pedido;
- pagamento;
- acompanhamento de entrega.

O comportamento esperado é outro:

```txt
Visitante consulta produto → entende aplicação → usa FAQ se necessário → chama a Bamak
```

## 4. FAQ como orientação, não atendimento

A FAQ foi prevista para dúvidas recorrentes antes do orçamento.

Ela pode cobrir temas como:

- como solicitar contato;
- que informações enviar;
- como tratar pedidos ou orçamento;
- quais canais usar;
- o que depende de conversa comercial.

A FAQ não deve tentar responder casos específicos de negociação, aplicação técnica detalhada ou definição de preço.

## 5. Módulo administrativo editorial, não CRM

O painel administrativo existe para manutenção de conteúdo do portal.

Incluído:

- notícias;
- agenda;
- FAQ;
- catálogo;
- segmentos;
- soluções;
- conteúdos institucionais;
- mensagens recebidas pelo formulário.

Excluído:

- funil de vendas;
- cadastro completo de clientes;
- histórico de negociação;
- tarefas comerciais;
- automações de follow-up;
- emissão de proposta;
- integração financeira;
- gestão operacional.

A fronteira é simples: o painel mantém conteúdo público e registra mensagens. Ele não gerencia o processo comercial da empresa.

## 6. Implementação fora do PAC VII

O PAC VII documenta e prototipa. Não entrega aplicação funcional.

Ficam para continuidade:

| Item | Motivo |
|---|---|
| Código frontend | Depende de refinamento visual e priorização do PAC 8. |
| Código backend | Depende de schema, rotas e regras detalhadas. |
| Banco de dados real | Depende da implementação. |
| Autenticação funcional | Pertence ao módulo administrativo do PAC 8. |
| Integração de e-mail | Depende de ambiente e credenciais. |
| Deploy | Só faz sentido após versão funcional mínima. |
| Testes automatizados | Dependem de código implementado. |

## 7. Riscos de incluir o que está fora

| Inclusão indevida | Efeito no projeto |
|---|---|
| Transformar catálogo em loja | Desvia o projeto para e-commerce. |
| Transformar painel em CRM | Aumenta escopo e complexidade sem responder ao diagnóstico. |
| Automatizar orçamento | Exige regras comerciais não levantadas. |
| Criar área de cliente | Altera público, autenticação e domínio do sistema. |
| Prometer impacto comercial | Cria resultado que não pode ser comprovado no estado atual. |

## 8. Condição para mudar o escopo

Qualquer item excluído só deve entrar no projeto se houver:

- nova demanda formal da empresa;
- revisão do problema central;
- tempo de implementação compatível;
- conteúdo e regra de negócio validados;
- impacto claro no objetivo do portal.

Sem isso, o escopo deve permanecer concentrado na presença institucional-comercial e no pré-contato B2B.
