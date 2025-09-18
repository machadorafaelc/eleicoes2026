// Sistema de Fallbacks e Mensagens Honestas
// Eleições DF 2026 - Para demonstrações e situações de dados insuficientes

class FallbackSystem {
    constructor() {
        this.mensagens_padrao = {
            sem_pesquisa_periodo: "Sem pesquisas com data de campo no período selecionado. Sugestão: ampliar janela para 60 a 90 dias.",
            baixa_confianca_item: "Este item tem baixa confiabilidade (fonte ou metodologia incompleta). Use com cautela.",
            sem_dados_tema: "Não há massa crítica suficiente para inferir tendências neste tema. Aguarde mais ocorrências.",
            sem_dados_candidato: "Dados insuficientes para este candidato no período selecionado. Aguarde mais coletas.",
            erro_conexao: "Erro ao carregar dados. Verifique a conexão e tente novamente.",
            processando_dados: "Dados sendo processados pelos agentes. Resultados disponíveis em breve.",
            sem_mencoes_periodo: "Nenhuma menção encontrada no período. Considere ampliar o intervalo de busca.",
            dados_desatualizados: "Dados podem estar desatualizados. Última coleta há mais de 24h.",
            fonte_nao_confiavel: "Fonte com baixa credibilidade. Informação deve ser verificada independentemente.",
            pesquisa_metodologia_incompleta: "Metodologia da pesquisa incompleta. Resultados devem ser interpretados com cautela.",
            amostra_pequena: "Amostra pequena (< 500 entrevistados). Margem de erro pode ser maior que a informada.",
            sem_dados_comparacao: "Dados insuficientes para comparação entre candidatos neste período.",
            aguardando_primeira_coleta: "Sistema iniciado recentemente. Aguardando primeira coleta de dados.",
            manutencao_agentes: "Agentes em manutenção. Dados podem estar temporariamente indisponíveis."
        };
        
        this.thresholds = {
            min_items_tema: 5,           // Mínimo de itens para análise de tema
            min_items_candidato: 3,      // Mínimo de itens por candidato
            min_credibilidade: 0.6,      // Credibilidade mínima aceitável
            max_horas_desatualizado: 24, // Máximo de horas sem atualização
            min_amostra_pesquisa: 500,   // Amostra mínima para pesquisa confiável
            min_items_comparacao: 2      // Mínimo de itens para comparação
        };
    }

    // Verificar se há dados suficientes para análise de tema
    checkDataSufficiency(data, type = 'tema') {
        if (!data || data.length === 0) {
            return {
                sufficient: false,
                message: this.mensagens_padrao.sem_dados_tema,
                level: 'warning'
            };
        }

        const threshold = this.thresholds[`min_items_${type}`] || 3;
        
        if (data.length < threshold) {
            return {
                sufficient: false,
                message: this.mensagens_padrao.sem_dados_tema,
                level: 'warning',
                count: data.length,
                required: threshold
            };
        }

        return {
            sufficient: true,
            count: data.length
        };
    }

    // Verificar confiabilidade de item
    checkItemReliability(item) {
        const issues = [];
        
        // Verificar credibilidade da fonte
        if (item.score_credibilidade < this.thresholds.min_credibilidade) {
            issues.push({
                type: 'low_credibility',
                message: this.mensagens_padrao.fonte_nao_confiavel,
                level: 'warning'
            });
        }

        // Verificar se tem nota de baixa confiança
        if (item.nota === 'baixa_confiança') {
            issues.push({
                type: 'low_confidence',
                message: this.mensagens_padrao.baixa_confianca_item,
                level: 'warning'
            });
        }

        // Verificar data de publicação
        if (item.data_publicacao) {
            const horasAtras = this.getHoursAgo(item.data_publicacao);
            if (horasAtras > this.thresholds.max_horas_desatualizado) {
                issues.push({
                    type: 'outdated',
                    message: this.mensagens_padrao.dados_desatualizados,
                    level: 'info'
                });
            }
        }

        return {
            reliable: issues.length === 0,
            issues: issues
        };
    }

    // Verificar confiabilidade de pesquisa
    checkPollReliability(poll) {
        const issues = [];

        // Verificar amostra
        if (poll.amostra < this.thresholds.min_amostra_pesquisa) {
            issues.push({
                type: 'small_sample',
                message: this.mensagens_padrao.amostra_pequena,
                level: 'warning'
            });
        }

        // Verificar metodologia
        if (!poll.metodologia || poll.metodologia.length < 10) {
            issues.push({
                type: 'incomplete_methodology',
                message: this.mensagens_padrao.pesquisa_metodologia_incompleta,
                level: 'warning'
            });
        }

        // Verificar confiabilidade baixa
        if (poll.confiabilidade_baixa) {
            issues.push({
                type: 'low_reliability',
                message: this.mensagens_padrao.baixa_confianca_item,
                level: 'warning'
            });
        }

        return {
            reliable: issues.filter(i => i.level === 'warning').length === 0,
            issues: issues
        };
    }

