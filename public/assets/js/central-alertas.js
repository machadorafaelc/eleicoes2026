/**
 * Central de Alertas - Dashboard Geral
 * Exibe alertas em tempo real do sistema de monitoramento
 */

class CentralAlertas {
    constructor() {
        this.alertsContainer = document.getElementById('central-alertas');
        this.refreshInterval = 30000; // 30 segundos
        this.maxAlertas = 50;
        
        // Cores por severidade
        this.cores = {
            'baixa': '#28a745',
            'media': '#ffc107',
            'alta': '#dc3545',
            'critica': '#6f42c1'
        };
        
        // Ícones por tipo de alerta
        this.icones = {
            'pico_mencoes': 'fas fa-chart-line',
            'queda_sentimento': 'fas fa-arrow-down',
            'nova_pesquisa': 'fas fa-poll',
            'alta_mencoes_negativas': 'fas fa-exclamation-triangle',
            'default': 'fas fa-bell'
        };
        
        this.init();
    }
    
    init() {
        this.criarEstrutura();
        this.carregarAlertas();
        this.iniciarRefreshAutomatico();
    }
    
    criarEstrutura() {
        if (!this.alertsContainer) {
            console.error('Container central-alertas não encontrado');
            return;
        }
        
        this.alertsContainer.innerHTML = `
            <div class="central-alertas-header">
                <div class="header-left">
                    <h3><i class="fas fa-bell"></i> Central de Alertas</h3>
                    <span class="alertas-count">Carregando...</span>
                </div>
                <div class="header-right">
                    <button class="btn-refresh" onclick="centralAlertas.carregarAlertas()">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                    <button class="btn-config" onclick="centralAlertas.abrirConfiguracoes()">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            
            <div class="alertas-filtros">
                <select id="filtro-severidade" onchange="centralAlertas.aplicarFiltros()">
                    <option value="">Todas as severidades</option>
                    <option value="critica">Crítica</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>
                
                <select id="filtro-tipo" onchange="centralAlertas.aplicarFiltros()">
                    <option value="">Todos os tipos</option>
                    <option value="pico_mencoes">Pico de Menções</option>
                    <option value="queda_sentimento">Queda de Sentimento</option>
                    <option value="nova_pesquisa">Nova Pesquisa</option>
                    <option value="alta_mencoes_negativas">Menções Negativas</option>
                </select>
                
                <select id="filtro-periodo" onchange="centralAlertas.aplicarFiltros()">
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="all">Todos</option>
                </select>
            </div>
            
            <div class="alertas-lista" id="alertas-lista">
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Carregando alertas...
                </div>
            </div>
            
            <div class="alertas-footer">
                <div class="estatisticas">
                    <span class="stat-item">
                        <span class="stat-label">Total:</span>
                        <span class="stat-value" id="total-alertas">0</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">Não lidos:</span>
                        <span class="stat-value" id="nao-lidos">0</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">Última atualização:</span>
                        <span class="stat-value" id="ultima-atualizacao">-</span>
                    </span>
                </div>
            </div>
        `;
    }
    
    async carregarAlertas() {
        try {
            // Simular carregamento de alertas (em produção, seria uma API)
            const alertas = await this.obterAlertasSimulados();
            
            this.renderizarAlertas(alertas);
            this.atualizarEstatisticas(alertas);
            this.atualizarTimestamp();
            
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
            this.mostrarErro('Erro ao carregar alertas');
        }
    }
    
