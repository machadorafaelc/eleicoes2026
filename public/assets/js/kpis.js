// KPIs Rápidos - Dashboard Geral
// Exibe métricas importantes em cards visuais

class KPIManager {
    constructor() {
        this.kpis = [
            {
                id: 'kpi-itens-7d',
                nome: 'Itens processados (7d)',
                sql: 'SELECT COUNT(*) FROM midia_df WHERE data_publicacao >= NOW() - INTERVAL \'7 days\';',
                icon: 'fas fa-newspaper',
                color: '#2563eb',
                description: 'Total de itens de mídia processados nos últimos 7 dias'
            },
            {
                id: 'kpi-pesquisas-30d',
                nome: 'Pesquisas registradas (30d)',
                sql: 'SELECT COUNT(*) FROM pesquisas_df WHERE data_campo >= CURRENT_DATE - INTERVAL \'30 days\' AND local=\'DF\';',
                icon: 'fas fa-chart-line',
                color: '#059669',
                description: 'Número de pesquisas eleitorais registradas nos últimos 30 dias'
            },
            {
                id: 'kpi-fontes-alto-alcance-7d',
                nome: 'Fontes de alto alcance (7d)',
                sql: 'SELECT COUNT(DISTINCT fonte) FROM midia_df WHERE score_credibilidade >= 0.75 AND data_publicacao >= NOW() - INTERVAL \'7 days\';',
                icon: 'fas fa-star',
                color: '#d97706',
                description: 'Fontes com alta credibilidade (≥75%) que publicaram nos últimos 7 dias'
            }
        ];
        
        this.refreshInterval = null;
    }

    // Inicializar KPIs
    async initialize() {
        try {
            console.log('🔄 Inicializando KPIs rápidos...');
            
            // Criar interface dos KPIs
            this.createKPIInterface();
            
            // Carregar dados dos KPIs
            await this.loadKPIData();
            
            // Configurar auto-refresh (a cada 5 minutos)
            this.setupAutoRefresh();
            
            console.log('✅ KPIs inicializados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar KPIs:', error);
        }
    }

