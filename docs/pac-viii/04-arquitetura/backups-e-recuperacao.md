# Backups e recuperação — PAC VIII

## 1. Objetivo

Registrar a estratégia de proteção e recuperação de dados do Portal Bamak durante o desenvolvimento acadêmico, as verificações realizadas e os riscos residuais conhecidos.

A implementação é acompanhada pela Issue #88. Este documento deve ser atualizado conforme os procedimentos forem comprovados.

## 2. Contexto da infraestrutura

Durante o PAC VIII, o Portal Bamak utiliza uma VPS Hostinger contratada e administrada pelo desenvolvedor, destinada à implementação, aos testes e às demonstrações acadêmicas.

O ambiente utiliza Docker, PostgreSQL 17, NestJS, Next.js e Caddy, com publicação automatizada por GitHub Actions.

A hospedagem atual constitui um ambiente técnico de desenvolvimento e demonstração. A definição da infraestrutura operacional definitiva, incluindo titularidade, fornecedores, serviços de proteção e custos recorrentes, caberá à Bamak Equipamentos LTDA.

## 3. Estratégia de backup

### 3.1. PostgreSQL

A rotina própria está implementada em `infra/backup/backup-postgres.sh`.

Características:

- backup lógico utilizando `pg_dump` em formato customizado;
- verificação da estrutura do dump com `pg_restore --list`;
- geração de checksum SHA-256;
- arquivos e diretórios com permissões restritas;
- trava para impedir execuções simultâneas;
- gravação temporária antes da publicação do arquivo definitivo;
- retenção local aproximada de 14 dias.

O agendamento utiliza `systemd`, com execução diária prevista para 06:00 UTC e atraso aleatório de até dez minutos. A opção `Persistent=true` permite executar posteriormente uma tarefa perdida durante a indisponibilidade do agendador.

### 3.2. Backups nativos da Hostinger

A VPS possui agendamento automático semanal habilitado, sem contratação da modalidade diária adicional.

Na última verificação do painel, em 19/10/2026, ainda não havia backups automáticos disponíveis. O histórico apresentava somente operações anteriores de criação da VPS e criação/exclusão de snapshot.

A existência de um agendamento habilitado não comprova a disponibilidade de um backup recuperável.

A primeira cópia automática disponível deverá ser verificada posteriormente.

### 3.3. Abrangência

A rotina própria protege o conteúdo lógico do PostgreSQL.

Ela não contempla atualmente:

- volumes persistentes do Caddy;
- configurações completas do sistema operacional;
- segredos e credenciais necessários à reconstrução do ambiente;
- futuros anexos privados e PDFs armazenados fora do banco;
- recuperação integral de uma VPS perdida.

A cobertura deverá ser reavaliada quando forem implementados os componentes de persistência de domínio e armazenamento privado.

## 4. Verificações realizadas

Até 19/10/2026, foram comprovados:

- execução de backup manual do PostgreSQL na VPS;
- verificação de integridade SHA-256 do arquivo gerado;
- verificação de permissões restritas;
- instalação e ativação do timer de backup;
- testes automatizados de sucesso e falha;
- teste integrado com PostgreSQL 17 descartável;
- restauração de dois registros fictícios em banco isolado;
- comparação dos registros originais com os restaurados;
- aprovação das verificações de CI no PR #113.

A primeira execução automática agendada ainda precisa de confirmação.

A restauração integrada foi realizada no ambiente descartável de CI. Não foi executado teste de recuperação integral da VPS.

## 5. Procedimento de recuperação

A recuperação deve preservar os dados existentes e evitar operações destrutivas sem autorização.

Antes de executar uma restauração:

1. Identificar a falha e sua abrangência.
2. Identificar a última cópia disponível.
3. Conferir a integridade do arquivo de backup.
4. Preparar um ambiente PostgreSQL isolado e compatível.
5. Restaurar os dados nesse ambiente.
6. Verificar a consistência dos registros.
7. Documentar os resultados e eventuais limitações.
8. Autorizar separadamente qualquer substituição de dados no ambiente principal.

O procedimento técnico detalhado será consolidado após as validações operacionais restantes da Issue #88.

## 6. Riscos residuais aceitos na fase acadêmica

A estratégia atual mantém dependência da infraestrutura Hostinger.

Os dumps próprios permanecem armazenados na VPS e podem ser perdidos juntamente com o servidor. O backup nativo da Hostinger oferece um mecanismo complementar, sujeito à disponibilidade, retenção e condições do serviço contratado.

A solução atual não utiliza armazenamento externo independente, criptografia própria dos dumps ou retenção imutável.

Essas limitações são consideradas administráveis durante o desenvolvimento acadêmico controlado, considerando a utilização de dados fictícios nos testes e a finalidade de demonstração do ambiente.

A aceitação desses riscos não autoriza o armazenamento irrestrito de dados pessoais reais ou documentos privados. Antes dessa utilização, deverão ser reavaliadas as necessidades de privacidade, segurança, retenção e recuperação.

## 7. Responsabilidades e decisões futuras

Durante o PAC VIII, o desenvolvedor é responsável pela execução e verificação dos procedimentos acadêmicos de backup e recuperação.

A escolha dos serviços definitivos, dos contratos de hospedagem, das políticas de retenção e dos mecanismos adicionais de resiliência dependerá das necessidades operacionais e da aprovação da Bamak.

A documentação deverá permitir que a empresa compreenda as limitações da solução atual e avalie alternativas de infraestrutura antes de assumir sua operação definitiva.

## 8. Pendências de validação

- Confirmar a primeira execução automática do timer PostgreSQL.
- Verificar a disponibilidade efetiva do backup semanal Hostinger.
- Completar o inventário dos componentes sujeitos a backup.
- Consolidar o procedimento reproduzível de recuperação.
- Registrar as evidências e limitações da recuperação operacional.
- Reavaliar a proteção de anexos e PDFs nas Issues #99 e #100.

Referências: Issue #88 e PR #113.