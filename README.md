# Portal Bamak

Este repositório reúne o **Portal Bamak**, projeto de **Trabalho de Conclusão de Curso (TCC)** de Engenharia de Software da **Católica de Santa Catarina**, desenvolvido na disciplina de **Portfólio**, em articulação com o **Projeto de Aprendizagem Colaborativa Extensionista (PAC)**, na linha **Web Apps**. Realizado em parceria com a **Bamak Equipamentos LTDA**, de Schroeder (SC), o trabalho consiste no desenvolvimento de um portal web institucional-comercial destinado a se tornar o site oficial da empresa após a conclusão do ciclo acadêmico, a validação da solução e a preparação para sua operação.

A solução pretende organizar a apresentação da empresa, suas aplicações e produtos, os conteúdos de Comunicação e a entrada de solicitações comerciais. O atendimento técnico e comercial permanece sob responsabilidade da equipe da Bamak.

> **Situação verificada no GitHub (31/10/2026):** PAC VII concluído e PAC VIII em execução. O design hi-fi está consolidado no Figma. A autenticação e a gestão de acessos da Issue #96 foram integradas à `main` pela [PR #119](https://github.com/bredleyb/bamak-portal/pull/119), no commit `bd44bfe6`. A [CI desse commit](https://github.com/bredleyb/bamak-portal/actions/runs/41169874724) aprovou cinco jobs; o [workflow de deploy subsequente](https://github.com/bredleyb/bamak-portal/actions/runs/41170068752) foi ignorado (`skipped`). Há evidência de publicação técnica anterior na VPS, sem confirmação de que o incremento #96 esteja em produção. Os três fluxos de negócio, a release final e o aceite institucional permanecem pendentes. **O ambiente publicado ainda não representa o lançamento oficial da Bamak.**

