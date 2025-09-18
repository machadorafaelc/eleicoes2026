// Dashboard JavaScript
class DashboardManager {
    constructor() {
        this.candidatos = [];
        this.init();
    }

    async init() {
        await this.loadCandidatos();
        this.renderCandidatos();
        this.updateMetrics();
        this.startAutoUpdate();
    }

    async loadCandidatos() {
        try {
            const response = await fetch('data/candidatos.json');
            const data = await response.json();
            this.candidatos = data.candidatos;
        } catch (error) {
            console.error('Erro ao carregar candidatos:', error);
            this.candidatos = this.getMockCandidatos();
        }
    }

    getMockCandidatos() {
        return [
            {
                id: 1,
                nome: "Candidato 1",
                cargo_atual: "Governador",
                partido: "PSDB",
                foto: "",
                ultima_atualizacao: "2025-09-15",
                metricas: {
                    mencoes_semana: 15,
                    sentimento_geral: "positivo",
                    risco_imagem: "baixo",
                    ultima_pesquisa: "32%"
                }
            },
            {
                id: 2,
                nome: "Candidato 2",
                cargo_atual: "Senador",
                partido: "PT",
                foto: "",
                ultima_atualizacao: "2025-09-15",
                metricas: {
                    mencoes_semana: 8,
                    sentimento_geral: "neutro",
                    risco_imagem: "medio",
                    ultima_pesquisa: "28%"
                }
            },
            {
                id: 3,
                nome: "Candidato 3",
                cargo_atual: "Deputado Federal",
                partido: "PL",
                foto: "",
                ultima_atualizacao: "2025-09-15",
                metricas: {
                    mencoes_semana: 12,
                    sentimento_geral: "negativo",
                    risco_imagem: "alto",
                    ultima_pesquisa: "18%"
                }
            }
        ];
    }

    renderCandidatos() {
        const grid = document.getElementById('candidates-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.candidatos.slice(0, 6).forEach(candidato => {
            const card = this.createCandidateCard(candidato);
            grid.appendChild(card);
        });
    }

    createCandidateCard(candidato) {
        const card = document.createElement('div');
        card.className = 'candidate-card fade-in';
        
        const iniciais = candidato.nome.split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        const sentimentIcon = this.getSentimentIcon(candidato.metricas.sentimento_geral);
        const riscoClass = `status-${candidato.metricas.risco_imagem}`;

        card.innerHTML = `
            <div class="candidate-header">
                <div class="candidate-avatar">
                    ${iniciais}
                </div>
                <div class="candidate-info">
                    <h3>${candidato.nome}</h3>
                    <p>${candidato.cargo_atual} - ${candidato.partido}</p>
                </div>
            </div>
            <div class="candidate-metrics">
                <div class="metric">
                    <div class="metric-value">${candidato.metricas.mencoes_semana}</div>
                    <div class="metric-label">Menções</div>
                </div>
                <div class="metric">
                    <div class="metric-value sentiment-${candidato.metricas.sentimento_geral}">
                        ${sentimentIcon}
                    </div>
                    <div class="metric-label">Sentimento</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${candidato.metricas.ultima_pesquisa || 'N/A'}</div>
                    <div class="metric-label">Última Pesquisa</div>
                </div>
                <div class="metric">
                    <span class="status-badge ${riscoClass}">
                        ${candidato.metricas.risco_imagem}
                    </span>
                    <div class="metric-label">Risco</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.openCandidateDetail(candidato.id);
        });

        return card;
    }

    getSentimentIcon(sentimento) {
        switch(sentimento) {
            case 'positivo': return '😊';
            case 'negativo': return '😟';
            default: return '😐';
        }
    }

    updateMetrics() {
        const totalNoticias = this.candidatos.reduce((sum, c) => sum + (c.metricas.mencoes_semana || 0), 0);
        const totalPesquisas = this.candidatos.filter(c => c.metricas.ultima_pesquisa).length;
        const alertasAtivos = this.candidatos.filter(c => c.metricas.risco_imagem === 'alto').length;

        this.updateElement('total-noticias', totalNoticias);
        this.updateElement('total-pesquisas', totalPesquisas);
        this.updateElement('alertas-ativos', alertasAtivos);
        this.updateElement('last-update', new Date().toLocaleDateString('pt-BR'));
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    openCandidateDetail(candidatoId) {
        // Futura implementação para abrir página do candidato
        console.log(`Abrindo detalhes do candidato ${candidatoId}`);
        window.location.href = `candidatos/candidato-${candidatoId}.html`;
    }

    startAutoUpdate() {
        // Atualizar a cada 5 minutos
        setInterval(() => {
            this.updateMetrics();
            this.addActivityItem('Sistema atualizado automaticamente');
        }, 5 * 60 * 1000);
    }

    addActivityItem(message, type = 'info') {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;

        const item = document.createElement('div');
        item.className = 'activity-item fade-in';
        
        const icon = type === 'alert' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle';
        const now = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        item.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <time>${now}</time>
        `;

        // Adicionar no topo
        const firstItem = feed.querySelector('.activity-item');
        if (firstItem) {
            feed.insertBefore(item, firstItem);
        } else {
            feed.appendChild(item);
        }

        // Manter apenas os últimos 10 itens
        const items = feed.querySelectorAll('.activity-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Funções utilitárias globais
window.DashboardUtils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    },
    
    formatNumber: (num) => {
        return new Intl.NumberFormat('pt-BR').format(num);
    },
    
    showNotification: (message, type = 'info') => {
        // Implementar sistema de notificações
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

