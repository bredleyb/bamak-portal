workspace "Portal Bamak" "Arquitetura inicial do portal institucional-comercial da Bamak" {

    model {
        visitante = person "Visitante / parceiro comercial" "Acessa o portal para conhecer a empresa, consultar segmentos, soluções, catálogo, FAQ, notícias, eventos e iniciar contato."
        admin = person "Administrador da Bamak" "Gerencia conteúdos institucionais e comerciais pela área administrativa."

        portal = softwareSystem "Portal Web Institucional-Comercial da Bamak" "Portal público com módulo administrativo autenticado para gestão de conteúdo."

        email = softwareSystem "Serviço de e-mail" "Serviço externo utilizado para encaminhamento de mensagens do formulário de contato."

        visitante -> portal "Acessa para conhecer a empresa, consultar informações e iniciar contato"
        admin -> portal "Acessa para gerenciar conteúdo"
        portal -> email "Encaminha mensagens do formulário de contato"
    }

    views {
        systemContext portal "bamak-c1-system-context" {
            include *
            autolayout lr
        }

        theme default
    }
}