    async obterAlertasSimulados() {
        // Simular dados de alertas baseados no sistema implementado
        const agora = new Date();
        
        return [
            {
                id: 'alert_001',
                timestamp: new Date(agora.getTime() - 5 * 60000).toISOString(), // 5 min atrás
                tipo_alerta: 'queda_sentimento',
                mensagem: 'Queda de sentimento para Izalci Lucas (Δ=-0.55 em 48h, de 0.275 para -0.275)',
                ref_id: 'izalci_lucas',
                severidade: 'alta',
                lido: false,
                dados: {
                    candidato: 'Izalci Lucas',
                    delta: -0.55,
                    sent_antes: 0.275,
                    sent_depois: -0.275
                }
            },
            {
                id: 'alert_002',
                timestamp: new Date(agora.getTime() - 15 * 60000).toISOString(), // 15 min atrás
                tipo_alerta: 'pico_mencoes',
                mensagem: 'Pico de menções para Celina Leão em 2025-09-16 (11 itens, média=3.2) — ver feed',
                ref_id: 'celina_leao',
                severidade: 'media',
                lido: false,
                dados: {
                    candidato: 'Celina Leão',
                    qtd: 11,
                    media: 3.2,
                    dia: '2025-09-16'
                }
            },
            {
                id: 'alert_003',
                timestamp: new Date(agora.getTime() - 25 * 60000).toISOString(), // 25 min atrás
                tipo_alerta: 'alta_mencoes_negativas',
                mensagem: 'Alto volume de menções negativas para Izalci Lucas (3 itens, sentimento=-0.35)',
                ref_id: 'izalci_lucas',
                severidade: 'alta',
                lido: true,
                dados: {
                    candidato: 'Izalci Lucas',
                    mencoes_negativas: 3,
                    sent_medio: -0.35
                }
            },
            {
                id: 'alert_004',
                timestamp: new Date(agora.getTime() - 2 * 60 * 60000).toISOString(), // 2h atrás
                tipo_alerta: 'nova_pesquisa',
                mensagem: 'Nova pesquisa registrada: Datafolha (estimulado), campo: 2025-09-15. ID: DF_20250915_001',
                ref_id: 'DF_20250915_001',
                severidade: 'baixa',
                lido: true,
                dados: {
                    instituto: 'Datafolha',
                    cenario: 'estimulado',
                    data_campo: '2025-09-15'
                }
            },
            {
                id: 'alert_005',
                timestamp: new Date(agora.getTime() - 4 * 60 * 60000).toISOString(), // 4h atrás
                tipo_alerta: 'pico_mencoes',
                mensagem: 'Pico de menções para Erika Kokay em 2025-09-16 (8 itens, média=2.1) — ver feed',
                ref_id: 'erika_kokay',
                severidade: 'media',
                lido: true,
                dados: {
                    candidato: 'Erika Kokay',
                    qtd: 8,
                    media: 2.1,
                    dia: '2025-09-16'
                }
            }
        ];
    }
    
    renderizarAlertas(alertas) {
        const lista = document.getElementById('alertas-lista');
        
        if (!alertas || alertas.length === 0) {
            lista.innerHTML = `
                <div class="no-alertas">
                    <i class="fas fa-check-circle"></i>
                    <p>Nenhum alerta ativo no momento</p>
                </div>
            `;
            return;
        }
        
        const html = alertas.map(alerta => this.criarItemAlerta(alerta)).join('');
        lista.innerHTML = html;
    }
    
