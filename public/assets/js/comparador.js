// Comparador de Dois Candidatos - Dashboard Geral
// Permite comparação visual de Share of Voice por tema entre dois candidatos

class ComparadorCandidatos {
    constructor() {
        this.chart = null;
        this.candidatos = [];
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
        
        // Paleta de cores para candidatos (A e B)
        this.candidateColors = {
            'A': {
                'economia': '#2563eb',
                'segurança': '#dc2626', 
                'saúde': '#059669',
                'educação': '#7c3aed',
                'infraestrutura': '#d97706',
                'corrupção': '#ef4444',
                'costumes': '#8b5cf6',
                'outros': '#6b7280'
            },
            'B': {
                'economia': '#3b82f6',
                'segurança': '#f87171', 
                'saúde': '#34d399',
                'educação': '#a78bfa',
                'infraestrutura': '#fbbf24',
                'corrupção': '#fb7185',
                'costumes': '#c084fc',
                'outros': '#9ca3af'
            }
        };
    }

    // Inicializar o comparador
    async initialize() {
        try {
            console.log('🔄 Inicializando comparador de candidatos...');
            
            // Carregar lista de candidatos
            await this.loadCandidates();
            
            // Criar interface do comparador
            this.createComparatorInterface();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            console.log('✅ Comparador inicializado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar comparador:', error);
        }
    }

    // Carregar lista de candidatos (simulado)
    async loadCandidates() {
        // Simular consulta SQL: "SELECT DISTINCT candidato FROM midia_df ORDER BY candidato"
        this.candidatos = [
            'Alberto Fraga',
            'Celina Leão',
            'Damares Alves',
            'Erika Kokay',
            'Fábio Félix',
            'Izalci Lucas',
            'José Roberto Arruda',
            'Leandro Grass',
            'Leila Barros',
            'Paula Belmonte'
        ];
        
        console.log(`📋 ${this.candidatos.length} candidatos carregados`);
    }

