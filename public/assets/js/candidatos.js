// Candidatos Page JavaScript
class CandidatosManager {
    constructor() {
        this.candidatos = [];
        this.init();
    }

    async init() {
        await this.loadCandidatos();
        this.renderAllCandidatos();
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
        // Fallback apenas se não conseguir carregar o JSON
        return [];
    }

    renderAllCandidatos() {
        const grid = document.getElementById('all-candidates-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.candidatos.forEach(candidato => {
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
                    <small style="color: #667eea; font-weight: 500;">Cargo Alvo: ${candidato.cargo_alvo}</small>
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
            <div style="margin-top: 1rem; text-align: center;">
                <button class="btn-primary" onclick="openCandidateDetail(${candidato.id})">
                    Ver Detalhes
                </button>
            </div>
        `;

        return card;
    }

    getSentimentIcon(sentimento) {
        switch(sentimento) {
            case 'positivo': return '😊';
            case 'negativo': return '😟';
            default: return '😐';
        }
    }
}

// Função global para abrir detalhes do candidato
function openCandidateDetail(candidatoId) {
    window.location.href = `candidatos/candidato-${candidatoId}.html`;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CandidatosManager();
});

// Adicionar estilos para botão
const style = document.createElement('style');
style.textContent = `
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem 0;
    }
    
    .page-header h2 {
        color: #2c3e50;
        font-size: 2.2rem;
        margin-bottom: 1rem;
    }
    
    .page-header p {
        color: #7f8c8d;
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto;
    }
`;
document.head.appendChild(style);

