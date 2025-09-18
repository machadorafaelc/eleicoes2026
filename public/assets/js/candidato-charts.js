// Candidato Charts - Gráficos para páginas individuais de candidatos
// Utiliza Chart.js para visualizações interativas

class CandidatoCharts {
    constructor(candidatoNome) {
        this.candidatoNome = candidatoNome;
        this.charts = {};
        this.colors = {
            primary: '#2563eb',
            secondary: '#7c3aed',
            success: '#059669',
            warning: '#d97706',
            danger: '#dc2626',
            info: '#0891b2',
            light: '#6b7280',
            dark: '#374151'
        };
        
        // Paleta de cores para temas
        this.themeColors = {
            'economia': '#2563eb',
            'segurança': '#dc2626', 
            'saúde': '#059669',
            'educação': '#7c3aed',
            'infraestrutura': '#d97706',
            'corrupção': '#ef4444',
            'costumes': '#8b5cf6',
            'outros': '#6b7280'
        };
        
        // Paleta de cores para retórica
        this.rhetoricColors = {
            'proposta': '#059669',
            'ataque': '#dc2626',
            'defesa': '#d97706',
            'neutra': '#6b7280'
        };
    }

    // A) Headline simples (texto dinâmico)
    async createWeeklySummary() {
        try {
            console.log(`📊 Criando resumo semanal para ${this.candidatoNome}...`);
            
            // Simular consulta SQL para resumo semanal
            const summaryData = await this.fetchWeeklySummaryData();
            
            const container = document.getElementById('weekly-summary');
            if (!container) {
                console.error('Container weekly-summary não encontrado');
                return;
            }

            // Criar HTML do resumo
            const summaryHTML = this.createWeeklySummaryHTML(summaryData);
            container.innerHTML = summaryHTML;
            
            console.log('✅ Resumo semanal criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar resumo semanal:', error);
        }
    }

