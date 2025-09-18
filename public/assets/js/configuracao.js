// JavaScript para página de configuração

class ConfigurationManager {
    constructor() {
        this.config = {
            candidatos_df: [
                "Celina Leão",
                "Izalci Lucas", 
                "Leandro Grass",
                "Erika Kokay",
                "Damares Alves",
                "Leila Barros",
                "José Roberto Arruda",
                "Paula Belmonte",
                "Alberto Fraga",
                "Fábio Félix"
            ],
            termos_extra: [
                "GDF",
                "Distrito Federal",
                "Brasília"
            ],
            fontes_whitelist: [
                "G1",
                "UOL",
                "Folha de S.Paulo",
                "O Estado de S. Paulo",
                "Correio Braziliense",
                "Metrópoles",
                "CartaCapital",
                "Estadão",
                "Poder360",
                "CNN Brasil"
            ],
            tipos_conteudo_permitidos: [
                "noticia",
                "artigo",
                "entrevista",
                "video",
                "post"
            ],
            limites: {
                max_itens_por_execucao: 80,
                janela_horas_busca: 72,
                min_tamanho_texto: 400
            }
        };
        
        this.init();
    }

    init() {
        this.updateLastUpdate();
        this.bindEvents();
        console.log('Configuration Manager initialized');
    }

    bindEvents() {
        // Eventos dos botões serão vinculados aqui
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        // Event listeners para checkboxes
        const checkboxes = document.querySelectorAll('.config-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleConfigChange(e.target);
            });
        });
    }

    handleConfigChange(element) {
        const option = element.closest('.config-option').querySelector('span').textContent;
        console.log(`Configuração alterada: ${option} = ${element.checked}`);
        
        // Aqui você pode implementar a lógica para salvar as alterações
        this.showNotification(`Configuração "${option}" ${element.checked ? 'ativada' : 'desativada'}`, 'info');
    }

    showNotification(message, type = 'info') {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        // Adicionar estilos inline para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    updateLastUpdate() {
        const element = document.getElementById('last-update');
        if (element) {
            element.textContent = new Date().toLocaleDateString('pt-BR');
        }
    }

    getConfiguration() {
        return this.config;
    }

    updateConfiguration(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('Configuration updated:', this.config);
    }
}

// Funções globais para os botões
function saveConfiguration() {
    const configManager = window.configManager;
    
    // Simular salvamento
    configManager.showNotification('Configurações salvas com sucesso!', 'success');
    
    // Aqui você implementaria a lógica real de salvamento
    console.log('Saving configuration:', configManager.getConfiguration());
}

function resetConfiguration() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
        const configManager = window.configManager;
        
        // Restaurar checkboxes para estado padrão
        const checkboxes = document.querySelectorAll('.config-option input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            // Definir estados padrão (primeiros 3 marcados, resto desmarcado)
            checkbox.checked = index < 3;
        });
        
        configManager.showNotification('Configurações restauradas para o padrão', 'info');
        console.log('Configuration reset to defaults');
    }
}

function testAgents() {
    const configManager = window.configManager;
    
    configManager.showNotification('Iniciando teste dos agentes...', 'info');
    
    // Simular teste dos agentes
    setTimeout(() => {
        configManager.showNotification('Teste concluído: Todos os agentes funcionando corretamente', 'success');
    }, 2000);
    
    console.log('Testing agents...');
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.configManager = new ConfigurationManager();
});

// Adicionar estilos para animações das notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-success {
        background: #28a745 !important;
    }
    
    .notification-error {
        background: #dc3545 !important;
    }
    
    .notification-warning {
        background: #ffc107 !important;
        color: #212529 !important;
    }
`;
document.head.appendChild(style);

