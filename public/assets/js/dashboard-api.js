// Dashboard Manager com integração às APIs serverless
class DashboardManager {
    constructor() {
        this.candidatos = [];
        this.alertas = [];
        this.kpis = {};
        this.baseApiUrl = '/api';
        this.init();
    }

    async init() {
        try {
            await this.loadCandidatos();
            await this.loadKPIs();
            await this.loadAlertas();
            this.renderDashboard();
            this.startAutoUpdate();
        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.showError('Erro ao carregar dados do sistema');
        }
    }

    // Carregar candidatos via API
    async loadCandidatos() {
        try {
            const response = await fetch(`${this.baseApiUrl}/configuracao?secao=candidatos`);
            const data = await response.json();
            this.candidatos = data.candidatos || [];
            
            // Enriquecer com dados de métricas
            for (let candidato of this.candidatos) {
                candidato.metricas = await this.loadCandidatoMetricas(candidato.nome);
            }
        } catch (error) {
            console.error('Erro ao carregar candidatos:', error);
            this.candidatos = this.getMockCandidatos();
        }
    }

    // Carregar métricas de um candidato específico
    async loadCandidatoMetricas(nomeCandidato) {
        try {
            const [sovData, retoricalData, noticiasData, pesquisasData] = await Promise.all([
                fetch(`${this.baseApiUrl}/dados?tipo=sov&candidato=${encodeURIComponent(nomeCandidato)}`),
                fetch(`${this.baseApiUrl}/dados?tipo=retorica&candidato=${encodeURIComponent(nomeCandidato)}`),
                fetch(`${this.baseApiUrl}/dados?tipo=noticias&candidato=${encodeURIComponent(nomeCandidato)}&limit=7`),
                fetch(`${this.baseApiUrl}/dados?tipo=pesquisas&candidato=${encodeURIComponent(nomeCandidato)}`)
            ]);

            const [sov, retorica, noticias, pesquisas] = await Promise.all([
                sovData.json(),
                retoricalData.json(),
                noticiasData.json(),
                pesquisasData.json()
            ]);

            // Calcular métricas
            const mencoesSemana = noticias.noticias?.length || 0;
            const sentimentoMedio = this.calcularSentimentoMedio(noticias.noticias || []);
            const ultimaPesquisa = pesquisas.pesquisas?.[0]?.intencao || 'N/D';
            const riscoImagem = this.calcularRiscoImagem(noticias.noticias || []);

            return {
                mencoes_semana: mencoesSemana,
                sentimento_geral: this.formatarSentimento(sentimentoMedio),
                risco_imagem: riscoImagem,
                ultima_pesquisa: typeof ultimaPesquisa === 'number' ? `${ultimaPesquisa}%` : ultimaPesquisa,
                tendencia_sov: this.calcularTendenciaSoV(sov.semanas || [])
            };
        } catch (error) {
            console.error(`Erro ao carregar métricas para ${nomeCandidato}:`, error);
            return this.getMockMetricas();
        }
    }

    // Carregar KPIs gerais
    async loadKPIs() {
        try {
            const response = await fetch(`${this.baseApiUrl}/dados?tipo=kpis`);
            const data = await response.json();
            this.kpis = data;
        } catch (error) {
            console.error('Erro ao carregar KPIs:', error);
            this.kpis = this.getMockKPIs();
        }
    }

    // Carregar alertas
    async loadAlertas() {
        try {
            const response = await fetch(`${this.baseApiUrl}/alertas?acao=listar`);
            const data = await response.json();
            this.alertas = data.alertas || [];
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
            this.alertas = [];
        }
    }

    // Renderizar dashboard completo
    renderDashboard() {
        this.renderKPIs();
        this.renderCandidatos();
        this.renderAlertas();
        this.renderUltimasAtualizacoes();
    }

    // Renderizar KPIs
    renderKPIs() {
        const kpisContainer = document.getElementById('kpis-container');
        if (!kpisContainer) return;

        const kpisHtml = `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">📊</div>
                    <div class="kpi-content">
                        <div class="kpi-value">${this.kpis.itens_processados?.valor || 0}</div>
                        <div class="kpi-label">Itens Processados</div>
                        <div class="kpi-trend ${this.kpis.itens_processados?.cor || 'neutral'}">${this.kpis.itens_processados?.trend || ''}</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">🗳️</div>
                    <div class="kpi-content">
                        <div class="kpi-value">${this.kpis.pesquisas_registradas?.valor || 0}</div>
                        <div class="kpi-label">Pesquisas Registradas</div>
                        <div class="kpi-trend ${this.kpis.pesquisas_registradas?.cor || 'neutral'}">${this.kpis.pesquisas_registradas?.trend || ''}</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">📰</div>
                    <div class="kpi-content">
                        <div class="kpi-value">${this.kpis.fontes_alto_alcance?.valor || 0}</div>
                        <div class="kpi-label">Fontes Alto Alcance</div>
                        <div class="kpi-trend ${this.kpis.fontes_alto_alcance?.cor || 'neutral'}">${this.kpis.fontes_alto_alcance?.trend || ''}</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-content">
                        <div class="kpi-value">${this.alertas.filter(a => !a.lido).length}</div>
                        <div class="kpi-label">Alertas Não Lidos</div>
                        <div class="kpi-trend warning">Requer atenção</div>
                    </div>
                </div>
            </div>
        `;

        kpisContainer.innerHTML = kpisHtml;
    }

