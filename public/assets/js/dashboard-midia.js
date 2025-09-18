// JavaScript para tabela midia_df no Dashboard

class MidiaTableManager {
    constructor() {
        this.midiaItems = [];
        this.midiaFiltrados = [];
        this.paginaAtualMidia = 1;
        this.itensPorPaginaMidia = 5;
        
        this.init();
    }

    init() {
        this.carregarMidiaItems();
        this.setupEventListeners();
        this.renderizarTabelaMidia();
    }

    carregarMidiaItems() {
        // Dados mockados da tabela midia_df
        this.midiaItems = [
            {
                id: "midia_001",
                candidato: "Celina Leão",
                fonte: "G1",
                url: "https://g1.globo.com/df/distrito-federal/noticia/celina-leao-propostas.html",
                tipo: "noticia",
                titulo: "Celina Leão apresenta propostas para infraestrutura do DF",
                data_publicacao: "2025-09-15T10:30:00-03:00",
                texto: "A deputada distrital Celina Leão (PP) apresentou hoje suas principais propostas...",
                resumo: "Celina Leão propõe melhorias na infraestrutura e transporte público do DF",
                score_credibilidade: 0.85,
                tema: ["infraestrutura", "transporte"],
                sentimento: 0.3,
                retorica: "proposta",
                alvo: "eleitorado",
                origem_coleta: "A3"
            },
            {
                id: "midia_002",
                candidato: "Erika Kokay",
                fonte: "Correio Braziliense",
                url: "https://correiobraziliense.com.br/erika-kokay-saude.html",
                tipo: "entrevista",
                titulo: "Erika Kokay defende ampliação da rede de saúde pública",
                data_publicacao: "2025-09-15T08:15:00-03:00",
                texto: "Em entrevista exclusiva, a deputada federal Erika Kokay (PT) defendeu...",
                resumo: "Erika Kokay propõe ampliação da rede de saúde e contratação de médicos",
                score_credibilidade: 0.90,
                tema: ["saude", "politicas_publicas"],
                sentimento: 0.2,
                retorica: "proposta",
                alvo: "eleitorado",
                origem_coleta: "A3"
            },
            {
                id: "midia_003",
                candidato: "Damares Alves",
                fonte: "Metrópoles",
                url: "https://metropoles.com/damares-alves-polemica.html",
                tipo: "noticia",
                titulo: "Damares Alves gera polêmica com declarações sobre educação",
                data_publicacao: "2025-09-14T16:45:00-03:00",
                texto: "A senadora Damares Alves (Republicanos) causou polêmica ao declarar...",
                resumo: "Declarações de Damares sobre educação geram reações negativas",
                score_credibilidade: 0.75,
                tema: ["educacao", "costumes"],
                sentimento: -0.4,
                retorica: "ataque",
                alvo: "adversario",
                origem_coleta: "A3"
            },
            {
                id: "midia_004",
                candidato: "Izalci Lucas",
                fonte: "UOL",
                url: "https://uol.com.br/izalci-lucas-economia.html",
                tipo: "artigo",
                titulo: "Izalci Lucas apresenta plano econômico para o DF",
                data_publicacao: "2025-09-14T14:20:00-03:00",
                texto: "O deputado federal Izalci Lucas (PSDB) divulgou seu plano econômico...",
                resumo: "Izalci Lucas propõe medidas para desenvolvimento econômico do DF",
                score_credibilidade: 0.80,
                tema: ["economia", "desenvolvimento"],
                sentimento: 0.1,
                retorica: "proposta",
                alvo: "eleitorado",
                origem_coleta: "A3"
            },
            {
                id: "midia_005",
                candidato: "Leila Barros",
                fonte: "Poder360",
                url: "https://poder360.com.br/leila-barros-esporte.html",
                tipo: "post",
                titulo: "Leila Barros defende investimento em esporte e lazer",
                data_publicacao: "2025-09-14T12:00:00-03:00",
                texto: "A senadora Leila Barros (PDT) utilizou suas redes sociais para defender...",
                resumo: "Leila Barros propõe mais investimentos em esporte e lazer no DF",
                score_credibilidade: 0.70,
                tema: ["esporte", "lazer"],
                sentimento: 0.4,
                retorica: "proposta",
                alvo: "eleitorado",
                origem_coleta: "A3"
            },
            {
                id: "midia_006",
                candidato: "José Roberto Arruda",
                fonte: "Folha de S.Paulo",
                url: "https://folha.uol.com.br/arruda-corrupcao.html",
                tipo: "noticia",
                titulo: "José Roberto Arruda enfrenta nova denúncia de corrupção",
                data_publicacao: "2025-09-13T18:30:00-03:00",
                texto: "O ex-governador José Roberto Arruda (PL) foi alvo de nova denúncia...",
                resumo: "Nova denúncia de corrupção contra José Roberto Arruda",
                score_credibilidade: 0.95,
                tema: ["corrupcao", "justica"],
                sentimento: -0.6,
                retorica: "ataque",
                alvo: "auto",
                origem_coleta: "A3"
            },
            {
                id: "midia_007",
                candidato: "Paula Belmonte",
                fonte: "CNN Brasil",
                url: "https://cnnbrasil.com.br/paula-belmonte-mulheres.html",
                tipo: "entrevista",
                titulo: "Paula Belmonte propõe políticas para mulheres no DF",
                data_publicacao: "2025-09-13T15:00:00-03:00",
                texto: "A deputada federal Paula Belmonte apresentou suas propostas...",
                resumo: "Paula Belmonte foca em políticas públicas para mulheres",
                score_credibilidade: 0.85,
                tema: ["direitos_humanos", "genero"],
                sentimento: 0.3,
                retorica: "proposta",
                alvo: "eleitorado",
                origem_coleta: "A3"
            }
        ];

        this.midiaFiltrados = [...this.midiaItems];
        this.popularFiltrosMidia();
    }

