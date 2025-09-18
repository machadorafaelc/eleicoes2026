// JavaScript para página de pesquisas

class PesquisasManager {
    constructor() {
        this.pesquisas = [];
        this.pesquisasFiltradas = [];
        this.paginaAtual = 1;
        this.itensPorPagina = 10;
        this.chart = null;
        
        this.init();
    }

    init() {
        this.carregarDados();
        this.setupEventListeners();
        this.renderizarTabela();
        this.atualizarEstatisticas();
    }

    carregarDados() {
        // Dados mockados para demonstração
        this.pesquisas = [
            {
                id: "pesq_001",
                instituto: "Datafolha",
                local: "DF",
                data_campo: "2025-09-10",
                amostra: 1200,
                margem: 3,
                metodologia: "telefonica",
                cenario: "estimulado",
                resultado_json: [
                    {"candidato": "Celina Leão", "intencao": 28},
                    {"candidato": "Erika Kokay", "intencao": 22},
                    {"candidato": "Izalci Lucas", "intencao": 18},
                    {"candidato": "Damares Alves", "intencao": 16},
                    {"candidato": "Outros", "intencao": 16}
                ],
                fonte_url: "https://datafolha.folha.uol.com.br/pesquisa-df-2025",
                confiabilidade_baixa: false
            },
            {
                id: "pesq_002",
                instituto: "Ipec",
                local: "DF",
                data_campo: "2025-09-05",
                amostra: 800,
                margem: 4,
                metodologia: "presencial",
                cenario: "estimulado",
                resultado_json: [
                    {"candidato": "Celina Leão", "intencao": 25},
                    {"candidato": "Erika Kokay", "intencao": 24},
                    {"candidato": "Izalci Lucas", "intencao": 20},
                    {"candidato": "Damares Alves", "intencao": 15},
                    {"candidato": "Outros", "intencao": 16}
                ],
                fonte_url: "https://ipec.com.br/pesquisa-df-setembro",
                confiabilidade_baixa: false
            },
            {
                id: "pesq_003",
                instituto: "Quaest",
                local: "DF",
                data_campo: "2025-08-28",
                amostra: 1000,
                margem: 3,
                metodologia: "online",
                cenario: "espontaneo",
                resultado_json: [
                    {"candidato": "Celina Leão", "intencao": 15},
                    {"candidato": "Erika Kokay", "intencao": 12},
                    {"candidato": "Izalci Lucas", "intencao": 10},
                    {"candidato": "Não sabe", "intencao": 63}
                ],
                fonte_url: "https://quaest.com.br/df-agosto-2025",
                confiabilidade_baixa: true
            }
        ];

        this.pesquisasFiltradas = [...this.pesquisas];
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('btn-aplicar-filtros').addEventListener('click', () => {
            this.aplicarFiltros();
        });

        // Ações da tabela
        document.getElementById('btn-exportar').addEventListener('click', () => {
            this.exportarCSV();
        });

        document.getElementById('btn-atualizar').addEventListener('click', () => {
            this.atualizarDados();
        });

        // Paginação
        document.getElementById('btn-prev').addEventListener('click', () => {
            this.paginaAnterior();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            this.proximaPagina();
        });
    }

    aplicarFiltros() {
        const instituto = document.getElementById('filtro-instituto').value;
        const cenario = document.getElementById('filtro-cenario').value;
        const periodo = document.getElementById('filtro-periodo').value;

        this.pesquisasFiltradas = this.pesquisas.filter(pesquisa => {
            let incluir = true;

            if (instituto && pesquisa.instituto !== instituto) {
                incluir = false;
            }

            if (cenario && pesquisa.cenario !== cenario) {
                incluir = false;
            }

            if (periodo) {
                const dataLimite = new Date();
                dataLimite.setDate(dataLimite.getDate() - parseInt(periodo));
                const dataPesquisa = new Date(pesquisa.data_campo);
                if (dataPesquisa < dataLimite) {
                    incluir = false;
                }
            }

            return incluir;
        });

        this.paginaAtual = 1;
        this.renderizarTabela();
        this.atualizarEstatisticas();
        this.atualizarGrafico();
    }