    // Renderizar lista de candidatos
    renderCandidatos() {
        const candidatosContainer = document.getElementById('candidatos-grid');
        if (!candidatosContainer) return;

        const candidatosHtml = this.candidatos.map(candidato => `
            <div class="candidato-card" data-candidato-id="${candidato.id}">
                <div class="candidato-header">
                    <div class="candidato-foto">
                        <img src="${candidato.foto_url || '/assets/images/default-avatar.png'}" 
                             alt="${candidato.nome}" 
                             onerror="this.src='/assets/images/default-avatar.png'">
                    </div>
                    <div class="candidato-info">
                        <h3>${candidato.nome}</h3>
                        <p>${candidato.cargo_atual} - ${candidato.partido}</p>
                    </div>
                </div>
                <div class="candidato-metricas">
                    <div class="metrica">
                        <span class="metrica-label">Menções (7d)</span>
                        <span class="metrica-valor">${candidato.metricas?.mencoes_semana || 0}</span>
                    </div>
                    <div class="metrica">
                        <span class="metrica-label">Sentimento</span>
                        <span class="metrica-valor sentimento-${candidato.metricas?.sentimento_geral || 'neutro'}">${candidato.metricas?.sentimento_geral || 'Neutro'}</span>
                    </div>
                    <div class="metrica">
                        <span class="metrica-label">Risco</span>
                        <span class="metrica-valor risco-${candidato.metricas?.risco_imagem || 'baixo'}">${candidato.metricas?.risco_imagem || 'Baixo'}</span>
                    </div>
                    <div class="metrica">
                        <span class="metrica-label">Última Pesquisa</span>
                        <span class="metrica-valor">${candidato.metricas?.ultima_pesquisa || 'N/D'}</span>
                    </div>
                </div>
                <div class="candidato-actions">
                    <button onclick="window.location.href='candidatos/candidato-${candidato.id}.html'" class="btn-primary">
                        Ver Detalhes
                    </button>
                    <button onclick="dashboardManager.abrirComparador('${candidato.nome}')" class="btn-secondary">
                        Comparar
                    </button>
                </div>
            </div>
        `).join('');

        candidatosContainer.innerHTML = candidatosHtml;
    }

    // Renderizar alertas
    renderAlertas() {
        const alertasContainer = document.getElementById('alertas-container');
        if (!alertasContainer) return;

        const alertasRecentes = this.alertas.slice(0, 5);
        const alertasHtml = `
            <div class="alertas-header">
                <h3>Alertas Recentes</h3>
                <button onclick="window.location.href='alertas.html'" class="btn-link">Ver todos</button>
            </div>
            <div class="alertas-lista">
                ${alertasRecentes.map(alerta => `
                    <div class="alerta-item ${alerta.lido ? 'lido' : 'nao-lido'} severidade-${alerta.severidade}">
                        <div class="alerta-icon">${this.getAlertaIcon(alerta.tipo)}</div>
                        <div class="alerta-content">
                            <div class="alerta-titulo">${alerta.titulo}</div>
                            <div class="alerta-mensagem">${alerta.mensagem}</div>
                            <div class="alerta-meta">
                                <span class="alerta-candidato">${alerta.candidato}</span>
                                <span class="alerta-timestamp">${this.formatarTimestamp(alerta.timestamp)}</span>
                            </div>
                        </div>
                        ${!alerta.lido ? `<button onclick="dashboardManager.marcarAlertaLido('${alerta.id}')" class="btn-marcar-lido">✓</button>` : ''}
                    </div>
                `).join('')}
            </div>
        `;

        alertasContainer.innerHTML = alertasHtml;
    }

