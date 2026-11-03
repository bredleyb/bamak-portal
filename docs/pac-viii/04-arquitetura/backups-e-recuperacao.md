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

A VPS dispõe de agendamento automático semanal no painel da Hostinger, sem contratação da modalidade diária adicional.

**Registro histórico (19/10/2026):** na inspeção daquela data, ainda não havia cópias automáticas disponíveis no painel. O histórico registrava apenas operações anteriores relacionadas à VPS e a snapshots.

**Verificação de 02/11/2026:** foi identificada no painel da Hostinger uma cópia automática semanal disponível, com armazenamento separado do servidor principal e substituição periódica das cópias antigas, conforme a política apresentada pelo provedor.

Essa observação confirma a existência da cópia indicada no painel. A recuperação integral da VPS não foi ensaiada; a duração de 30 minutos exibida para restauração constitui estimativa do provedor, sem medição operacional independente. O armazenamento permanece dependente do mesmo fornecedor.

### 3.3. Inventário de componentes e abrangência

O inventário foi conferido com o `compose.production.yaml` e a implementação atual de backup.

| Componente | Persistência ou origem | Proteção atual |
| --- | --- | --- |
| PostgreSQL | Volume `bamak-production_postgres_data` | Dump lógico diário, retenção local de aproximadamente 14 dias |
| Caddy — dados | Volume `bamak-production_caddy_data` | Fora do dump; recuperação depende de reconstrução ou backup da VPS |
| Caddy — configuração | Volume `bamak-production_caddy_config` | Fora do dump; recuperação depende de reconstrução ou backup da VPS |
| Aplicação e Caddyfile | Código versionado no GitHub | Reconstrução por deploy automatizado |
| Configuração de produção | `.env.production` e configurações do host | Proteção local; recuperação independente ainda não demonstrada |
| Credenciais e chaves | Gerenciamento restrito fora do repositório | Requer procedimento seguro de recuperação ou substituição |
| Anexos e PDFs privados | Armazenamento previsto para as Issues #99 e #100 | Ainda não implementado |

O backup lógico do PostgreSQL não equivale a uma cópia completa da infraestrutura.

A cópia semanal identificada no painel da Hostinger constitui proteção complementar disponível, sujeita à retenção, à política do provedor e à recuperação integral ainda não ensaiada.

A estratégia de recuperação deverá ser reavaliada quando o sistema passar a armazenar dados pessoais reais e arquivos privados.

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

A primeira execução automática foi confirmada em 19/10/2026, às 06:05:28 UTC (03:05:28, horário de Brasília). O `systemd` registrou `status=0/SUCCESS` e a criação de `postgres-20261019T060528Z-209148.dump`.

As verificações posteriores comprovaram:

- geração do dump e do arquivo `.sha256`, ambos com permissões restritas;
- integridade SHA-256 aprovada (`OK`);
- reconhecimento do arquivo pelo `pg_restore --list`;
- origem PostgreSQL 17.11, formato customizado e compressão gzip;
- quatro entradas internas no índice, sem objetos de domínio, conforme o banco atual;
- próxima execução agendada para 20/10/2026, às 06:09:52 UTC.

A verificação comprova a execução automática e a integridade do arquivo, mas não constitui um novo teste de restauração. A restauração isolada foi demonstrada anteriormente com o dump manual.

A restauração integrada de dois registros fictícios foi realizada anteriormente na CI.

Em 19/10/2026, o dump `postgres-20261019T020806Z-71936.dump`, gerado na VPS, foi submetido a uma verificação adicional:

- integridade SHA-256 confirmada;
- estrutura reconhecida pelo `pg_restore --list`;
- origem PostgreSQL 17.11;
- restauração concluída sem erros em PostgreSQL 17 descartável;
- contêiner sem rede e sem acesso ao volume de produção;
- consulta final retornando zero tabelas públicas, conforme o conteúdo original;
- remoção do contêiner temporário confirmada por inspeção com `docker ps -a --filter name=bamak-restauracao`, sem contêineres encontrados.

A evidência de 19/10 confirma a recuperação daquele dump efetivamente produzido na VPS. Naquela data, o banco restaurado não continha tabelas de negócio; a recuperação de registros fictícios foi demonstrada separadamente pelo teste integrado da CI.

A recuperação integral da VPS ainda não foi testada.

### 4.1. Verificações complementares em 02/11/2026