    renderizarTabela() {
        const tbody = document.getElementById('tbody-pesquisas');
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        const pesquisasPagina = this.pesquisasFiltradas.slice(inicio, fim);

        tbody.innerHTML = '';

        pesquisasPagina.forEach(pesquisa => {
            const row = document.createElement('tr');
            
            const resultadoPreview = this.gerarResultadoPreview(pesquisa.resultado_json);
            const confiabilidadeBadge = pesquisa.confiabilidade_baixa ? 
                '<span class="confiabilidade-badge confiabilidade-baixa">Baixa</span>' :
                '<span class="confiabilidade-badge confiabilidade-alta">Alta</span>';

            row.innerHTML = `
                <td>${pesquisa.id}</td>
                <td>${pesquisa.instituto}</td>
                <td>${this.formatarData(pesquisa.data_campo)}</td>
                <td>${pesquisa.amostra.toLocaleString()}</td>
                <td>${pesquisa.margem}pp</td>
                <td>${this.formatarMetodologia(pesquisa.metodologia)}</td>
                <td>${this.formatarCenario(pesquisa.cenario)}</td>
                <td class="resultado-cell">
                    <div class="resultado-preview">${resultadoPreview}</div>
                </td>
                <td>${confiabilidadeBadge}</td>
                <td>
                    <button class="btn-action btn-view" onclick="pesquisasManager.verDetalhes('${pesquisa.id}')">Ver</button>
                    <button class="btn-action btn-edit" onclick="pesquisasManager.editarPesquisa('${pesquisa.id}')">Editar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        this.atualizarPaginacao();
    }

    gerarResultadoPreview(resultado) {
        if (!resultado || resultado.length === 0) return 'Sem dados';
        
        const top3 = resultado
            .sort((a, b) => b.intencao - a.intencao)
            .slice(0, 3)
            .map(r => `${r.candidato}: ${r.intencao}%`)
            .join(', ');
        
        return top3;
    }

    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    formatarMetodologia(metodologia) {
        const metodologias = {
            'telefonica': 'Telefônica',
            'presencial': 'Presencial',
            'online': 'Online'
        };
        return metodologias[metodologia] || metodologia;
    }

    formatarCenario(cenario) {
        const cenarios = {
            'estimulado': 'Estimulado',
            'espontaneo': 'Espontâneo',
            'rejeicao': 'Rejeição',
            'avaliacao': 'Avaliação'
        };
        return cenarios[cenario] || cenario;
    }

    atualizarPaginacao() {
        const totalPaginas = Math.ceil(this.pesquisasFiltradas.length / this.itensPorPagina);
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina + 1;
        const fim = Math.min(this.paginaAtual * this.itensPorPagina, this.pesquisasFiltradas.length);

        // Atualizar info
        document.getElementById('pagination-info').textContent = 
            `Mostrando ${inicio} a ${fim} de ${this.pesquisasFiltradas.length} registros`;

        // Atualizar botões
        document.getElementById('btn-prev').disabled = this.paginaAtual === 1;
        document.getElementById('btn-next').disabled = this.paginaAtual === totalPaginas || totalPaginas === 0;

        // Atualizar páginas
        const pagesContainer = document.getElementById('pagination-pages');
        pagesContainer.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            if (i === 1 || i === totalPaginas || (i >= this.paginaAtual - 2 && i <= this.paginaAtual + 2)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-page ${i === this.paginaAtual ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => this.irParaPagina(i);
                pagesContainer.appendChild(pageBtn);
            } else if (i === this.paginaAtual - 3 || i === this.paginaAtual + 3) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0.5rem';
                pagesContainer.appendChild(ellipsis);
            }
        }
    }

    paginaAnterior() {
        if (this.paginaAtual > 1) {
            this.paginaAtual--;
            this.renderizarTabela();
        }
    }

    proximaPagina() {
        const totalPaginas = Math.ceil(this.pesquisasFiltradas.length / this.itensPorPagina);
        if (this.paginaAtual < totalPaginas) {
            this.paginaAtual++;
            this.renderizarTabela();
        }
    }

    irParaPagina(pagina) {
        this.paginaAtual = pagina;
        this.renderizarTabela();
    }

    atualizarEstatisticas() {
        const total = this.pesquisasFiltradas.length;
        const institutos = new Set(this.pesquisasFiltradas.map(p => p.instituto)).size;
        const ultimaPesquisa = this.pesquisasFiltradas.length > 0 ? 
            Math.max(...this.pesquisasFiltradas.map(p => new Date(p.data_campo))) : null;
        const confiabilidadeAlta = this.pesquisasFiltradas.filter(p => !p.confiabilidade_baixa).length;
        const percentualConfiabilidade = total > 0 ? (confiabilidadeAlta / total * 100) : 0;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-institutos').textContent = institutos;
        document.getElementById('stat-ultima').textContent = ultimaPesquisa ? 
            new Date(ultimaPesquisa).toLocaleDateString('pt-BR') : '-';
        document.getElementById('stat-confiabilidade').textContent = `${percentualConfiabilidade.toFixed(0)}%`;
    }

    atualizarGrafico() {
        const ctx = document.getElementById('chart-evolucao').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        // Preparar dados para o gráfico
        const dadosGrafico = this.prepararDadosGrafico();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: dadosGrafico,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução das Intenções de Voto'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data da Pesquisa'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Intenção de Voto (%)'
                        },
                        min: 0,
                        max: 50
                    }
                }
            }
        });
    }

    prepararDadosGrafico() {
        // Agrupar por candidato e ordenar por data
        const candidatos = {};
        
        this.pesquisasFiltradas
            .filter(p => p.cenario === 'estimulado') // Apenas cenário estimulado
            .sort((a, b) => new Date(a.data_campo) - new Date(b.data_campo))
            .forEach(pesquisa => {
                pesquisa.resultado_json.forEach(resultado => {
                    if (!candidatos[resultado.candidato]) {
                        candidatos[resultado.candidato] = [];
                    }
                    candidatos[resultado.candidato].push({
                        x: pesquisa.data_campo,
                        y: resultado.intencao
                    });
                });
            });

        // Cores para os candidatos
        const cores = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];

        const datasets = Object.keys(candidatos)
            .filter(candidato => candidato !== 'Outros' && candidato !== 'Não sabe')
            .slice(0, 5) // Top 5 candidatos
            .map((candidato, index) => ({
                label: candidato,
                data: candidatos[candidato],
                borderColor: cores[index],
                backgroundColor: cores[index] + '20',
                tension: 0.1
            }));

        return { datasets };
    }

    exportarCSV() {
        const headers = ['ID', 'Instituto', 'Data Campo', 'Amostra', 'Margem', 'Metodologia', 'Cenário', 'Confiabilidade'];
        const rows = this.pesquisasFiltradas.map(p => [
            p.id,
            p.instituto,
            p.data_campo,
            p.amostra,
            p.margem,
            p.metodologia,
            p.cenario,
            p.confiabilidade_baixa ? 'Baixa' : 'Alta'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pesquisas_df_2026.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    atualizarDados() {
        // Simular atualização de dados
        console.log('Atualizando dados...');
        this.carregarDados();
        this.aplicarFiltros();
        
        // Mostrar feedback visual
        const btn = document.getElementById('btn-atualizar');
        const textoOriginal = btn.textContent;
        btn.textContent = 'Atualizando...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.textContent = textoOriginal;
            btn.disabled = false;
        }, 1000);
    }

    verDetalhes(id) {
        const pesquisa = this.pesquisas.find(p => p.id === id);
        if (pesquisa) {
            alert(`Detalhes da pesquisa ${id}:\n\n${JSON.stringify(pesquisa, null, 2)}`);
        }
    }

    editarPesquisa(id) {
        alert(`Funcionalidade de edição para pesquisa ${id} será implementada.`);
    }
}

// Inicializar quando a página carregar
let pesquisasManager;
document.addEventListener('DOMContentLoaded', () => {
    pesquisasManager = new PesquisasManager();
});