    // Renderizar últimas atualizações
    renderUltimasAtualizacoes() {
        const atualizacoesContainer = document.getElementById('atualizacoes-container');
        if (!atualizacoesContainer) return;

        const agora = new Date();
        const atualizacoesHtml = `
            <div class="atualizacoes-header">
                <h3>Status do Sistema</h3>
                <div class="status-indicator online">Online</div>
            </div>
            <div class="atualizacoes-lista">
                <div class="atualizacao-item">
                    <div class="atualizacao-icon">🔄</div>
                    <div class="atualizacao-content">
                        <div class="atualizacao-titulo">Pipeline de Coleta</div>
                        <div class="atualizacao-status">Última execução: ${this.formatarTimestamp(agora.toISOString())}</div>
                    </div>
                </div>
                <div class="atualizacao-item">
                    <div class="atualizacao-icon">📊</div>
                    <div class="atualizacao-content">
                        <div class="atualizacao-titulo">Dados Processados</div>
                        <div class="atualizacao-status">${this.kpis.itens_processados?.valor || 0} itens hoje</div>
                    </div>
                </div>
                <div class="atualizacao-item">
                    <div class="atualizacao-icon">🗳️</div>
                    <div class="atualizacao-content">
                        <div class="atualizacao-titulo">Pesquisas</div>
                        <div class="atualizacao-status">${this.kpis.pesquisas_registradas?.valor || 0} registradas</div>
                    </div>
                </div>
            </div>
        `;

        atualizacoesContainer.innerHTML = atualizacoesHtml;
    }

    // Marcar alerta como lido
    async marcarAlertaLido(alertaId) {
        try {
            const response = await fetch(`${this.baseApiUrl}/alertas?acao=marcar_lido&id=${alertaId}`);
            const result = await response.json();
            
            if (result.success) {
                // Atualizar estado local
                const alerta = this.alertas.find(a => a.id === alertaId);
                if (alerta) {
                    alerta.lido = true;
                }
                this.renderAlertas();
                this.renderKPIs(); // Atualizar contador de alertas não lidos
            }
        } catch (error) {
            console.error('Erro ao marcar alerta como lido:', error);
        }
    }

    // Abrir comparador de candidatos
    abrirComparador(nomeCandidato) {
        // Implementar modal ou página de comparação
        window.location.href = `comparador.html?candidato=${encodeURIComponent(nomeCandidato)}`;
    }

    // Utilitários
    calcularSentimentoMedio(noticias) {
        if (!noticias.length) return 0;
        const soma = noticias.reduce((acc, noticia) => acc + (noticia.sentimento || 0), 0);
        return soma / noticias.length;
    }

    formatarSentimento(valor) {
        if (valor > 0.2) return 'positivo';
        if (valor < -0.2) return 'negativo';
        return 'neutro';
    }

    calcularRiscoImagem(noticias) {
        const negativas = noticias.filter(n => n.sentimento < -0.3).length;
        if (negativas >= 3) return 'alto';
        if (negativas >= 1) return 'medio';
        return 'baixo';
    }

    calcularTendenciaSoV(semanas) {
        if (semanas.length < 2) return 'estavel';
        const ultima = semanas[0];
        const anterior = semanas[1];
        // Implementar lógica de comparação
        return 'crescente';
    }

    getAlertaIcon(tipo) {
        const icons = {
            'queda_sentimento': '📉',
            'pico_mencoes': '📈',
            'mencoes_negativas': '⚠️',
            'oportunidade_tema': '💡',
            'pesquisa_nova': '🗳️'
        };
        return icons[tipo] || '📢';
    }

    formatarTimestamp(timestamp) {
        const data = new Date(timestamp);
        const agora = new Date();
        const diff = agora - data;
        
        if (diff < 60000) return 'Agora mesmo';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
        return data.toLocaleDateString('pt-BR');
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">${message}</span>
                    <button onclick="this.parentElement.style.display='none'" class="error-close">×</button>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    // Auto-atualização
    startAutoUpdate() {
        // Atualizar a cada 5 minutos
        setInterval(() => {
            this.loadKPIs();
            this.loadAlertas();
            this.renderKPIs();
            this.renderAlertas();
        }, 5 * 60 * 1000);
    }

    // Dados mock para fallback
    getMockCandidatos() {
        return [
            {
                id: 1,
                nome: "Celina Leão",
                cargo_atual: "Vice-Governadora",
                partido: "PP",
                foto_url: "/assets/images/candidatos/celina-leao.jpg",
                metricas: {
                    mencoes_semana: 15,
                    sentimento_geral: "positivo",
                    risco_imagem: "baixo",
                    ultima_pesquisa: "28.5%"
                }
            },
            {
                id: 2,
                nome: "Izalci Lucas",
                cargo_atual: "Senador",
                partido: "PSDB",
                foto_url: "/assets/images/candidatos/izalci-lucas.jpg",
                metricas: {
                    mencoes_semana: 12,
                    sentimento_geral: "neutro",
                    risco_imagem: "medio",
                    ultima_pesquisa: "24.0%"
                }
            }
        ];
    }

    getMockKPIs() {
        return {
            itens_processados: { valor: 47, trend: "+12%", cor: "success" },
            pesquisas_registradas: { valor: 6, trend: "+2", cor: "info" },
            fontes_alto_alcance: { valor: 5, trend: "=", cor: "warning" }
        };
    }

    getMockMetricas() {
        return {
            mencoes_semana: 0,
            sentimento_geral: "neutro",
            risco_imagem: "baixo",
            ultima_pesquisa: "N/D"
        };
    }
}

// Inicializar quando a página carregar
let dashboardManager;
document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
});