- O serviço automático de backup PostgreSQL estava ativo, com a última execução concluída com sucesso em 02/11/2026.
- Foram identificados dumps diários de 29/10 a 02/11/2026. O arquivo mais recente passou na verificação SHA-256, e `pg_restore --list` reconheceu seu índice sem erro. Nenhum novo ensaio de restauração foi realizado.
- Os backups locais permanecem armazenados na mesma partição do servidor, o que limita sua proteção contra falhas da infraestrutura.
- O painel da Hostinger apresentou uma cópia semanal disponível. Sua restauração integral ainda não foi ensaiada.

As evidências anteriores de restauração isolada e recuperação de registros fictícios em CI permanecem válidas apenas para os respectivos arquivos, dados e ambientes de teste.

## 5. Procedimento de recuperação

### 5.1. Recuperação lógica do PostgreSQL

A recuperação de dados deve ocorrer inicialmente em um banco isolado, preservando a instância de produção.

Procedimento previsto:

1. Identificar o backup mais recente anterior à falha.
2. Localizar o arquivo `.dump` e seu correspondente `.sha256`.
3. Conferir a integridade utilizando `sha256sum -c`.
4. Verificar a estrutura do dump utilizando `pg_restore --list`.
5. Preparar uma instância PostgreSQL 17 isolada, sem exposição pública e sem compartilhamento do volume de produção.
6. Criar um banco de destino vazio.
7. Restaurar o dump utilizando `pg_restore` com `--no-owner`, `--no-acl` e `--exit-on-error`.
8. Conferir tabelas, registros e relacionamentos aplicáveis.
9. Registrar resultado, duração, inconsistências e limitações observadas.
10. Autorizar separadamente qualquer intervenção nos dados de produção.

Não executar restaurações destrutivas, exclusão de volumes ou substituição do banco principal sem autorização e procedimento específico.

### 5.2. Verificação automatizada existente

O arquivo `infra/backup/test-backup-postgres-integration.sh` executa um teste reproduzível em ambiente Linux descartável.

O teste:

- inicia PostgreSQL 17 isolado;
- insere dois registros fictícios;
- executa o script de backup;
- verifica o checksum SHA-256;
- restaura o dump em outro banco;
- compara os registros originais e restaurados;
- remove os recursos temporários ao terminar.

Esse teste integra a CI do GitHub Actions.

Sua aprovação demonstra o funcionamento do procedimento sobre dados fictícios. A restauração de um dump gerado na VPS foi validada em 19/10/2026, utilizando PostgreSQL 17 descartável, sem acesso à rede ou ao volume de produção.

### 5.3. Recuperação integral da VPS

A recuperação integral depende dos mecanismos disponibilizados pela Hostinger.

Antes de utilizar uma cópia integral:

1. Confirmar a existência e a data do backup disponível.
2. Identificar os serviços e dados potencialmente afetados.
3. Avaliar o impacto da substituição do estado atual da VPS.
4. Planejar uma janela de manutenção apropriada.
5. Obter autorização específica para a restauração.
6. Executar o procedimento documentado pelo provedor.
7. Verificar Docker, PostgreSQL, API, aplicação web, Caddy e HTTPS.
8. Registrar o resultado e as limitações.

Até a conclusão das verificações da Issue #88, não há evidência de restauração integral da VPS.

### 5.4. Limites de recuperação

A periodicidade diária dos dumps define o intervalo pretendido entre pontos de recuperação do PostgreSQL, sujeito ao sucesso das execuções.

Não há RPO ou RTO formalmente validado.

A retenção local aproximada de 14 dias limita a disponibilidade histórica dos dumps.

A recuperação integral permanece dependente dos mecanismos da Hostinger. A disponibilidade de uma cópia semanal foi observada em 02/11/2026, sem ensaio de restauração integral, sem RPO/RTO validados e sem cópia independente do provedor comprovada.

A implementação de novos volumes, anexos privados e documentos PDF exigirá revisão deste procedimento.

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

- Monitorar a continuidade das execuções automáticas e eventuais falhas do timer PostgreSQL.
- Ensaiar, em ambiente isolado, a restauração de um dump posterior à aplicação das migrações de domínio, sem afetar o banco de produção.
- Avaliar a recuperação integral da VPS e definir RPO/RTO com responsáveis e procedimentos autorizados.
- Avaliar uma cópia protegida independente da Hostinger antes da operação com dados reais.
- Revisar proteção, retenção e recuperação de anexos e PDFs privados quando os módulos correspondentes forem implementados.

Referências: Issue #88 e PR #113.