    criarItemAlerta(alerta) {
        const timestamp = new Date(alerta.timestamp);
        const timeAgo = this.calcularTempoDecorrido(timestamp);
        const cor = this.cores[alerta.severidade] || '#6c757d';
        const icone = this.icones[alerta.tipo_alerta] || this.icones.default;
        const statusClass = alerta.lido ? 'lido' : 'nao-lido';
        
        return `
            <div class="alerta-item ${statusClass}" data-id="${alerta.id}" data-severidade="${alerta.severidade}" data-tipo="${alerta.tipo_alerta}">
                <div class="alerta-indicador" style="background-color: ${cor}"></div>
                
                <div class="alerta-icone">
                    <i class="${icone}" style="color: ${cor}"></i>
                </div>
                
                <div class="alerta-conteudo">
                    <div class="alerta-header">
                        <span class="alerta-tipo">${this.formatarTipoAlerta(alerta.tipo_alerta)}</span>
                        <span class="alerta-severidade" style="background-color: ${cor}">
                            ${alerta.severidade.toUpperCase()}
                        </span>
                        <span class="alerta-tempo">${timeAgo}</span>
                    </div>
                    
                    <div class="alerta-mensagem">
                        ${alerta.mensagem}
                    </div>
                    
                    <div class="alerta-footer">
                        <span class="alerta-ref">ID: ${alerta.ref_id}</span>
                        <div class="alerta-acoes">
                            ${!alerta.lido ? `<button class="btn-marcar-lido" onclick="centralAlertas.marcarComoLido('${alerta.id}')">
                                <i class="fas fa-check"></i> Marcar como lido
                            </button>` : ''}
                            <button class="btn-detalhes" onclick="centralAlertas.verDetalhes('${alerta.id}')">
                                <i class="fas fa-info-circle"></i> Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    formatarTipoAlerta(tipo) {
        const tipos = {
            'pico_mencoes': 'Pico de Menções',
            'queda_sentimento': 'Queda de Sentimento',
            'nova_pesquisa': 'Nova Pesquisa',
            'alta_mencoes_negativas': 'Menções Negativas'
        };
        return tipos[tipo] || tipo;
    }
    
    calcularTempoDecorrido(timestamp) {
        const agora = new Date();
        const diff = agora - timestamp;
        
        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);
        
        if (minutos < 1) return 'Agora';
        if (minutos < 60) return `${minutos}min`;
        if (horas < 24) return `${horas}h`;
        return `${dias}d`;
    }
    
    atualizarEstatisticas(alertas) {
        const total = alertas.length;
        const naoLidos = alertas.filter(a => !a.lido).length;
        
        document.getElementById('total-alertas').textContent = total;
        document.getElementById('nao-lidos').textContent = naoLidos;
        
        // Atualizar contador no header
        const countElement = document.querySelector('.alertas-count');
        if (countElement) {
            countElement.textContent = `${total} alertas (${naoLidos} não lidos)`;
        }
    }
    
    atualizarTimestamp() {
        const agora = new Date();
        const timestamp = agora.toLocaleTimeString('pt-BR');
        document.getElementById('ultima-atualizacao').textContent = timestamp;
    }
    
    aplicarFiltros() {
        const severidade = document.getElementById('filtro-severidade').value;
        const tipo = document.getElementById('filtro-tipo').value;
        const periodo = document.getElementById('filtro-periodo').value;
        
        const alertas = document.querySelectorAll('.alerta-item');
        
        alertas.forEach(alerta => {
            let mostrar = true;
            
            // Filtro por severidade
            if (severidade && alerta.dataset.severidade !== severidade) {
                mostrar = false;
            }
            
            // Filtro por tipo
            if (tipo && alerta.dataset.tipo !== tipo) {
                mostrar = false;
            }
            
            // Filtro por período (implementação simplificada)
            // Em produção, seria baseado no timestamp real
            
            alerta.style.display = mostrar ? 'flex' : 'none';
        });
    }
    
    marcarComoLido(alertaId) {
        const alertaElement = document.querySelector(`[data-id="${alertaId}"]`);
        if (alertaElement) {
            alertaElement.classList.remove('nao-lido');
            alertaElement.classList.add('lido');
            
            // Remover botão "Marcar como lido"
            const btnLido = alertaElement.querySelector('.btn-marcar-lido');
            if (btnLido) {
                btnLido.remove();
            }
            
            // Atualizar estatísticas
            const naoLidosElement = document.getElementById('nao-lidos');
            const atual = parseInt(naoLidosElement.textContent);
            naoLidosElement.textContent = Math.max(0, atual - 1);
            
            console.log(`Alerta ${alertaId} marcado como lido`);
        }
    }
    
    verDetalhes(alertaId) {
        // Implementar modal ou painel de detalhes
        console.log(`Ver detalhes do alerta: ${alertaId}`);
        
        // Por enquanto, mostrar alert simples
        alert(`Detalhes do alerta ${alertaId}\n\nEm uma implementação completa, aqui seria mostrado um modal com informações detalhadas do alerta, incluindo dados contextuais, histórico e ações recomendadas.`);
    }
    
    abrirConfiguracoes() {
        // Implementar modal de configurações
        console.log('Abrir configurações dos alertas');
        
        alert('Configurações dos Alertas\n\n• Frequência de atualização\n• Tipos de alerta ativos\n• Thresholds personalizados\n• Notificações por email\n• Integração com Slack/Teams');
    }
    
    iniciarRefreshAutomatico() {
        setInterval(() => {
            this.carregarAlertas();
        }, this.refreshInterval);
    }
    
    mostrarErro(mensagem) {
        const lista = document.getElementById('alertas-lista');
        lista.innerHTML = `
            <div class="erro-alertas">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${mensagem}</p>
                <button onclick="centralAlertas.carregarAlertas()">Tentar novamente</button>
            </div>
        `;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('central-alertas')) {
        window.centralAlertas = new CentralAlertas();
    }
});

// Função global para refresh manual
function refreshAlertas() {
    if (window.centralAlertas) {
        window.centralAlertas.carregarAlertas();
    }
}