    // B) SoV do candidato por tema (4 semanas)
    async createCandidateSovChart() {
        try {
            console.log(`📊 Criando gráfico SoV por tema para ${this.candidatoNome}...`);
            
            // Simular dados da view sov_normalizado filtrada por candidato
            const sovData = await this.fetchCandidateSovData();
            
            const ctx = document.getElementById('candidateSovChart');
            if (!ctx) {
                console.error('Canvas candidateSovChart não encontrado');
                return;
            }

            // Processar dados para o gráfico
            const processedData = this.processCandidateSovData(sovData);
            
            this.charts.candidateSov = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: processedData.weeks,
                    datasets: processedData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `Participação por tema (SoV) — ${this.candidatoNome} — últimas 4 semanas`,
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(1)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Semana'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Share of Voice'
                            },
                            ticks: {
                                callback: function(value) {
                                    return (value * 100).toFixed(0) + '%';
                                }
                            },
                            min: 0,
                            max: 1
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.4
                        },
                        point: {
                            radius: 4,
                            hoverRadius: 6
                        }
                    }
                }
            });
            
            console.log('✅ Gráfico SoV por tema criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar gráfico SoV por tema:', error);
        }
    }

    // C) Retórica do candidato (14d)
    async createCandidateRhetoricChart() {
        try {
            console.log(`📊 Criando gráfico de retórica para ${this.candidatoNome}...`);
            
            // Simular dados da view retorica_14d filtrada por candidato
            const rhetoricData = await this.fetchCandidateRhetoricData();
            
            const ctx = document.getElementById('candidateRhetoricChart');
            if (!ctx) {
                console.error('Canvas candidateRhetoricChart não encontrado');
                return;
            }

            // Processar dados para o gráfico
            const processedData = this.processCandidateRhetoricData(rhetoricData);
            
            this.charts.candidateRhetoric = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: processedData.rhetorics,
                    datasets: [{
                        data: processedData.percentages,
                        backgroundColor: processedData.colors,
                        borderColor: processedData.colors.map(color => color.replace('0.8', '1')),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `Retórica — ${this.candidatoNome} — 14 dias`,
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log('✅ Gráfico de retórica criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar gráfico de retórica:', error);
        }
    }

    // D) Feed de notícias (lista)
    async createNewsFeed() {
        try {
            console.log(`📊 Criando feed de notícias para ${this.candidatoNome}...`);
            
            // Simular dados da tabela midia_df filtrada por candidato
            const newsData = await this.fetchCandidateNewsData();
            
            const container = document.getElementById('news-feed');
            if (!container) {
                console.error('Container news-feed não encontrado');
                return;
            }

            // Processar dados para o feed
            const processedData = this.processCandidateNewsData(newsData);
            
            // Criar HTML do feed
            const feedHTML = this.createNewsFeedHTML(processedData);
            container.innerHTML = feedHTML;
            
            console.log('✅ Feed de notícias criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar feed de notícias:', error);
        }
    }

    // E) Pesquisas do candidato (30d)
    async createCandidatePollsTable() {
        try {
            console.log(`📊 Criando tabela de pesquisas para ${this.candidatoNome}...`);
            
            // Simular dados da view pesquisas_30d_flat filtrada por candidato
            const pollsData = await this.fetchCandidatePollsData();
            
            const container = document.getElementById('candidate-polls-table');
            if (!container) {
                console.error('Container candidate-polls-table não encontrado');
                return;
            }

            // Processar dados para a tabela
            const processedData = this.processCandidatePollsData(pollsData);
            
            // Criar HTML da tabela
            const tableHTML = this.createCandidatePollsTableHTML(processedData);
            container.innerHTML = tableHTML;
            
            console.log('✅ Tabela de pesquisas criada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar tabela de pesquisas:', error);
        }
    }

    // Métodos auxiliares para buscar dados (simulados)
    async fetchWeeklySummaryData() {
        // Simular consulta SQL para resumo semanal
        const mockData = {
            'Celina Leão': { itens_7d: 8, sent_7d: 0.15 },
            'Izalci Lucas': { itens_7d: 6, sent_7d: 0.05 },
            'Erika Kokay': { itens_7d: 7, sent_7d: -0.10 },
            'Damares Alves': { itens_7d: 5, sent_7d: -0.25 },
            'José Roberto Arruda': { itens_7d: 4, sent_7d: -0.35 }
        };
        
        return mockData[this.candidatoNome] || { itens_7d: 0, sent_7d: 0 };
    }

    async fetchCandidateSovData() {
        // Simular dados da view sov_normalizado para o candidato
        const mockData = {
            'Celina Leão': [
                { semana: '2025-08-25', tema: 'economia', sov: 0.30 },
                { semana: '2025-09-01', tema: 'economia', sov: 0.28 },
                { semana: '2025-09-08', tema: 'economia', sov: 0.32 },
                { semana: '2025-08-25', tema: 'segurança', sov: 0.25 },
                { semana: '2025-09-01', tema: 'segurança', sov: 0.30 },
                { semana: '2025-09-08', tema: 'segurança', sov: 0.28 }
            ],
            'Izalci Lucas': [
                { semana: '2025-08-25', tema: 'economia', sov: 0.22 },
                { semana: '2025-09-01', tema: 'economia', sov: 0.25 },
                { semana: '2025-09-08', tema: 'economia', sov: 0.20 },
                { semana: '2025-08-25', tema: 'educação', sov: 0.35 },
                { semana: '2025-09-01', tema: 'educação', sov: 0.32 },
                { semana: '2025-09-08', tema: 'educação', sov: 0.38 }
            ]
        };
        
        return mockData[this.candidatoNome] || [];
    }

    async fetchCandidateRhetoricData() {
        // Simular dados da view retorica_14d para o candidato
        const mockData = {
            'Celina Leão': [
                { retorica: 'proposta', pct: 75.0 },
                { retorica: 'defesa', pct: 20.0 },
                { retorica: 'neutra', pct: 5.0 }
            ],
            'Izalci Lucas': [
                { retorica: 'proposta', pct: 60.0 },
                { retorica: 'ataque', pct: 25.0 },
                { retorica: 'defesa', pct: 15.0 }
            ],
            'Erika Kokay': [
                { retorica: 'proposta', pct: 45.0 },
                { retorica: 'ataque', pct: 40.0 },
                { retorica: 'defesa', pct: 15.0 }
            ]
        };
        
        return mockData[this.candidatoNome] || [];
    }

    async fetchCandidateNewsData() {
        // Simular dados da tabela midia_df para o candidato
        return [
            {
                data_publicacao: '2025-09-15T10:30:00',
                fonte: 'Correio Braziliense',
                titulo: `${this.candidatoNome} apresenta propostas para o DF`,
                resumo: 'Candidato detalha plano de governo com foco em infraestrutura e saúde pública.',
                url: 'https://example.com/noticia1',
                sentimento: 0.2
            },
            {
                data_publicacao: '2025-09-14T15:45:00',
                fonte: 'Metrópoles',
                titulo: `Pesquisa mostra ${this.candidatoNome} em segundo lugar`,
                resumo: 'Levantamento do instituto Quaest indica crescimento nas intenções de voto.',
                url: 'https://example.com/noticia2',
                sentimento: 0.4
            },
            {
                data_publicacao: '2025-09-13T08:20:00',
                fonte: 'G1 DF',
                titulo: `${this.candidatoNome} participa de debate na TV`,
                resumo: 'Candidato defendeu propostas para educação e criticou gestão atual.',
                url: 'https://example.com/noticia3',
                sentimento: 0.1
            }
        ];
    }

    async fetchCandidatePollsData() {
        // Simular dados da view pesquisas_30d_flat para o candidato
        const mockIntencoes = {
            'Celina Leão': [28.0, 26.0, 30.0],
            'Izalci Lucas': [22.0, 24.0, 20.0],
            'Erika Kokay': [18.0, 20.0, 19.0],
            'Damares Alves': [16.0, 15.0, 17.0],
            'Leila Barros': [28.0, 30.0, 26.0]
        };
        
        const intencoes = mockIntencoes[this.candidatoNome] || [5.0, 6.0, 4.0];
        
        return [
            { data_campo: '2025-09-10', instituto: 'Datafolha', cenario: 'estimulado', intencao: intencoes[0] },
            { data_campo: '2025-09-08', instituto: 'Ipec', cenario: 'estimulado', intencao: intencoes[1] },
            { data_campo: '2025-09-05', instituto: 'Quaest', cenario: 'estimulado', intencao: intencoes[2] }
        ];
    }

    // Métodos de processamento de dados
    createWeeklySummaryHTML(data) {
        if (data.itens_7d === 0) {
            return `
                <div class="weekly-summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="summary-content">
                        <h4>Resumo Semanal</h4>
                        <p>Sem novidades relevantes na semana.</p>
                    </div>
                </div>
            `;
        }
        
        const sentimentoTexto = data.sent_7d > 0.1 ? 'positivo' : 
                              data.sent_7d < -0.1 ? 'negativo' : 'neutro';
        const sentimentoIcon = data.sent_7d > 0.1 ? 'fa-smile' : 
                              data.sent_7d < -0.1 ? 'fa-frown' : 'fa-meh';
        const sentimentoColor = data.sent_7d > 0.1 ? 'success' : 
                               data.sent_7d < -0.1 ? 'danger' : 'warning';
        
        return `
            <div class="weekly-summary-card">
                <div class="summary-icon ${sentimentoColor}">
                    <i class="fas ${sentimentoIcon}"></i>
                </div>
                <div class="summary-content">
                    <h4>Resumo Semanal</h4>
                    <p>Foram <strong>${data.itens_7d} itens</strong> na semana.</p>
                    <p>Sentimento médio: <strong>${data.sent_7d.toFixed(2)}</strong> (${sentimentoTexto})</p>
                </div>
            </div>
        `;
    }

    processCandidateSovData(data) {
        const weeks = [...new Set(data.map(d => d.semana))].sort();
        const themes = [...new Set(data.map(d => d.tema))];
        
        const datasets = themes.map(theme => ({
            label: theme.charAt(0).toUpperCase() + theme.slice(1),
            data: weeks.map(week => {
                const weekData = data.find(d => d.semana === week && d.tema === theme);
                return weekData ? weekData.sov : 0;
            }),
            borderColor: this.themeColors[theme] || this.colors.light,
            backgroundColor: (this.themeColors[theme] || this.colors.light) + '20',
            fill: true
        }));
        
        return { weeks, datasets };
    }

    processCandidateRhetoricData(data) {
        const rhetorics = data.map(d => d.retorica.charAt(0).toUpperCase() + d.retorica.slice(1));
        const percentages = data.map(d => d.pct);
        const colors = data.map(d => this.rhetoricColors[d.retorica] || this.colors.light);
        
        return { rhetorics, percentages, colors };
    }

    processCandidateNewsData(data) {
        return data.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
    }

    createNewsFeedHTML(data) {
        const items = data.map(item => {
            const sentimentIcon = item.sentimento > 0.1 ? 'fa-smile text-success' : 
                                 item.sentimento < -0.1 ? 'fa-frown text-danger' : 'fa-meh text-warning';
            
            return `
                <div class="news-item">
                    <div class="news-header">
                        <span class="news-source">${item.fonte}</span>
                        <span class="news-date">${this.formatDate(item.data_publicacao)}</span>
                        <i class="fas ${sentimentIcon}"></i>
                    </div>
                    <h5 class="news-title">
                        <a href="${item.url}" target="_blank">${item.titulo}</a>
                    </h5>
                    <p class="news-summary">${item.resumo}</p>
                </div>
            `;
        }).join('');
        
        return `
            <div class="news-feed-container">
                ${items}
            </div>
        `;
    }

    processCandidatePollsData(data) {
        return data.sort((a, b) => new Date(b.data_campo) - new Date(a.data_campo));
    }

    createCandidatePollsTableHTML(data) {
        const rows = data.map(row => `
            <tr>
                <td>${this.formatDate(row.data_campo)}</td>
                <td><span class="badge badge-institute">${row.instituto}</span></td>
                <td><span class="badge badge-scenario">${row.cenario}</span></td>
                <td><strong>${row.intencao.toFixed(1)}%</strong></td>
            </tr>
        `).join('');
        
        return `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Data</th>
                            <th>Instituto</th>
                            <th>Cenário</th>
                            <th>Intenção</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Método principal para inicializar todos os componentes
    async initializeAllComponents() {
        console.log(`🚀 Inicializando todos os componentes para ${this.candidatoNome}...`);
        
        try {
            await Promise.all([
                this.createWeeklySummary(),
                this.createCandidateSovChart(),
                this.createCandidateRhetoricChart(),
                this.createNewsFeed(),
                this.createCandidatePollsTable()
            ]);
            
            console.log('✅ Todos os componentes inicializados com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar componentes:', error);
        }
    }

    // Método para atualizar todos os componentes
    async refreshAllComponents() {
        console.log(`🔄 Atualizando todos os componentes para ${this.candidatoNome}...`);
        
        // Destruir gráficos existentes
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        
        // Recriar componentes
        await this.initializeAllComponents();
    }
}

// Função para inicializar gráficos do candidato (será chamada pelas páginas individuais)
function initializeCandidateCharts(candidatoNome) {
    console.log(`📊 Inicializando gráficos para candidato: ${candidatoNome}`);
    
    // Criar instância global para o candidato
    window.candidatoCharts = new CandidatoCharts(candidatoNome);
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.candidatoCharts.initializeAllComponents();
        });
    } else {
        window.candidatoCharts.initializeAllComponents();
    }
}

// Função para atualizar gráficos (pode ser chamada externamente)
function refreshCandidateCharts() {
    if (window.candidatoCharts) {
        window.candidatoCharts.refreshAllComponents();
    }
}