    // Criar interface dos KPIs
    createKPIInterface() {
        const container = document.getElementById('kpis-container');
        if (!container) {
            console.error('Container kpis-container não encontrado');
            return;
        }

        const html = `
            <div class="kpis-section">
                <div class="section-header">
                    <h2><i class="fas fa-tachometer-alt"></i> KPIs Rápidos</h2>
                    <p class="section-description">Métricas importantes do sistema de monitoramento</p>
                </div>
                
                <div class="kpis-grid">
                    ${this.kpis.map(kpi => this.createKPICard(kpi)).join('')}
                </div>
                
                <div class="kpis-actions">
                    <button id="btn-refresh-kpis" class="btn btn-secondary">
                        <i class="fas fa-sync-alt"></i>
                        Atualizar KPIs
                    </button>
                    <span class="last-update">
                        Última atualização: <span id="kpis-last-update">Carregando...</span>
                    </span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Configurar event listener para botão de refresh
        document.getElementById('btn-refresh-kpis').addEventListener('click', () => {
            this.refreshKPIs();
        });
    }

    // Criar card individual do KPI
    createKPICard(kpi) {
        return `
            <div class="kpi-card" id="${kpi.id}">
                <div class="kpi-header">
                    <div class="kpi-icon" style="background-color: ${kpi.color}20; color: ${kpi.color};">
                        <i class="${kpi.icon}"></i>
                    </div>
                    <div class="kpi-info">
                        <h3 class="kpi-title">${kpi.nome}</h3>
                        <p class="kpi-description">${kpi.description}</p>
                    </div>
                </div>
                
                <div class="kpi-body">
                    <div class="kpi-value">
                        <span class="kpi-number" id="${kpi.id}-value">
                            <i class="fas fa-spinner fa-spin"></i>
                        </span>
                        <span class="kpi-trend" id="${kpi.id}-trend"></span>
                    </div>
                    
                    <div class="kpi-details">
                        <div class="kpi-sql" title="${kpi.sql}">
                            <i class="fas fa-database"></i>
                            <span>SQL Query</span>
                        </div>
                        <div class="kpi-status" id="${kpi.id}-status">
                            <i class="fas fa-clock"></i>
                            <span>Carregando...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Carregar dados dos KPIs
    async loadKPIData() {
        try {
            console.log('🔄 Carregando dados dos KPIs...');
            
            // Simular consultas SQL e carregar dados
            const kpiData = await this.fetchKPIData();
            
            // Atualizar interface com os dados
            this.updateKPIInterface(kpiData);
            
            // Atualizar timestamp
            this.updateLastUpdateTime();
            
            console.log('✅ Dados dos KPIs carregados');
            
        } catch (error) {
            console.error('❌ Erro ao carregar KPIs:', error);
            this.showKPIError();
        }
    }

    // Buscar dados dos KPIs (simulado)
    async fetchKPIData() {
        // Simular consultas SQL com dados realistas
        
        // KPI 1: Itens processados (7d)
        // SELECT COUNT(*) FROM midia_df WHERE data_publicacao >= NOW() - INTERVAL '7 days';
        const itensProcessados7d = 47; // Simulado baseado nos dados do sistema
        
        // KPI 2: Pesquisas registradas (30d)  
        // SELECT COUNT(*) FROM pesquisas_df WHERE data_campo >= CURRENT_DATE - INTERVAL '30 days' AND local='DF';
        const pesquisasRegistradas30d = 6; // Simulado: 3 institutos x 2 cenários
        
        // KPI 3: Fontes de alto alcance (7d)
        // SELECT COUNT(DISTINCT fonte) FROM midia_df WHERE score_credibilidade >= 0.75 AND data_publicacao >= NOW() - INTERVAL '7 days';
        const fontesAltoAlcance7d = 5; // Simulado: G1, Folha, Estadão, Correio, UOL
        
        return {
            'kpi-itens-7d': {
                value: itensProcessados7d,
                trend: '+12%',
                trendDirection: 'up',
                status: 'Ativo',
                details: `${itensProcessados7d} itens de ${this.kpis.find(k => k.id === 'kpi-itens-7d').description.split(' ').length} fontes`
            },
            'kpi-pesquisas-30d': {
                value: pesquisasRegistradas30d,
                trend: '+2',
                trendDirection: 'up',
                status: 'Atualizado',
                details: `${pesquisasRegistradas30d} pesquisas de 3 institutos diferentes`
            },
            'kpi-fontes-alto-alcance-7d': {
                value: fontesAltoAlcance7d,
                trend: '=',
                trendDirection: 'stable',
                status: 'Estável',
                details: `${fontesAltoAlcance7d} fontes com credibilidade ≥75%`
            }
        };
    }

    // Atualizar interface com dados dos KPIs
    updateKPIInterface(kpiData) {
        Object.keys(kpiData).forEach(kpiId => {
            const data = kpiData[kpiId];
            
            // Atualizar valor
            const valueElement = document.getElementById(`${kpiId}-value`);
            if (valueElement) {
                valueElement.innerHTML = `<span class="number">${data.value}</span>`;
            }
            
            // Atualizar trend
            const trendElement = document.getElementById(`${kpiId}-trend`);
            if (trendElement) {
                const trendClass = data.trendDirection === 'up' ? 'trend-up' : 
                                 data.trendDirection === 'down' ? 'trend-down' : 'trend-stable';
                const trendIcon = data.trendDirection === 'up' ? 'fa-arrow-up' : 
                                 data.trendDirection === 'down' ? 'fa-arrow-down' : 'fa-minus';
                
                trendElement.innerHTML = `
                    <span class="trend ${trendClass}">
                        <i class="fas ${trendIcon}"></i>
                        ${data.trend}
                    </span>
                `;
            }
            
            // Atualizar status
            const statusElement = document.getElementById(`${kpiId}-status`);
            if (statusElement) {
                const statusIcon = data.status === 'Ativo' ? 'fa-check-circle' :
                                  data.status === 'Atualizado' ? 'fa-sync' : 'fa-pause-circle';
                const statusColor = data.status === 'Ativo' ? '#059669' :
                                   data.status === 'Atualizado' ? '#2563eb' : '#6b7280';
                
                statusElement.innerHTML = `
                    <i class="fas ${statusIcon}" style="color: ${statusColor};"></i>
                    <span>${data.status}</span>
                `;
            }
            
            // Adicionar tooltip com detalhes
            const cardElement = document.getElementById(kpiId);
            if (cardElement) {
                cardElement.setAttribute('title', data.details);
            }
        });
    }

    // Atualizar timestamp da última atualização
    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('kpis-last-update');
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            lastUpdateElement.textContent = timeString;
        }
    }

    // Mostrar erro nos KPIs
    showKPIError() {
        this.kpis.forEach(kpi => {
            const valueElement = document.getElementById(`${kpi.id}-value`);
            if (valueElement) {
                valueElement.innerHTML = '<span class="error">Erro</span>';
            }
            
            const statusElement = document.getElementById(`${kpi.id}-status`);
            if (statusElement) {
                statusElement.innerHTML = `
                    <i class="fas fa-exclamation-triangle" style="color: #dc2626;"></i>
                    <span>Erro</span>
                `;
            }
        });
    }

    // Refresh manual dos KPIs
    async refreshKPIs() {
        try {
            console.log('🔄 Atualizando KPIs...');
            
            // Mostrar loading
            this.showKPILoading();
            
            // Recarregar dados
            await this.loadKPIData();
            
            // Mostrar feedback visual
            this.showRefreshFeedback();
            
        } catch (error) {
            console.error('❌ Erro ao atualizar KPIs:', error);
            this.showKPIError();
        }
    }

    // Mostrar loading nos KPIs
    showKPILoading() {
        this.kpis.forEach(kpi => {
            const valueElement = document.getElementById(`${kpi.id}-value`);
            if (valueElement) {
                valueElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }
            
            const statusElement = document.getElementById(`${kpi.id}-status`);
            if (statusElement) {
                statusElement.innerHTML = `
                    <i class="fas fa-clock"></i>
                    <span>Carregando...</span>
                `;
            }
        });
    }

    // Mostrar feedback de refresh
    showRefreshFeedback() {
        const button = document.getElementById('btn-refresh-kpis');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Atualizado';
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
            }, 2000);
        }
    }

    // Configurar auto-refresh
    setupAutoRefresh() {
        // Refresh automático a cada 5 minutos
        this.refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refresh dos KPIs...');
            this.loadKPIData();
        }, 5 * 60 * 1000); // 5 minutos
    }

    // Limpar auto-refresh
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Função para inicializar os KPIs (será chamada pelo dashboard)
function initializeKPIs() {
    console.log('🚀 Inicializando KPIs rápidos...');
    
    // Criar instância global
    window.kpiManager = new KPIManager();
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.kpiManager.initialize();
        });
    } else {
        window.kpiManager.initialize();
    }
}

// Auto-inicializar se o script for carregado diretamente
if (typeof window !== 'undefined' && document.getElementById('kpis-container')) {
    initializeKPIs();
}