    popularFiltrosMidia() {
        // Popular filtro de candidatos
        const selectCandidato = document.getElementById('filtro-candidato-midia');
        if (selectCandidato) {
            const candidatosUnicos = [...new Set(this.midiaItems.map(item => item.candidato))];
            candidatosUnicos.forEach(candidato => {
                const option = document.createElement('option');
                option.value = candidato;
                option.textContent = candidato;
                selectCandidato.appendChild(option);
            });
        }

        // Popular filtro de fontes
        const selectFonte = document.getElementById('filtro-fonte-midia');
        if (selectFonte) {
            const fontesUnicas = [...new Set(this.midiaItems.map(item => item.fonte))];
            fontesUnicas.forEach(fonte => {
                const option = document.createElement('option');
                option.value = fonte;
                option.textContent = fonte;
                selectFonte.appendChild(option);
            });
        }
    }

    setupEventListeners() {
        // Event listeners para tabela de mídia
        document.getElementById('btn-exportar-midia')?.addEventListener('click', () => {
            this.exportarMidiaCSV();
        });

        document.getElementById('btn-filtrar-midia')?.addEventListener('click', () => {
            this.aplicarFiltrosMidia();
        });

        // Filtros automáticos
        ['filtro-candidato-midia', 'filtro-fonte-midia', 'filtro-tipo-midia', 'filtro-sentimento-midia'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                this.aplicarFiltrosMidia();
            });
        });

        // Paginação mídia
        document.getElementById('btn-prev-midia')?.addEventListener('click', () => {
            this.paginaAnteriorMidia();
        });

        document.getElementById('btn-next-midia')?.addEventListener('click', () => {
            this.proximaPaginaMidia();
        });
    }

    aplicarFiltrosMidia() {
        const candidato = document.getElementById('filtro-candidato-midia')?.value || '';
        const fonte = document.getElementById('filtro-fonte-midia')?.value || '';
        const tipo = document.getElementById('filtro-tipo-midia')?.value || '';
        const sentimento = document.getElementById('filtro-sentimento-midia')?.value || '';

        this.midiaFiltrados = this.midiaItems.filter(item => {
            let incluir = true;

            if (candidato && item.candidato !== candidato) incluir = false;
            if (fonte && item.fonte !== fonte) incluir = false;
            if (tipo && item.tipo !== tipo) incluir = false;
            
            if (sentimento) {
                if (sentimento === 'positivo' && item.sentimento <= 0.2) incluir = false;
                if (sentimento === 'neutro' && (item.sentimento < -0.2 || item.sentimento > 0.2)) incluir = false;
                if (sentimento === 'negativo' && item.sentimento >= -0.2) incluir = false;
            }

            return incluir;
        });

        this.paginaAtualMidia = 1;
        this.renderizarTabelaMidia();
    }

    renderizarTabelaMidia() {
        const tbody = document.getElementById('tbody-midia');
        if (!tbody) return;

        const inicio = (this.paginaAtualMidia - 1) * this.itensPorPaginaMidia;
        const fim = inicio + this.itensPorPaginaMidia;
        const itensPagina = this.midiaFiltrados.slice(inicio, fim);

        tbody.innerHTML = '';

        itensPagina.forEach(item => {
            const row = document.createElement('tr');
            
            const temasText = Array.isArray(item.tema) ? item.tema.join(', ') : item.tema;
            const sentimentoClass = item.sentimento > 0.2 ? 'positivo' : 
                                  item.sentimento < -0.2 ? 'negativo' : 'neutro';
            const sentimentoText = item.sentimento > 0.2 ? 'Positivo' : 
                                 item.sentimento < -0.2 ? 'Negativo' : 'Neutro';

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.candidato}</td>
                <td>${item.fonte}</td>
                <td>${this.formatarTipo(item.tipo)}</td>
                <td class="titulo-cell" title="${item.titulo}">${this.truncarTexto(item.titulo, 40)}</td>
                <td>${this.formatarData(item.data_publicacao)}</td>
                <td>${temasText}</td>
                <td class="sentimento-${sentimentoClass}">${sentimentoText} (${item.sentimento.toFixed(2)})</td>
                <td>${this.formatarRetorica(item.retorica)}</td>
                <td class="credibilidade-cell">${(item.score_credibilidade * 100).toFixed(0)}%</td>
                <td>
                    <button class="btn-action btn-view" onclick="midiaTableManager.verDetalhesMidia('${item.id}')">Ver</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        this.atualizarPaginacaoMidia();
    }

    formatarTipo(tipo) {
        const tipos = {
            'noticia': 'Notícia',
            'artigo': 'Artigo',
            'entrevista': 'Entrevista',
            'video': 'Vídeo',
            'post': 'Post'
        };
        return tipos[tipo] || tipo;
    }

    formatarRetorica(retorica) {
        const retoricas = {
            'proposta': 'Proposta',
            'ataque': 'Ataque',
            'defesa': 'Defesa',
            'neutra': 'Neutra'
        };
        return retoricas[retorica] || retorica;
    }

    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    truncarTexto(texto, limite) {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    atualizarPaginacaoMidia() {
        const totalPaginas = Math.ceil(this.midiaFiltrados.length / this.itensPorPaginaMidia);
        const inicio = (this.paginaAtualMidia - 1) * this.itensPorPaginaMidia + 1;
        const fim = Math.min(this.paginaAtualMidia * this.itensPorPaginaMidia, this.midiaFiltrados.length);

        // Atualizar info
        const infoElement = document.getElementById('pagination-info-midia');
        if (infoElement) {
            infoElement.textContent = `Mostrando ${inicio} a ${fim} de ${this.midiaFiltrados.length} registros`;
        }

        // Atualizar botões
        const btnPrev = document.getElementById('btn-prev-midia');
        const btnNext = document.getElementById('btn-next-midia');
        if (btnPrev) btnPrev.disabled = this.paginaAtualMidia === 1;
        if (btnNext) btnNext.disabled = this.paginaAtualMidia === totalPaginas || totalPaginas === 0;
    }

    paginaAnteriorMidia() {
        if (this.paginaAtualMidia > 1) {
            this.paginaAtualMidia--;
            this.renderizarTabelaMidia();
        }
    }

    proximaPaginaMidia() {
        const totalPaginas = Math.ceil(this.midiaFiltrados.length / this.itensPorPaginaMidia);
        if (this.paginaAtualMidia < totalPaginas) {
            this.paginaAtualMidia++;
            this.renderizarTabelaMidia();
        }
    }

    exportarMidiaCSV() {
        const headers = ['ID', 'Candidato', 'Fonte', 'Tipo', 'Título', 'Data', 'Temas', 'Sentimento', 'Retórica', 'Credibilidade'];
        const rows = this.midiaFiltrados.map(item => [
            item.id,
            item.candidato,
            item.fonte,
            item.tipo,
            item.titulo,
            this.formatarData(item.data_publicacao),
            Array.isArray(item.tema) ? item.tema.join('; ') : item.tema,
            item.sentimento,
            item.retorica,
            item.score_credibilidade
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'midia_df_2026.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    verDetalhesMidia(id) {
        const item = this.midiaItems.find(i => i.id === id);
        if (item) {
            alert(`Detalhes do item ${id}:\n\n${JSON.stringify(item, null, 2)}`);
        }
    }
}

// Inicializar quando a página carregar
let midiaTableManager;
document.addEventListener('DOMContentLoaded', () => {
    midiaTableManager = new MidiaTableManager();
});

