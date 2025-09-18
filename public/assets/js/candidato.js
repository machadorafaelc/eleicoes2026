// JavaScript para páginas individuais de candidatos

function initCandidatePage(candidato) {
    console.log(`Inicializando página do candidato: ${candidato.nome}`);
    
    // Inicializar gráficos
    initTemasChart();
    initRetoricaChart();
    initRiscoChart();
    
    // Atualizar última atualização
    updateLastUpdate();
}

function initTemasChart() {
    const ctx = document.getElementById('temasChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gestão Pública', 'Desenvolvimento Econômico', 'Políticas Sociais', 'Infraestrutura'],
            datasets: [{
                data: [35, 28, 22, 15],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function initRetoricaChart() {
    const ctx = document.getElementById('retoricaChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [
                {
                    label: 'Tom Propositivo',
                    data: [75, 80, 85, 78, 82, 70, 65],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Tom Crítico',
                    data: [15, 12, 10, 18, 14, 20, 25],
                    borderColor: '#f5576c',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Tom Neutro',
                    data: [10, 8, 5, 4, 4, 10, 10],
                    borderColor: '#6c757d',
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initRiscoChart() {
    const ctx = document.getElementById('riscoChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Menções Negativas', 'Controvérsias', 'Críticas à Gestão', 'Fake News', 'Ataques Pessoais'],
            datasets: [{
                label: 'Nível de Risco',
                data: [3, 0, 2, 1, 0],
                backgroundColor: [
                    '#28a745',  // Verde para baixo
                    '#28a745',  // Verde para baixo
                    '#ffc107',  // Amarelo para médio
                    '#28a745',  // Verde para baixo
                    '#28a745'   // Verde para baixo
                ],
                borderColor: [
                    '#1e7e34',
                    '#1e7e34',
                    '#e0a800',
                    '#1e7e34',
                    '#1e7e34'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateLastUpdate() {
    const element = document.getElementById('last-update');
    if (element) {
        element.textContent = new Date().toLocaleDateString('pt-BR');
    }
}

// Funções utilitárias para candidatos
const CandidateUtils = {
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    getSentimentClass: (sentiment) => {
        switch(sentiment.toLowerCase()) {
            case 'positivo': return 'sentiment-positivo';
            case 'negativo': return 'sentiment-negativo';
            default: return 'sentiment-neutro';
        }
    },
    
    getRiskLevel: (score) => {
        if (score <= 3) return 'baixo';
        if (score <= 6) return 'medio';
        return 'alto';
    }
};

// Exportar para uso global
window.CandidateUtils = CandidateUtils;