    // Criar interface do comparador
    createComparatorInterface() {
        const container = document.getElementById('comparador-container');
        if (!container) {
            console.error('Container comparador-container não encontrado');
            return;
        }

        const html = `
            <div class="comparador-section">
                <div class="section-header">
                    <h2><i class="fas fa-balance-scale"></i> Comparar dois candidatos — SoV por tema (28d)</h2>
                    <p class="section-description">Útil para reuniões - Compare o Share of Voice por tema entre dois candidatos</p>
                </div>
                
                <div class="comparador-controls">
                    <div class="candidate-selector">
                        <label for="cand_a">Candidato A:</label>
                        <select id="cand_a" class="form-select">
                            <option value="">Selecione o primeiro candidato</option>
                            ${this.candidatos.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="vs-divider">
                        <span class="vs-text">VS</span>
                    </div>
                    
                    <div class="candidate-selector">
                        <label for="cand_b">Candidato B:</label>
                        <select id="cand_b" class="form-select">
                            <option value="">Selecione o segundo candidato</option>
                            ${this.candidatos.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="compare-actions">
                        <button id="btn-compare" class="btn btn-primary" disabled>
                            <i class="fas fa-chart-line"></i>
                            Comparar
                        </button>
                        <button id="btn-reset" class="btn btn-secondary">
                            <i class="fas fa-redo"></i>
                            Limpar
                        </button>
                    </div>
                </div>
                
                <div id="comparison-result" class="comparison-result" style="display: none;">
                    <div class="chart-container">
                        <canvas id="comparisonChart"></canvas>
                    </div>
                    
                    <div class="comparison-summary">
                        <div class="summary-cards">
                            <div class="summary-card candidate-a">
                                <h4 id="summary-cand-a-name">Candidato A</h4>
                                <div class="summary-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Tema Dominante</span>
                                        <span class="metric-value" id="summary-cand-a-tema">-</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">SoV Médio</span>
                                        <span class="metric-value" id="summary-cand-a-sov">-</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="summary-card candidate-b">
                                <h4 id="summary-cand-b-name">Candidato B</h4>
                                <div class="summary-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Tema Dominante</span>
                                        <span class="metric-value" id="summary-cand-b-tema">-</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">SoV Médio</span>
                                        <span class="metric-value" id="summary-cand-b-sov">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comparison-insights">
                            <h4><i class="fas fa-lightbulb"></i> Insights da Comparação</h4>
                            <div id="insights-content">
                                <p>Selecione dois candidatos para ver insights da comparação.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // Configurar event listeners
    setupEventListeners() {
        const candASelect = document.getElementById('cand_a');
        const candBSelect = document.getElementById('cand_b');
        const compareBtn = document.getElementById('btn-compare');
        const resetBtn = document.getElementById('btn-reset');

        // Validar seleção e habilitar botão
        const validateSelection = () => {
            const candA = candASelect.value;
            const candB = candBSelect.value;
            const isValid = candA && candB && candA !== candB;
            
            compareBtn.disabled = !isValid;
            
            if (candA && candB && candA === candB) {
                this.showMessage('Selecione dois candidatos diferentes', 'warning');
            }
        };

        candASelect.addEventListener('change', validateSelection);
        candBSelect.addEventListener('change', validateSelection);

        // Botão comparar
        compareBtn.addEventListener('click', () => {
            const candA = candASelect.value;
            const candB = candBSelect.value;
            
            if (candA && candB && candA !== candB) {
                this.performComparison(candA, candB);
            }
        });

        // Botão reset
        resetBtn.addEventListener('click', () => {
            this.resetComparison();
        });
    }

    // Realizar comparação
    async performComparison(candA, candB) {
        try {
            console.log(`🔄 Comparando ${candA} vs ${candB}...`);
            
            // Mostrar loading
            this.showLoading();
            
            // Buscar dados da comparação
            const comparisonData = await this.fetchComparisonData(candA, candB);
            
            // Criar gráfico de comparação
            this.createComparisonChart(comparisonData, candA, candB);
            
            // Atualizar resumo
            this.updateComparisonSummary(comparisonData, candA, candB);
            
            // Gerar insights
            this.generateInsights(comparisonData, candA, candB);
            
            // Mostrar resultado
            document.getElementById('comparison-result').style.display = 'block';
            
            console.log('✅ Comparação realizada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao realizar comparação:', error);
            this.showMessage('Erro ao realizar comparação', 'error');
        }
    }

    // Buscar dados da comparação (simulado)
    async fetchComparisonData(candA, candB) {
        // Simular consulta da view sov_normalizado com filtro
        // "(candidato = {{cand_a}} OR candidato = {{cand_b}}) AND semana >= NOW() - INTERVAL '28 days'"
        
        const mockData = {
            [candA]: [
                { semana: '2025-08-18', tema: 'economia', sov: 0.25 },
                { semana: '2025-08-25', tema: 'economia', sov: 0.30 },
                { semana: '2025-09-01', tema: 'economia', sov: 0.28 },
                { semana: '2025-09-08', tema: 'economia', sov: 0.32 },
                { semana: '2025-08-18', tema: 'segurança', sov: 0.20 },
                { semana: '2025-08-25', tema: 'segurança', sov: 0.25 },
                { semana: '2025-09-01', tema: 'segurança', sov: 0.30 },
                { semana: '2025-09-08', tema: 'segurança', sov: 0.28 },
                { semana: '2025-08-18', tema: 'saúde', sov: 0.15 },
                { semana: '2025-08-25', tema: 'saúde', sov: 0.18 },
                { semana: '2025-09-01', tema: 'saúde', sov: 0.22 },
                { semana: '2025-09-08', tema: 'saúde', sov: 0.20 }
            ],
            [candB]: [
                { semana: '2025-08-18', tema: 'economia', sov: 0.18 },
                { semana: '2025-08-25', tema: 'economia', sov: 0.22 },
                { semana: '2025-09-01', tema: 'economia', sov: 0.20 },
                { semana: '2025-09-08', tema: 'economia', sov: 0.25 },
                { semana: '2025-08-18', tema: 'segurança', sov: 0.12 },
                { semana: '2025-08-25', tema: 'segurança', sov: 0.15 },
                { semana: '2025-09-01', tema: 'segurança', sov: 0.18 },
                { semana: '2025-09-08', tema: 'segurança', sov: 0.20 },
                { semana: '2025-08-18', tema: 'educação', sov: 0.25 },
                { semana: '2025-08-25', tema: 'educação', sov: 0.30 },
                { semana: '2025-09-01', tema: 'educação', sov: 0.28 },
                { semana: '2025-09-08', tema: 'educação', sov: 0.32 }
            ]
        };
        
        return mockData;
    }

    // Criar gráfico de comparação
    createComparisonChart(data, candA, candB) {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) {
            console.error('Canvas comparisonChart não encontrado');
            return;
        }

        // Destruir gráfico anterior se existir
        if (this.chart) {
            this.chart.destroy();
        }

        // Processar dados para o gráfico
        const processedData = this.processComparisonData(data, candA, candB);
        
        this.chart = new Chart(ctx, {
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
                        text: `Comparação SoV por tema: ${candA} vs ${candB} (28 dias)`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
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
                        max: 0.4
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
    }

    // Processar dados para o gráfico
    processComparisonData(data, candA, candB) {
        const weeks = [...new Set([
            ...data[candA].map(d => d.semana),
            ...data[candB].map(d => d.semana)
        ])].sort();
        
        const themesA = [...new Set(data[candA].map(d => d.tema))];
        const themesB = [...new Set(data[candB].map(d => d.tema))];
        const allThemes = [...new Set([...themesA, ...themesB])];
        
        const datasets = [];
        
        // Datasets para candidato A
        allThemes.forEach(theme => {
            const themeDataA = data[candA].filter(d => d.tema === theme);
            if (themeDataA.length > 0) {
                datasets.push({
                    label: `${candA} - ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
                    data: weeks.map(week => {
                        const weekData = themeDataA.find(d => d.semana === week);
                        return weekData ? weekData.sov : 0;
                    }),
                    borderColor: this.candidateColors.A[theme] || this.colors.primary,
                    backgroundColor: (this.candidateColors.A[theme] || this.colors.primary) + '20',
                    borderWidth: 3,
                    borderDash: []
                });
            }
        });
        
        // Datasets para candidato B
        allThemes.forEach(theme => {
            const themeDataB = data[candB].filter(d => d.tema === theme);
            if (themeDataB.length > 0) {
                datasets.push({
                    label: `${candB} - ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
                    data: weeks.map(week => {
                        const weekData = themeDataB.find(d => d.semana === week);
                        return weekData ? weekData.sov : 0;
                    }),
                    borderColor: this.candidateColors.B[theme] || this.colors.secondary,
                    backgroundColor: (this.candidateColors.B[theme] || this.colors.secondary) + '20',
                    borderWidth: 3,
                    borderDash: [5, 5]
                });
            }
        });
        
        return { weeks, datasets };
    }

    // Atualizar resumo da comparação
    updateComparisonSummary(data, candA, candB) {
        // Calcular métricas para candidato A
        const metricsA = this.calculateCandidateMetrics(data[candA]);
        document.getElementById('summary-cand-a-name').textContent = candA;
        document.getElementById('summary-cand-a-tema').textContent = metricsA.dominantTheme;
        document.getElementById('summary-cand-a-sov').textContent = (metricsA.avgSov * 100).toFixed(1) + '%';
        
        // Calcular métricas para candidato B
        const metricsB = this.calculateCandidateMetrics(data[candB]);
        document.getElementById('summary-cand-b-name').textContent = candB;
        document.getElementById('summary-cand-b-tema').textContent = metricsB.dominantTheme;
        document.getElementById('summary-cand-b-sov').textContent = (metricsB.avgSov * 100).toFixed(1) + '%';
    }

    // Calcular métricas do candidato
    calculateCandidateMetrics(candidateData) {
        // Agrupar por tema
        const themeGroups = {};
        candidateData.forEach(item => {
            if (!themeGroups[item.tema]) {
                themeGroups[item.tema] = [];
            }
            themeGroups[item.tema].push(item.sov);
        });
        
        // Calcular média por tema
        const themeAvgs = {};
        Object.keys(themeGroups).forEach(theme => {
            const values = themeGroups[theme];
            themeAvgs[theme] = values.reduce((sum, val) => sum + val, 0) / values.length;
        });
        
        // Encontrar tema dominante
        const dominantTheme = Object.keys(themeAvgs).reduce((a, b) => 
            themeAvgs[a] > themeAvgs[b] ? a : b
        );
        
        // Calcular SoV médio geral
        const allValues = candidateData.map(item => item.sov);
        const avgSov = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
        
        return {
            dominantTheme: dominantTheme.charAt(0).toUpperCase() + dominantTheme.slice(1),
            avgSov: avgSov,
            themeAvgs: themeAvgs
        };
    }

    // Gerar insights da comparação
    generateInsights(data, candA, candB) {
        const metricsA = this.calculateCandidateMetrics(data[candA]);
        const metricsB = this.calculateCandidateMetrics(data[candB]);
        
        const insights = [];
        
        // Comparar SoV médio
        if (metricsA.avgSov > metricsB.avgSov) {
            const diff = ((metricsA.avgSov - metricsB.avgSov) * 100).toFixed(1);
            insights.push(`📈 <strong>${candA}</strong> tem ${diff}pp a mais de Share of Voice médio que ${candB}.`);
        } else if (metricsB.avgSov > metricsA.avgSov) {
            const diff = ((metricsB.avgSov - metricsA.avgSov) * 100).toFixed(1);
            insights.push(`📈 <strong>${candB}</strong> tem ${diff}pp a mais de Share of Voice médio que ${candA}.`);
        } else {
            insights.push(`⚖️ Ambos os candidatos têm Share of Voice médio similar.`);
        }
        
        // Comparar temas dominantes
        if (metricsA.dominantTheme !== metricsB.dominantTheme) {
            insights.push(`🎯 <strong>${candA}</strong> domina em <em>${metricsA.dominantTheme}</em>, enquanto <strong>${candB}</strong> domina em <em>${metricsB.dominantTheme}</em>.`);
        } else {
            insights.push(`🤝 Ambos os candidatos têm o mesmo tema dominante: <em>${metricsA.dominantTheme}</em>.`);
        }
        
        // Análise de tendência (última vs primeira semana)
        const firstWeek = Math.min(...data[candA].map(d => new Date(d.semana).getTime()));
        const lastWeek = Math.max(...data[candA].map(d => new Date(d.semana).getTime()));
        
        const firstWeekDataA = data[candA].filter(d => new Date(d.semana).getTime() === firstWeek);
        const lastWeekDataA = data[candA].filter(d => new Date(d.semana).getTime() === lastWeek);
        const firstWeekDataB = data[candB].filter(d => new Date(d.semana).getTime() === firstWeek);
        const lastWeekDataB = data[candB].filter(d => new Date(d.semana).getTime() === lastWeek);
        
        const avgFirstA = firstWeekDataA.reduce((sum, d) => sum + d.sov, 0) / firstWeekDataA.length;
        const avgLastA = lastWeekDataA.reduce((sum, d) => sum + d.sov, 0) / lastWeekDataA.length;
        const avgFirstB = firstWeekDataB.reduce((sum, d) => sum + d.sov, 0) / firstWeekDataB.length;
        const avgLastB = lastWeekDataB.reduce((sum, d) => sum + d.sov, 0) / lastWeekDataB.length;
        
        const trendA = avgLastA - avgFirstA;
        const trendB = avgLastB - avgFirstB;
        
        if (trendA > 0.02 && trendB > 0.02) {
            insights.push(`📈 Ambos os candidatos estão em <strong>tendência de crescimento</strong> no período.`);
        } else if (trendA < -0.02 && trendB < -0.02) {
            insights.push(`📉 Ambos os candidatos estão em <strong>tendência de queda</strong> no período.`);
        } else if (trendA > 0.02) {
            insights.push(`📈 <strong>${candA}</strong> está em tendência de crescimento, enquanto ${candB} mantém estabilidade.`);
        } else if (trendB > 0.02) {
            insights.push(`📈 <strong>${candB}</strong> está em tendência de crescimento, enquanto ${candA} mantém estabilidade.`);
        } else {
            insights.push(`📊 Ambos os candidatos mantêm <strong>estabilidade</strong> no Share of Voice.`);
        }
        
        // Recomendação estratégica
        if (metricsA.avgSov > metricsB.avgSov) {
            insights.push(`💡 <strong>Recomendação:</strong> ${candB} pode se beneficiar de maior presença em ${metricsA.dominantTheme} para competir com ${candA}.`);
        } else {
            insights.push(`💡 <strong>Recomendação:</strong> ${candA} pode se beneficiar de maior presença em ${metricsB.dominantTheme} para competir com ${candB}.`);
        }
        
        document.getElementById('insights-content').innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
    }

    // Resetar comparação
    resetComparison() {
        document.getElementById('cand_a').value = '';
        document.getElementById('cand_b').value = '';
        document.getElementById('btn-compare').disabled = true;
        document.getElementById('comparison-result').style.display = 'none';
        
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        console.log('🔄 Comparação resetada');
    }

    // Mostrar loading
    showLoading() {
        const resultDiv = document.getElementById('comparison-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando comparação...</p>
            </div>
        `;
    }

    // Mostrar mensagem
    showMessage(message, type = 'info') {
        const alertClass = type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 
                          type === 'success' ? 'alert-success' : 'alert-info';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.getElementById('comparador-container');
        container.insertAdjacentHTML('afterbegin', alertHtml);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }
}

// Função para inicializar o comparador (será chamada pelo dashboard)
function initializeComparador() {
    console.log('🚀 Inicializando comparador de candidatos...');
    
    // Criar instância global
    window.comparadorCandidatos = new ComparadorCandidatos();
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.comparadorCandidatos.initialize();
        });
    } else {
        window.comparadorCandidatos.initialize();
    }
}

// Auto-inicializar se o script for carregado diretamente
if (typeof window !== 'undefined' && document.getElementById('comparador-container')) {
    initializeComparador();
}