**Documentação principal:** [RFC v2](docs/pac-viii/02-escopo/rfc-v2-pac-viii.md) · [Requisitos e fluxos](docs/pac-viii/03-requisitos/requisitos-user-stories-fluxos-metricas.md) · [Arquitetura](docs/pac-viii/04-arquitetura/arquitetura-web-apps.md) · [Issues](https://github.com/bredleyb/bamak-portal/issues)

## Contexto e objetivo

A Bamak atende principalmente por indicações, relacionamento direto, WhatsApp, telefone, e-mail e visitas presenciais. Seu site atual oferece pouca orientação para visitantes que desejam compreender a empresa e iniciar contato com informações suficientes.

O Portal Bamak busca estruturar essa presença digital para o contexto B2B, com catálogo consultivo, aplicações, conteúdo institucional e formulários que organizem a entrada das demandas. A empresa não dispõe de equipe dedicada à operação digital; por isso, o painel administrativo foi delimitado às atividades essenciais.

O projeto possui **duas fases acadêmicas**:

| Fase | Abrangência | Situação |
|---|---|---|
| **PAC VII** | Diagnóstico, benchmarking, proposta, requisitos iniciais, arquitetura, wireframes de baixa fidelidade e entregáveis acadêmicos. | Concluída e preservada como histórico. |
| **PAC VIII** | Alinhamento, especificação refinada, design, protótipos, implementação, testes, QA por pares, validação com a Bamak, publicação e entrega. | Em execução. |

**Articulação entre PAC, Portfólio e TCC:** o Portal Bamak constitui o projeto de Portfólio desenvolvido como TCC de Engenharia de Software. O **PAC Extensionista VII** concentrou a concepção e o planejamento da proposta. Na etapa de conclusão, **Portfólio** conduz o desenvolvimento técnico do software, enquanto o **PAC Extensionista VIII** acompanha a garantia de qualidade, a revisão por pares, os testes cruzados e a validação extensionista junto à Bamak. As disciplinas possuem responsabilidades complementares sobre o mesmo projeto.

## Escopo do produto

A primeira versão está especificada com:

- **Área pública (8):** Home, Institucional, Aplicações, Catálogo, Cabo Aéreo, FAQ, Comunicação e Contato.
- **Área administrativa (4):** Painel, Atendimentos, Comunicação e Configurações essenciais.

O painel prevê os perfis **Administrador** e **Operador**, com permissões adequadas às funções. Institucional, Aplicações, Catálogo, FAQ e Cabo Aéreo terão manutenção técnica na primeira versão; **Comunicação** será o conteúdo público editável pelo painel.

### Três fluxos de negócio obrigatórios

1. **FL-01 — Contato geral:** o visitante consulta o portal, preenche dados de contato, assunto e mensagem e registra o consentimento explícito. O sistema valida, persiste a solicitação e confirma o recebimento; a equipe autorizada consulta o registro em Atendimentos e prossegue pelos canais habituais.
2. **FL-02 — Cabo Aéreo:** o visitante informa a necessidade, descreve a localização, inclui imagens quando pertinente e pode marcar o local em um mapa opcional. Após consentimento explícito, o sistema valida os dados, registra a solicitação e confirma o recebimento. A ficha estruturada fica disponível no painel. Um usuário autorizado pode gerar o **PDF interno**, armazená-lo vinculado ao atendimento e enviá-lo ao e-mail da empresa. O sistema registra o responsável, a data e o resultado do envio. **O envio desse PDF ao visitante está fora do escopo da primeira versão.**
3. **FL-03 — Comunicação:** um usuário autorizado cria ou edita conteúdos, salva rascunhos, publica e controla a visibilidade; a área pública apresenta apenas os conteúdos publicados.

No Cabo Aéreo, a localização textual é suficiente; o mapa Leaflet/OpenStreetMap é opcional. A especificação inicial aceita até **cinco imagens JPG, PNG ou WebP, com até 10 MB por arquivo**. Anexos e PDFs deverão permanecer privados e acessíveis somente mediante autorização.

**Fora do escopo da primeira versão:** e-commerce, checkout, pagamentos, orçamento ou viabilidade técnica automáticos, CRM, ERP, CMS estrutural completo, chatbot, área privada do cliente e automação comercial avançada. A lista e os critérios completos constam na [RFC v2](docs/pac-viii/02-escopo/rfc-v2-pac-viii.md).

## Estado da implementação

| Frente | Estado e evidências |
|---|---|
| Frontend Next.js | Fundamentos visuais, componentes compartilhados, login e interfaces administrativas de usuários/acessos da Issue #96 integrados à `main` pela PR #119. |
| API NestJS | Autenticação por sessões opacas, RBAC, troca de senha, criação e gestão de usuários integradas à `main`. O incremento inclui proteção transacional da criação e auditoria da concessão inicial de acesso. |
| PostgreSQL e Prisma | Modelo de domínio e nove migrações versionadas na `main`, incluindo o evento `CREATED`; a execução das nove migrações foi registrada em PostgreSQL 17 descartável. A aplicação das migrações da Issue #96 na VPS ainda não foi comprovada. |
| Testes locais (histórico da #96) | Em 31/10/2026, antes do merge: 44/44 testes unitários/HTTP selecionados e 20/20 testes de integração em PostgreSQL descartável aprovados; essas evidências permanecem históricas. |
| CI e análise estática | [CI #41169874724](https://github.com/bredleyb/bamak-portal/actions/runs/41169874724) do commit `bd44bfe6`: cinco jobs aprovados, incluindo SonarQube API e Web; API com 205 testes gerais aprovados e 97,20% de cobertura de linhas, Web com 274 testes e 89,32% de cobertura de linhas. Suítes PostgreSQL específicas: 20 testes de acessos e 4 de senhas aprovados. |
| Infraestrutura | Publicação técnica anterior na VPS, com HTTPS e healthcheck. Deploy da Issue #96 sujeito a revisão operacional, backup e autorização por SHA. |
| Fluxos de negócio | Contato geral, Cabo Aéreo e Comunicação permanecem dependentes das respectivas Issues funcionais. |
| Validação e aceite | Testes automatizados de acessos aprovados nas execuções documentadas. Revisões por colegas e testes cruzados acadêmicos seguem como exigências pendentes de evidência, acompanhadas na Issue #105. Também permanecem pendentes a validação extensionista e o aceite institucional. |

As evidências devem ser interpretadas conforme o commit e o ambiente de execução. A [PR #119](https://github.com/bredleyb/bamak-portal/pull/119) foi integrada à `main` e reúne o incremento de autenticação e controle administrativo. A reorganização histórica foi integrada pela [PR #79](https://github.com/bredleyb/bamak-portal/pull/79).
### Fundamentos visuais implementados

A [Issue #89](https://github.com/bredleyb/bamak-portal/issues/89) registrou a implementação inicial das interfaces do Figma na branch `feat/fundamentos-visuais`, preservada como etapa histórica do desenvolvimento.

Foram implementados os tokens visuais e a tipografia institucional (Archivo e Source Sans 3), além dos componentes Button, Field, Select, Checkbox, Notification, Badge e ContentCard. O SiteHeader e o SiteFooter utilizam ativos da identidade visual da Bamak e estão integrados ao RootLayout, com navegação compartilhada e estrutura responsiva.

Na etapa histórica da Issue #89, a validação local registrou **110 testes aprovados em 11 suítes**, com **100% de cobertura de linhas e 98% de ramificações** no código Web então incluído na medição. ESLint, verificação TypeScript e build de produção foram aprovados naquela etapa. A medição posterior da `main` está indicada em **Qualidade, integração e publicação**. Os resultados históricos constam em [Testes automatizados e cobertura](docs/pac-viii/04-arquitetura/testes-e-cobertura.md).

A inspeção visual exploratória abrangeu larguras de 320, 390, 768, 1024, 1199, 1200 e 1440 px, além de uma observação inicial em 3440 px. Foi corrigida a quebra do contato institucional no rodapé em telas de até 359 px.

**Limites da etapa #89:** as evidências visuais dessa seção descrevem o incremento inicial. A implementação administrativa evoluiu posteriormente na Issue #96. Os fluxos FL-01, FL-02 e FL-03 e a validação institucional continuam sujeitos a evidências próprias.

## Tecnologias e arquitetura

| Camada | Base adotada |
|---|---|
| Aplicação web | Next.js 16, React, TypeScript e Tailwind CSS 4. |
| API | NestJS 12 e TypeScript. |
| Persistência | PostgreSQL 17 e Prisma 7. |
| Execução e infraestrutura | Docker Compose, Caddy e GitHub Actions. |

**Integração técnica existente:** Next.js → API NestJS → Prisma/PostgreSQL. A autenticação administrativa utiliza sessões com tokens opacos aleatórios, hash persistido no banco, cookie HttpOnly e verificação de perfil no backend. Storage privado, e-mail e PDF interno permanecem dependentes das Issues funcionais.

A [documentação de arquitetura](docs/pac-viii/04-arquitetura/arquitetura-web-apps.md) descreve módulos, responsabilidades, fluxos, entidades e requisitos de segurança. O [registro de decisões de produto](docs/pac-viii/04-arquitetura/decisoes-de-produto.md) delimita o painel e os recursos da primeira versão.

## Executar localmente

O procedimento abaixo inicia a **base técnica integrada**, com frontend, API, PostgreSQL e proxy. Ele serve para verificar comunicação e saúde da aplicação; as funcionalidades finais do portal ainda estão em desenvolvimento.

**Pré-requisitos:** Git, Docker Desktop com Docker Compose e PowerShell (Windows). O Docker deve estar em execução.

Na pasta em que deseja clonar o repositório:

```powershell
git clone https://github.com/bredleyb/bamak-portal.git
Set-Location bamak-portal
Copy-Item .env.example .env
docker compose --env-file .env -f compose.integrated.yaml up -d --build
```

Após a inicialização, acesse:

- **Aplicação local:** <http://localhost:8080>
- **Healthcheck da API:** <http://localhost:8080/api/health>

O healthcheck deve retornar os campos `status` e `database` com valor `ok` quando a API conseguir consultar o banco. Verifique pelo navegador ou por PowerShell:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

Os comandos correspondem à configuração versionada; a execução deve ser confirmada no ambiente do desenvolvedor.

Para consultar os contêineres ou encerrar a execução:

```powershell
docker compose --env-file .env -f compose.integrated.yaml ps
docker compose --env-file .env -f compose.integrated.yaml down
```

O arquivo `.env.example` contém **credenciais exclusivamente locais e ilustrativas**; seus valores não devem ser reutilizados em produção. O arquivo `.env` não deve ser versionado. Para desenvolvimento com serviços separados, também existem `compose.yaml` (banco de dados) e os scripts nos `package.json` de `apps/web/` e `apps/api/`.

## Qualidade, integração e publicação

A CI em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) executa cinco jobs em Pull Requests para a `main` e em pushes na `main`: `API`, `Web`, `Scripts de deploy`, `SonarQube API` e `SonarQube Web`. As verificações incluem instalação reproduzível de dependências, auditoria das dependências de produção, lint, build, validação Prisma, testes dos scripts de deploy e análise estática no SonarQube Cloud.

A `main` exige Pull Request, atualização da branch e checks obrigatórios de API, Web e Scripts de deploy. O desenvolvimento é individual. **Revisão por pares e testes cruzados por colegas continuam obrigatórios no PAC VIII**; a [Issue #105](https://github.com/bredleyb/bamak-portal/issues/105) acompanha sua organização e a obtenção de evidências reais. Nenhuma dispensa institucional foi comprovada. Defeitos reproduzíveis devem ser registrados como Issues.

A linha Web Apps exige TDD e cobertura mínima de 75% no backend e 25% no frontend, além de análise estática independente do lint. Na [CI #41169874724](https://github.com/bredleyb/bamak-portal/actions/runs/41169874724), do commit integrado `bd44bfe6`, os cinco jobs passaram: API com 205 testes gerais aprovados, 24 ignorados e 97,20% de cobertura de linhas; Web com 274 testes aprovados e 89,32% de cobertura de linhas. As suítes PostgreSQL separadas passaram com 20 testes de acessos e 4 testes de senhas. Esses números são específicos desse commit, da configuração de cobertura e do ambiente de CI; a comprovação final exige nova execução após os fluxos completos.

O arquivo [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) exige `PRODUCTION_DEPLOY_ENABLED=true` e `PRODUCTION_DEPLOY_APPROVED_SHA` correspondente ao SHA autorizado, além da CI aprovada. A primeira publicação técnica foi registrada na [execução 39181397560](https://github.com/bredleyb/bamak-portal/actions/runs/39181397560), no domínio provisório [bamak.bbauer.systems](https://bamak.bbauer.systems). Publicações com migrações devem seguir o procedimento de backup, preparação e verificação operacional documentado no PAC VIII. O lançamento oficial depende das funcionalidades finais e do aceite da Bamak.

## Organização do repositório

```text
bamak-portal/
├── .github/workflows/        # CI e publicação automatizada
├── apps/api/                 # API NestJS e Prisma
├── apps/web/                 # Interface Next.js
├── assets/brand/             # Acervo da identidade visual
├── docs/pac-vii/               # Histórico da concepção
├── docs/pac-viii/              # Documentação vigente
├── final/pac-vii/              # Entregáveis acadêmicos concluídos
├── infra/                    # Configurações do proxy e produção
├── compose*.yaml             # Ambientes Docker
└── README.md
```

O diretório `final/pac-viii/` será criado quando houver arquivos reais para versionar. As atividades de implementação, testes, validação e entrega serão documentadas no PAC VIII à medida que forem realizadas.

### Documentos de referência

| Documento | Finalidade |
|---|---|
| [RFC v2 — PAC VIII](docs/pac-viii/02-escopo/rfc-v2-pac-viii.md) | Escopo funcional e decisões vigentes. |
| [Requisitos, histórias de usuário, fluxos e métricas](docs/pac-viii/03-requisitos/requisitos-user-stories-fluxos-metricas.md) | Comportamentos, evidências e critérios de aceite. |
| [Arquitetura Web Apps](docs/pac-viii/04-arquitetura/arquitetura-web-apps.md) | Estrutura técnica, módulos e fluxos. |
| [Decisões de produto](docs/pac-viii/04-arquitetura/decisoes-de-produto.md) | Limites operacionais e funcionais. |
| [Histórico e governança](docs/pac-viii/00-planejamento/historico-e-governanca.md) | Evolução das duas fases e rastreabilidade das mudanças. |
| [Alinhamento com a Bamak](docs/pac-viii/01-alinhamento/registro-bamak.md) | Contexto e decisões registradas com a empresa. |
| [Direção visual](docs/pac-viii/05-design/direcao-visual-interfaces.md) | Estudos e orientações de interface sujeitos a validação. |
| [Handoff visual — Figma definitivo](docs/pac-viii/05-design/style-tile-v3-consolidacao.md) | Sete páginas, Design System, 14 áreas públicas, 12 administrativas, fluxos, responsividade e decisões de implementação; aprovação da Bamak pendente. |
| [Acervo da marca](assets/brand/README.md) | Variantes do logotipo, organização dos arquivos e orientações de uso. |
| [Mapa de artefatos do PAC VII](docs/pac-vii/00-visao-geral/mapa-artefatos.md) | Índice histórico da fase de concepção. |

Os documentos do PAC VII são preservados como registros daquela fase. Alterações posteriores de escopo e tecnologia devem permanecer rastreáveis na documentação do PAC VIII, nas Issues e nos Pull Requests.

## Próximas entregas

- Submeter conteúdo, fotografias, decisões de interface e protótipos de referência à validação da Bamak, registrando eventuais ajustes aprovados.
- Verificar os requisitos ainda pendentes da autenticação e dos acessos administrativos integrados na Issue #96, incluindo a publicação autorizada na VPS; implementar progressivamente as demais áreas e os fluxos **FL-01, FL-02 e FL-03**.
- Integrar armazenamento privado, geração e envio controlado de PDF, serviços de e-mail e observabilidade, preservando a análise estática já integrada à CI.
- Organizar as revisões por colegas e os testes cruzados acadêmicos exigidos pelo PAC VIII (Issue #105); registrar participantes e evidências reais, validações dos MVPs e correções pertinentes.
- Evoluir a publicação técnica automatizada para uma release estável, com testes de negócio, backups e recuperação verificados, controles de segurança e aceite institucional antes do lançamento oficial.

O acompanhamento das tarefas e prioridades ocorre nas [Issues do repositório](https://github.com/bredleyb/bamak-portal/issues) e no GitHub Project do PAC VIII.

## Privacidade, colaboração e uso

O repositório é público. **Não devem ser versionados** dados pessoais de clientes, fotos de propriedades, localizações precisas, anexos recebidos, documentos comerciais restritos ou credenciais. Exemplos, protótipos e testes devem utilizar dados fictícios ou adequadamente anonimizados. A aplicação deverá implementar permissões, tratamento de consentimento, armazenamento privado e política de retenção antes de operar com dados reais.

O desenvolvimento é individual, com revisão por pares e testes cruzados previstos nas disciplinas. Questões técnicas e defeitos reproduzíveis podem ser tratados nas [Issues](https://github.com/bredleyb/bamak-portal/issues), **sem exposição de dados pessoais, segredos ou vulnerabilidades exploráveis em público**. As contribuições devem respeitar o fluxo de branches, Pull Requests e validação de requisitos.

**Direitos de uso e licenciamento:** o repositório permanece público para acompanhamento acadêmico, conforme as diretrizes aplicáveis aos projetos com parceiro externo. O código-fonte e a documentação **não são disponibilizados sob licença open source**. A publicação não concede autorização geral para utilização, modificação, redistribuição ou exploração comercial, ressalvadas as permissões previstas em lei, nos termos da plataforma e nas licenças de componentes de terceiros. A marca, os logotipos e os materiais institucionais da Bamak dependem de autorização de seus respectivos titulares. A titularidade do software e as condições de implantação, operação, manutenção e eventual transferência de direitos deverão ser formalizadas entre as partes envolvidas antes da adoção como site oficial.

**Responsável pelo projeto:** [Bredley Bauer](https://github.com/bredleyb), Engenharia de Software — Católica de Santa Catarina.
