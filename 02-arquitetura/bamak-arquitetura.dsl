workspace "Portal Bamak" "Arquitetura inicial do portal institucional-comercial da Bamak" {

    model {
        visitante = person "Visitante / parceiro comercial" "Acessa o portal para conhecer a empresa, consultar segmentos, soluções, catálogo, FAQ, notícias, eventos e iniciar contato."
        admin = person "Administrador da Bamak" "Gerencia conteúdos institucionais e comerciais pela área administrativa."

        portal = softwareSystem "Portal Web Institucional-Comercial da Bamak" "Portal público com módulo administrativo autenticado para gestão de conteúdo." {
            frontend = container "Aplicação Web Frontend" "Interface pública do portal e rotas administrativas protegidas." "Next.js, TypeScript"
            backend = container "API Backend" "Responsável por autenticação administrativa, regras de negócio e gerenciamento de conteúdo." "NestJS, TypeScript"
            database = container "Banco de Dados" "Armazena usuários administrativos, notícias, eventos, FAQ, produtos e mensagens de contato." "PostgreSQL"
        }

        email = softwareSystem "Serviço de e-mail" "Serviço externo utilizado para encaminhamento de mensagens do formulário de contato."

        visitante -> portal "Acessa para conhecer a empresa, consultar informações e iniciar contato"
        admin -> portal "Acessa para gerenciar conteúdo"

        visitante -> frontend "Utiliza via navegador"
        admin -> frontend "Acessa área administrativa"
        frontend -> backend "Consome API via HTTPS/JSON"
        backend -> database "Lê e grava dados"
        backend -> email "Encaminha mensagens do formulário de contato"
    }

    views {
        systemContext portal "bamak-c1-system-context" {
            include *
            autolayout lr
        }

        container portal "bamak-c2-container-view" {
            include *
            autolayout lr
        }

        theme default
    }
}