// Dashboard Charts - Gráficos para o Dashboard Geral
// Utiliza Chart.js para visualizações interativas

class DashboardCharts {
    constructor() {
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
        
        // Paleta de cores para candidatos
        this.candidateColors = [
            '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
            '#0891b2', '#ef4444', '#8b5cf6', '#f59e0b', '#10b981'
        ];
    }

    // A) Share of Voice por tema (últimas 4 semanas)
    async createSovByThemeChart() {
        try {
            console.log('📊 Criando gráfico Share of Voice por tema...');
            
            // Simular dados da view sov_normalizado (últimas 4 semanas)
            const sovData = await this.fetchSovNormalizadoData();
            
            const ctx = document.getElementById('sovByThemeChart');
            if (!ctx) {
                console.error('Canvas sovByThemeChart não encontrado');
                return;
            }

            // Processar dados para o gráfico
            const processedData = this.processSovByThemeData(sovData);
            
            this.charts.sovByTheme = new Chart(ctx, {
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
                            text: 'Share of Voice por tema (4 semanas)',
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
            
            console.log('✅ Gráfico Share of Voice criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar gráfico Share of Voice:', error);
        }
    }

    // B) Distribuição de retórica (14d)
    async createRhetoricDistributionChart() {
        try {
            console.log('📊 Criando gráfico Distribuição de retórica...');
            
            // Simular dados da view retorica_14d
            const rhetoricData = await this.fetchRetorica14dData();
            
            const ctx = document.getElementById('rhetoricDistributionChart');
            if (!ctx) {
                console.error('Canvas rhetoricDistributionChart não encontrado');
                return;
            }

            // Processar dados para o gráfico
            const processedData = this.processRhetoricDistributionData(rhetoricData);
            
            this.charts.rhetoricDistribution = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: processedData.candidates,
                    datasets: processedData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Retórica por candidato (14 dias)',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Candidato'
                            },
                            ticks: {
                                maxRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Percentual (%)'
                            },
                            stacked: true,
                            min: 0,
                            max: 100
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    }
                }
            });
            
            console.log('✅ Gráfico Distribuição de retórica criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar gráfico Distribuição de retórica:', error);
        }
    }

    // C) Radar de risco (7d)
    async createRiskRadarChart() {
        try {
            console.log('📊 Criando gráfico Radar de risco...');
            
            // Simular dados da view risco_negativo_7d
            const riskData = await this.fetchRiscoNegativo7dData();
            
            const ctx = document.getElementById('riskRadarChart');
            if (!ctx) {
                console.error('Canvas riskRadarChart não encontrado');
                return;
            }

            // Processar dados para o gráfico
            const processedData = this.processRiskRadarData(riskData);
            
            this.charts.riskRadar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: processedData.candidates,
                    datasets: [{
                        label: 'Menções Negativas (Alto Alcance)',
                        data: processedData.riskValues,
                        backgroundColor: processedData.colors,
                        borderColor: processedData.colors.map(color => color.replace('0.7', '1')),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Risco de imagem (menções negativas de alto alcance - 7 dias)',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    let riskLevel = 'BAIXO';
                                    if (value >= 5) riskLevel = 'CRÍTICO';
                                    else if (value >= 3) riskLevel = 'ALTO';
                                    else if (value >= 1) riskLevel = 'MÉDIO';
                                    
                                    return [
                                        `Menções negativas: ${value}`,
                                        `Nível de risco: ${riskLevel}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Candidato'
                            },
                            ticks: {
                                maxRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Menções Negativas'
                            },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
            
            console.log('✅ Gráfico Radar de risco criado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar gráfico Radar de risco:', error);
        }
    }

    // D) Tabela de pesquisas recentes (30d)
    async createRecentPollsTable() {
        try {
            console.log('📊 Criando tabela de pesquisas recentes...');
            
            // Simular dados da view pesquisas_30d_flat
            const pollsData = await this.fetchPesquisas30dFlatData();
            
            const container = document.getElementById('recentPollsTable');
            if (!container) {
                console.error('Container recentPollsTable não encontrado');
                return;
            }

            // Processar dados para a tabela
            const processedData = this.processRecentPollsData(pollsData);
            
            // Criar HTML da tabela
            const tableHTML = this.createPollsTableHTML(processedData);
            container.innerHTML = tableHTML;
            
            console.log('✅ Tabela de pesquisas recentes criada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao criar tabela de pesquisas recentes:', error);
        }
    }

    // Métodos auxiliares para buscar dados (simulados)
    async fetchSovNormalizadoData() {
        // Simular dados da view sov_normalizado
        return [
            { candidato: 'Celina Leão', semana: '2025-09-08', tema: 'economia', sov: 0.25 },
            { candidato: 'Izalci Lucas', semana: '2025-09-08', tema: 'economia', sov: 0.20 },
            { candidato: 'Erika Kokay', semana: '2025-09-08', tema: 'economia', sov: 0.18 },
            { candidato: 'Celina Leão', semana: '2025-09-08', tema: 'segurança', sov: 0.30 },
            { candidato: 'Damares Alves', semana: '2025-09-08', tema: 'segurança', sov: 0.25 },
            { candidato: 'José Roberto Arruda', semana: '2025-09-08', tema: 'segurança', sov: 0.20 },
            { candidato: 'Erika Kokay', semana: '2025-09-08', tema: 'saúde', sov: 0.35 },
            { candidato: 'Celina Leão', semana: '2025-09-08', tema: 'saúde', sov: 0.25 },
            { candidato: 'Leila Barros', semana: '2025-09-08', tema: 'saúde', sov: 0.20 }
        ];
    }

    async fetchRetorica14dData() {
        // Simular dados da view retorica_14d
        return [
            { candidato: 'Celina Leão', retorica: 'proposta', qtd: 8, pct: 80.0 },
            { candidato: 'Celina Leão', retorica: 'defesa', qtd: 2, pct: 20.0 },
            { candidato: 'Izalci Lucas', retorica: 'proposta', qtd: 6, pct: 75.0 },
            { candidato: 'Izalci Lucas', retorica: 'ataque', qtd: 2, pct: 25.0 },
            { candidato: 'Erika Kokay', retorica: 'proposta', qtd: 5, pct: 62.5 },
            { candidato: 'Erika Kokay', retorica: 'ataque', qtd: 3, pct: 37.5 },
            { candidato: 'Damares Alves', retorica: 'defesa', qtd: 4, pct: 66.7 },
            { candidato: 'Damares Alves', retorica: 'proposta', qtd: 2, pct: 33.3 }
        ];
    }

    async fetchRiscoNegativo7dData() {
        // Simular dados da view risco_negativo_7d
        return [
            { candidato: 'José Roberto Arruda', men_negativas_alc: 3, sentimento_medio: -0.45 },
            { candidato: 'Damares Alves', men_negativas_alc: 2, sentimento_medio: -0.35 },
            { candidato: 'Erika Kokay', men_negativas_alc: 1, sentimento_medio: -0.25 }
        ];
    }

    async fetchPesquisas30dFlatData() {
        // Simular dados da view pesquisas_30d_flat
        return [
            { data_campo: '2025-09-10', instituto: 'Datafolha', cenario: 'estimulado', candidato: 'Celina Leão', intencao: 28.0 },
            { data_campo: '2025-09-10', instituto: 'Datafolha', cenario: 'estimulado', candidato: 'Izalci Lucas', intencao: 22.0 },
            { data_campo: '2025-09-10', instituto: 'Datafolha', cenario: 'estimulado', candidato: 'Erika Kokay', intencao: 18.0 },
            { data_campo: '2025-09-08', instituto: 'Ipec', cenario: 'estimulado', candidato: 'Celina Leão', intencao: 26.0 },
            { data_campo: '2025-09-08', instituto: 'Ipec', cenario: 'estimulado', candidato: 'Izalci Lucas', intencao: 24.0 },
            { data_campo: '2025-09-08', instituto: 'Ipec', cenario: 'estimulado', candidato: 'Erika Kokay', intencao: 20.0 },
            { data_campo: '2025-09-05', instituto: 'Quaest', cenario: 'estimulado', candidato: 'Celina Leão', intencao: 30.0 },
            { data_campo: '2025-09-05', instituto: 'Quaest', cenario: 'estimulado', candidato: 'Izalci Lucas', intencao: 20.0 },
            { data_campo: '2025-09-05', instituto: 'Quaest', cenario: 'estimulado', candidato: 'Erika Kokay', intencao: 19.0 }
        ];
    }

    // Métodos de processamento de dados
    processSovByThemeData(data) {
        const weeks = [...new Set(data.map(d => d.semana))].sort();
        const themes = [...new Set(data.map(d => d.tema))];
        
        const datasets = themes.map(theme => ({
            label: theme.charAt(0).toUpperCase() + theme.slice(1),
            data: weeks.map(week => {
                const weekData = data.filter(d => d.semana === week && d.tema === theme);
                return weekData.reduce((sum, d) => sum + d.sov, 0);
            }),
            borderColor: this.themeColors[theme] || this.colors.light,
            backgroundColor: (this.themeColors[theme] || this.colors.light) + '20',
            fill: true
        }));
        
        return { weeks, datasets };
    }

    processRhetoricDistributionData(data) {
        const candidates = [...new Set(data.map(d => d.candidato))];
        const rhetorics = [...new Set(data.map(d => d.retorica))];
        
        const datasets = rhetorics.map(rhetoric => ({
            label: rhetoric.charAt(0).toUpperCase() + rhetoric.slice(1),
            data: candidates.map(candidate => {
                const candidateData = data.find(d => d.candidato === candidate && d.retorica === rhetoric);
                return candidateData ? candidateData.pct : 0;
            }),
            backgroundColor: this.rhetoricColors[rhetoric] || this.colors.light
        }));
        
        return { candidates, datasets };
    }

    processRiskRadarData(data) {
        const candidates = data.map(d => d.candidato);
        const riskValues = data.map(d => d.men_negativas_alc);
        
        const colors = riskValues.map(value => {
            if (value >= 5) return 'rgba(220, 38, 38, 0.7)'; // Crítico - vermelho
            if (value >= 3) return 'rgba(245, 158, 11, 0.7)'; // Alto - laranja
            if (value >= 1) return 'rgba(251, 191, 36, 0.7)'; // Médio - amarelo
            return 'rgba(107, 114, 128, 0.7)'; // Baixo - cinza
        });
        
        return { candidates, riskValues, colors };
    }

    processRecentPollsData(data) {
        // Ordenar por data_campo desc, instituto asc, candidato asc
        return data.sort((a, b) => {
            if (a.data_campo !== b.data_campo) {
                return new Date(b.data_campo) - new Date(a.data_campo);
            }
            if (a.instituto !== b.instituto) {
                return a.instituto.localeCompare(b.instituto);
            }
            return a.candidato.localeCompare(b.candidato);
        });
    }

    createPollsTableHTML(data) {
        const rows = data.map(row => `
            <tr>
                <td>${this.formatDate(row.data_campo)}</td>
                <td><span class="badge badge-institute">${row.instituto}</span></td>
                <td><span class="badge badge-scenario">${row.cenario}</span></td>
                <td>${row.candidato}</td>
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
                            <th>Candidato</th>
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

    // Método principal para inicializar todos os gráficos
    async initializeAllCharts() {
        console.log('🚀 Inicializando todos os gráficos do dashboard...');
        
        try {
            await Promise.all([
                this.createSovByThemeChart(),
                this.createRhetoricDistributionChart(),
                this.createRiskRadarChart(),
                this.createRecentPollsTable()
            ]);
            
            console.log('✅ Todos os gráficos inicializados com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    }

    // Método para atualizar todos os gráficos
    async refreshAllCharts() {
        console.log('🔄 Atualizando todos os gráficos...');
        
        // Destruir gráficos existentes
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        
        // Recriar gráficos
        await this.initializeAllCharts();
    }
}

// Instância global
window.dashboardCharts = new DashboardCharts();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 DOM carregado, inicializando gráficos do dashboard...');
    window.dashboardCharts.initializeAllCharts();
});

// Função para atualizar gráficos (pode ser chamada externamente)
function refreshDashboardCharts() {
    if (window.dashboardCharts) {
        window.dashboardCharts.refreshAllCharts();
    }
}

