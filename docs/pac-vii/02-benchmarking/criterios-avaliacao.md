# Critérios de avaliação

Critérios usados para comparar o site atual da Bamak, referências web do setor e a proposta do portal institucional-comercial.

A função destes critérios é prática: transformar o diagnóstico em decisões de escopo, navegação e arquitetura da informação. Cada critério abaixo aponta o que foi observado e qual decisão ele gerou no projeto.

## 1. Critérios consolidados

| Critério | O que verifica | Sinal de problema no site atual | Decisão tomada na proposta |
|---|---|---|---|
| **Apresentação institucional clara** | Se o visitante entende quem é a Bamak, o que ela fornece e para qual contexto atua. | A apresentação institucional não conduz bem a leitura sobre atuação, segmentos e valor comercial da empresa. | Criar a página **A Bamak** como área própria de apresentação institucional. |
| **Organização de segmentos e soluções** | Se a oferta aparece por contexto de uso, aplicação ou frente de atuação. | O visitante não encontra uma separação clara entre onde a empresa atua e quais soluções oferece. | Separar **Segmentos** e **Soluções** como páginas distintas. |
| **Navegação orientada ao usuário** | Se as páginas formam um percurso compreensível até o contato. | As informações existem de forma pouco encadeada; o visitante precisa montar o caminho sozinho. | Estruturar o fluxo **Descoberta → Entendimento → Oferta → Orientação → Contato**. |
| **Contato comercial visível** | Se o visitante encontra canais de contato sem esforço e no momento certo da navegação. | O contato aparece pouco contextualizado em relação à leitura da empresa e da oferta. | Criar página **Contato** e chamadas a partir de catálogo, FAQ, segmentos e soluções. |
| **Orientação sobre orçamento e pedidos** | Se o site antecipa dúvidas antes do contato comercial. | O visitante tende a chamar a empresa para perguntar informações básicas. | Criar **FAQ** voltada a orçamento, pedidos, atendimento e próximos passos. |
| **Catálogo de produtos integrado** | Se o catálogo ajuda a consultar produtos dentro do contexto comercial da Bamak. | Produto aparece como informação isolada, sem ligação suficiente com segmento, solução e contato. | Tratar o **Catálogo** como área consultiva conectada ao contato. |
| **Atualização por painel administrativo** | Se conteúdos recorrentes podem ser atualizados pela empresa. | Notícias, agenda, FAQ, catálogo e textos institucionais dependeriam de manutenção técnica. | Prever **módulo administrativo autenticado** para gestão editorial/comercial. |
| **Adequação ao contexto B2B** | Se o site apoia avaliação antes da conversa comercial, em vez de compra imediata. | A presença digital não conduz suficientemente a decisão inicial do visitante B2B. | Manter foco em consulta, orientação e contato, sem e-commerce. |
| **Fluxo entre descoberta, entendimento e contato** | Se a navegação aproxima o visitante do contato com mais contexto. | O caminho entre conhecer a empresa, entender oferta e iniciar contato é fraco. | Usar o fluxo descoberta-contato como eixo da arquitetura da informação. |
| **Aderência ao recorte agroindustrial** | Se o portal reflete a atuação real da Bamak e evita texto institucional genérico. | O conteúdo atual não explora suficientemente o recorte de atuação ligado à agroindústria. | Levar o recorte agroindustrial para segmentos, soluções, catálogo e textos institucionais. |

## 2. Como os critérios foram usados

Os critérios não foram usados como checklist decorativo. Cada um deles afetou uma decisão concreta:

```txt
diagnóstico do site atual
→ critério de avaliação
→ lacuna identificada
→ decisão de escopo
→ página, fluxo ou artefato correspondente
```

Exemplo aplicado:

```txt
lacuna: visitante não entende bem o percurso até o contato
critério: fluxo entre descoberta, entendimento e contato
decisão: estruturar o portal por etapas de navegação
artefato: fluxo-descoberta-contato.md
```

Outro exemplo:

```txt
lacuna: dúvidas básicas sobre orçamento e pedido não são orientadas antes do contato
critério: orientação sobre orçamento e pedidos
decisão: incluir FAQ como etapa anterior ao formulário
artefato: wireframe da FAQ + requisito RF-PUB-07
```

## 3. Critérios que mais influenciaram o escopo

### 3.1 Fluxo entre descoberta, entendimento e contato

Esse critério definiu a lógica central da área pública.

A proposta não organiza páginas apenas por tipo de conteúdo. Ela organiza uma sequência de leitura:

```txt
Home
→ A Bamak
→ Segmentos / Soluções
→ Catálogo
→ FAQ
→ Contato
```

Essa sequência responde ao comportamento esperado de um visitante B2B: primeiro entender a empresa, depois avaliar a oferta e só então iniciar contato.

### 3.2 Catálogo de produtos integrado

O catálogo foi mantido como área de consulta, não como loja.

Essa decisão evita deslocar o projeto para e-commerce. O catálogo deve ajudar o visitante a identificar produtos e aplicações, mas a negociação continua nos canais comerciais da Bamak.

### 3.3 Atualização por painel administrativo

O painel administrativo foi incluído porque o portal precisa ser mantido pela empresa.

Sem esse módulo, notícias, agenda, FAQ, catálogo e textos institucionais continuariam dependentes de alteração direta no código. O painel, porém, fica limitado à gestão editorial/comercial. Ele não vira CRM, ERP ou área de cliente.

## 4. Critérios excluídos da avaliação

Alguns critérios comuns em projetos web foram deixados fora da matriz porque não respondiam ao estado atual do PAC VII.

| Critério excluído | Motivo |
|---|---|
| Conversão de vendas | Depende de sistema em uso real e dados comerciais. |
| Performance técnica | Não há implementação funcional nesta etapa. |
| SEO técnico | Relevante para implementação, mas fora da proposta do PAC VII. |
| Métricas de tráfego | Dependem de publicação e monitoramento. |
| Checkout e pagamento | Não pertencem ao escopo do portal. |

## 5. Resultado da aplicação dos critérios

A aplicação dos critérios levou a uma proposta com este recorte:

- páginas públicas com função definida;
- catálogo consultivo;
- FAQ antes do contato;
- contato como etapa do fluxo, não elemento isolado;
- notícias e agenda como sinais de atualização institucional;
- módulo administrativo para manutenção de conteúdo;
- arquitetura Web Apps para sustentar frontend, backend, banco e e-mail.

O ganho esperado não está em adicionar muitas páginas. O ganho está em conectar páginas que respondem a uma necessidade específica: orientar o visitante B2B antes do contato comercial com a Bamak.