    // Gerar mensagem de fallback para gráficos vazios
    generateChartFallback(chartType, candidato = null) {
        const messages = {
            'sov': candidato ? 
                `Dados insuficientes de Share of Voice para ${candidato}. ${this.mensagens_padrao.sem_dados_candidato}` :
                this.mensagens_padrao.sem_dados_tema,
            'retorica': candidato ?
                `Análise de retórica indisponível para ${candidato}. ${this.mensagens_padrao.sem_dados_candidato}` :
                this.mensagens_padrao.sem_dados_tema,
            'risco': this.mensagens_padrao.sem_mencoes_periodo,
            'pesquisas': this.mensagens_padrao.sem_pesquisa_periodo,
            'comparacao': this.mensagens_padrao.sem_dados_comparacao
        };

        return {
            message: messages[chartType] || this.mensagens_padrao.sem_dados_tema,
            level: 'info',
            suggestion: this.getSuggestion(chartType)
        };
    }

    // Obter sugestão baseada no tipo de problema
    getSuggestion(type) {
        const suggestions = {
            'sov': 'Aguarde mais coletas ou amplie o período de análise.',
            'retorica': 'Execute o pipeline de coleta para obter mais dados.',
            'risco': 'Verifique se os agentes estão coletando dados regularmente.',
            'pesquisas': 'Amplie o período para 60-90 dias ou aguarde novas pesquisas.',
            'comparacao': 'Selecione candidatos com mais atividade recente.'
        };

        return suggestions[type] || 'Aguarde mais dados ou execute nova coleta.';
    }

    // Criar elemento visual de fallback
    createFallbackElement(container, fallback) {
        const fallbackHtml = `
            <div class="fallback-message ${fallback.level}">
                <div class="fallback-icon">
                    <i class="fas ${this.getFallbackIcon(fallback.level)}"></i>
                </div>
                <div class="fallback-content">
                    <h4>Dados Insuficientes</h4>
                    <p>${fallback.message}</p>
                    ${fallback.suggestion ? `<small class="fallback-suggestion">${fallback.suggestion}</small>` : ''}
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            const element = document.getElementById(container);
            if (element) {
                element.innerHTML = fallbackHtml;
            }
        } else if (container) {
            container.innerHTML = fallbackHtml;
        }
    }

    // Obter ícone baseado no nível
    getFallbackIcon(level) {
        const icons = {
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        };
        return icons[level] || 'fa-info-circle';
    }

    // Calcular horas atrás
    getHoursAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        return Math.floor((now - date) / (1000 * 60 * 60));
    }

    // Adicionar badges de confiabilidade
    addReliabilityBadge(element, reliability) {
        if (!reliability.reliable && reliability.issues.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'reliability-badge warning';
            badge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Baixa Confiabilidade';
            badge.title = reliability.issues.map(i => i.message).join('\n');
            
            if (element) {
                element.appendChild(badge);
            }
        }
    }

    // Processar dados com fallbacks
    processDataWithFallbacks(data, type, candidato = null) {
        // Verificar suficiência dos dados
        const sufficiency = this.checkDataSufficiency(data, type);
        
        if (!sufficiency.sufficient) {
            return {
                hasData: false,
                fallback: this.generateChartFallback(type, candidato),
                originalData: data
            };
        }

        // Verificar confiabilidade dos itens
        const processedData = data.map(item => {
            const reliability = this.checkItemReliability(item);
            return {
                ...item,
                _reliability: reliability
            };
        });

        return {
            hasData: true,
            data: processedData,
            warnings: processedData
                .filter(item => !item._reliability.reliable)
                .map(item => item._reliability.issues)
                .flat()
        };
    }

    // Mostrar toast de aviso
    showWarningToast(message, duration = 5000) {
        const toast = document.createElement('div');
        toast.className = 'warning-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto-remover após duração
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);

        // Remover ao clicar no X
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            });
        }
    }

    // Validar dados antes de exibir gráfico
    validateChartData(data, chartType, candidato = null) {
        const result = this.processDataWithFallbacks(data, chartType, candidato);
        
        if (!result.hasData) {
            return {
                valid: false,
                fallback: result.fallback
            };
        }

        // Mostrar avisos se houver
        if (result.warnings && result.warnings.length > 0) {
            const uniqueWarnings = [...new Set(result.warnings.map(w => w.message))];
            uniqueWarnings.forEach(warning => {
                this.showWarningToast(warning);
            });
        }

        return {
            valid: true,
            data: result.data,
            warnings: result.warnings
        };
    }
}

// Instância global
window.fallbackSystem = new FallbackSystem();

// Função de conveniência para usar em outros scripts
function validateAndShowChart(data, chartType, containerId, candidato = null) {
    const validation = window.fallbackSystem.validateChartData(data, chartType, candidato);
    
    if (!validation.valid) {
        window.fallbackSystem.createFallbackElement(containerId, validation.fallback);
        return false;
    }
    
    return validation.data;
}

// Função para mostrar mensagem de carregamento
function showLoadingMessage(containerId, message = "Carregando dados...") {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-message">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>${message}</p>
            </div>
        `;
    }
}

