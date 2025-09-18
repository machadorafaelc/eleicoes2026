from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        secao = query_params.get('secao', ['geral'])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if secao == 'candidatos':
            dados = self.obter_candidatos()
        elif secao == 'fontes':
            dados = self.obter_fontes()
        elif secao == 'agentes':
            dados = self.obter_config_agentes()
        elif secao == 'alertas':
            dados = self.obter_config_alertas()
        elif secao == 'geral':
            dados = self.obter_config_geral()
        else:
            dados = {"error": "Seção não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para atualizar configurações
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            secao = dados.get('secao', 'geral')
            resultado = self.atualizar_configuracao(secao, dados)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(resultado, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def obter_candidatos(self):
        """Obter configuração dos candidatos"""
        return {
            "candidatos": [
                {
                    "id": 1,
                    "nome": "Celina Leão",
                    "partido": "PP",
                    "cargo_atual": "Vice-Governadora",
                    "ativo": True,
                    "cor_tema": "#1f77b4",
                    "palavras_chave": ["Celina Leão", "Celina", "vice-governadora"],
                    "redes_sociais": {
                        "twitter": "@celinaleaodf",
                        "instagram": "@celinaleaodf",
                        "facebook": "celinaleaodf"
                    }
                },
                {
                    "id": 2,
                    "nome": "Izalci Lucas",
                    "partido": "PSDB",
                    "cargo_atual": "Senador",
                    "ativo": True,
                    "cor_tema": "#ff7f0e",
                    "palavras_chave": ["Izalci Lucas", "Izalci", "senador"],
                    "redes_sociais": {
                        "twitter": "@izalci",
                        "instagram": "@izalcisenador",
                        "facebook": "izalcisenador"
                    }
                },
                {
                    "id": 3,
                    "nome": "Leandro Grass",
                    "partido": "PV",
                    "cargo_atual": "Deputado Distrital",
                    "ativo": True,
                    "cor_tema": "#2ca02c",
                    "palavras_chave": ["Leandro Grass", "Grass", "deputado distrital"],
                    "redes_sociais": {
                        "twitter": "@leandrograssdf",
                        "instagram": "@leandrograssdf",
                        "facebook": "leandrograssdf"
                    }
                },
                {
                    "id": 4,
                    "nome": "Erika Kokay",
                    "partido": "PT",
                    "cargo_atual": "Deputada Federal",
                    "ativo": True,
                    "cor_tema": "#d62728",
                    "palavras_chave": ["Erika Kokay", "Kokay", "deputada federal"],
                    "redes_sociais": {
                        "twitter": "@erikakokay",
                        "instagram": "@erikakokay",
                        "facebook": "erikakokay"
                    }
                },
                {
                    "id": 5,
                    "nome": "Damares Alves",
                    "partido": "Republicanos",
                    "cargo_atual": "Senadora",
                    "ativo": True,
                    "cor_tema": "#9467bd",
                    "palavras_chave": ["Damares Alves", "Damares", "senadora"],
                    "redes_sociais": {
                        "twitter": "@damaresalves",
                        "instagram": "@damaresalves",
                        "facebook": "damaresalvesoficial"
                    }
                },
                {
                    "id": 6,
                    "nome": "Leila Barros",
                    "partido": "PDT",
                    "cargo_atual": "Senadora",
                    "ativo": True,
                    "cor_tema": "#8c564b",
                    "palavras_chave": ["Leila Barros", "Leila", "senadora"],
                    "redes_sociais": {
                        "twitter": "@leilabarrosdf",
                        "instagram": "@leilabarrosdf",
                        "facebook": "leilabarrosdf"
                    }
                },
                {
                    "id": 7,
                    "nome": "José Roberto Arruda",
                    "partido": "PL",
                    "cargo_atual": "Ex-Governador",
                    "ativo": True,
                    "cor_tema": "#e377c2",
                    "palavras_chave": ["José Roberto Arruda", "Arruda", "ex-governador"],
                    "redes_sociais": {
                        "twitter": "@jrarruda",
                        "instagram": "@joseroberto.arruda",
                        "facebook": "joseroberto.arruda"
                    }
                },
                {
                    "id": 8,
                    "nome": "Paula Belmonte",
                    "partido": "Cidadania",
                    "cargo_atual": "Deputada Federal",
                    "ativo": True,
                    "cor_tema": "#7f7f7f",
                    "palavras_chave": ["Paula Belmonte", "Belmonte", "deputada federal"],
                    "redes_sociais": {
                        "twitter": "@paulabelmonte",
                        "instagram": "@paulabelmonte",
                        "facebook": "paulabelmonte"
                    }
                },
                {
                    "id": 9,
                    "nome": "Alberto Fraga",
                    "partido": "PL",
                    "cargo_atual": "Deputado Federal",
                    "ativo": True,
                    "cor_tema": "#bcbd22",
                    "palavras_chave": ["Alberto Fraga", "Fraga", "deputado federal"],
                    "redes_sociais": {
                        "twitter": "@albertofragadf",
                        "instagram": "@albertofragadf",
                        "facebook": "albertofragadf"
                    }
                },
                {
                    "id": 10,
                    "nome": "Fábio Félix",
                    "partido": "PSOL",
                    "cargo_atual": "Deputado Distrital",
                    "ativo": True,
                    "cor_tema": "#17becf",
                    "palavras_chave": ["Fábio Félix", "Félix", "deputado distrital"],
                    "redes_sociais": {
                        "twitter": "@fabiofelixdf",
                        "instagram": "@fabiofelixdf",
                        "facebook": "fabiofelixdf"
                    }
                }
            ],
            "total_candidatos": 10,
            "candidatos_ativos": 10,
            "timestamp": datetime.now().isoformat()
        }
    
    def obter_fontes(self):
        """Obter configuração das fontes de dados"""
        return {
            "fontes_midia": [
                {
                    "id": "g1_df",
                    "nome": "G1 DF",
                    "url_base": "https://g1.globo.com/df/",
                    "tipo": "rss",
                    "ativa": True,
                    "credibilidade": 0.9,
                    "frequencia_coleta": "30min",
                    "ultima_coleta": (datetime.now()).isoformat(),
                    "itens_coletados_hoje": 8
                },
                {
                    "id": "correio_braziliense",
                    "nome": "Correio Braziliense",
                    "url_base": "https://www.correiobraziliense.com.br/",
                    "tipo": "rss",
                    "ativa": True,
                    "credibilidade": 0.85,
                    "frequencia_coleta": "30min",
                    "ultima_coleta": (datetime.now()).isoformat(),
                    "itens_coletados_hoje": 12
                },
                {
                    "id": "metropoles",
                    "nome": "Metrópoles",
                    "url_base": "https://www.metropoles.com/",
                    "tipo": "rss",
                    "ativa": True,
                    "credibilidade": 0.8,
                    "frequencia_coleta": "30min",
                    "ultima_coleta": (datetime.now()).isoformat(),
                    "itens_coletados_hoje": 6
                },
                {
                    "id": "agencia_brasilia",
                    "nome": "Agência Brasília",
                    "url_base": "https://www.agenciabrasilia.df.gov.br/",
                    "tipo": "rss",
                    "ativa": True,
                    "credibilidade": 0.75,
                    "frequencia_coleta": "60min",
                    "ultima_coleta": (datetime.now()).isoformat(),
                    "itens_coletados_hoje": 4
                }
            ],
            "fontes_pesquisas": [
                {
                    "id": "datafolha",
                    "nome": "Datafolha",
                    "credibilidade": 0.95,
                    "ativa": True,
                    "ultima_pesquisa": "2025-09-15",
                    "frequencia_media": "quinzenal"
                },
                {
                    "id": "ipec",
                    "nome": "Ipec",
                    "credibilidade": 0.9,
                    "ativa": True,
                    "ultima_pesquisa": "2025-09-10",
                    "frequencia_media": "quinzenal"
                },
                {
                    "id": "quaest",
                    "nome": "Quaest",
                    "credibilidade": 0.85,
                    "ativa": True,
                    "ultima_pesquisa": "2025-09-08",
                    "frequencia_media": "mensal"
                }
            ],
            "estatisticas": {
                "total_fontes_ativas": 7,
                "itens_coletados_hoje": 30,
                "credibilidade_media": 0.84,
                "ultima_atualizacao": datetime.now().isoformat()
            }
        }
    
    def obter_config_agentes(self):
        """Obter configuração dos agentes"""
        return {
            "agentes": {
                "A1_harvester": {
                    "nome": "Coletor de Dados",
                    "ativo": True,
                    "frequencia": "30min",
                    "timeout": "120s",
                    "max_itens_por_fonte": 50,
                    "filtros": ["DF", "Distrito Federal", "Brasília"],
                    "ultima_execucao": datetime.now().isoformat(),
                    "status": "ativo"
                },
                "A2_normalizer": {
                    "nome": "Normalizador",
                    "ativo": True,
                    "timeout": "60s",
                    "validacao_schema": True,
                    "remover_boilerplate": True,
                    "corrigir_encoding": True,
                    "ultima_execucao": datetime.now().isoformat(),
                    "status": "ativo"
                },
                "A3_classifier": {
                    "nome": "Classificador",
                    "ativo": True,
                    "timeout": "180s",
                    "confianca_minima": 0.7,
                    "temas_disponiveis": ["economia", "segurança", "saúde", "educação", "infraestrutura", "corrupção", "costumes", "outros"],
                    "modelo_sentimento": "transformers",
                    "ultima_execucao": datetime.now().isoformat(),
                    "status": "ativo"
                },
                "A4_poll_parser": {
                    "nome": "Extrator de Pesquisas",
                    "ativo": True,
                    "timeout": "90s",
                    "institutos_validos": ["Datafolha", "Ipec", "Quaest", "AtlasIntel", "Paraná Pesquisas"],
                    "validar_metodologia": True,
                    "ultima_execucao": datetime.now().isoformat(),
                    "status": "ativo"
                },
                "A7_copilot": {
                    "nome": "Copilot Q&A",
                    "ativo": True,
                    "timeout": "30s",
                    "max_tokens": 1000,
                    "temperatura": 0.3,
                    "contexto_historico": "7 dias",
                    "ultima_execucao": datetime.now().isoformat(),
                    "status": "ativo"
                }
            },
            "pipeline": {
                "modo_execucao": "automatico",
                "intervalo_execucao": "30min",
                "retry_tentativas": 3,
                "retry_delay": "60s",
                "notificar_erros": True,
                "log_level": "INFO"
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def obter_config_alertas(self):
        """Obter configuração dos alertas"""
        return {
            "regras_alertas": [
                {
                    "id": "queda_sentimento",
                    "nome": "Queda de Sentimento",
                    "ativa": True,
                    "condicao": "delta_sentimento < -0.3 AND periodo <= 48h",
                    "severidade": "alta",
                    "notificar": True,
                    "cooldown": "6h"
                },
                {
                    "id": "pico_mencoes",
                    "nome": "Pico de Menções",
                    "ativa": True,
                    "condicao": "mencoes_dia > media_historica * 2.5",
                    "severidade": "media",
                    "notificar": True,
                    "cooldown": "24h"
                },
                {
                    "id": "mencoes_negativas",
                    "nome": "Alto Volume de Menções Negativas",
                    "ativa": True,
                    "condicao": "mencoes_negativas >= 3 AND credibilidade >= 0.75",
                    "severidade": "alta",
                    "notificar": True,
                    "cooldown": "12h"
                },
                {
                    "id": "oportunidade_tema",
                    "nome": "Oportunidade de Tema",
                    "ativa": True,
                    "condicao": "concorrencia_tema < 0.3 AND relevancia_candidato > 0.7",
                    "severidade": "baixa",
                    "notificar": False,
                    "cooldown": "7d"
                },
                {
                    "id": "pesquisa_nova",
                    "nome": "Nova Pesquisa",
                    "ativa": True,
                    "condicao": "nova_pesquisa = true",
                    "severidade": "info",
                    "notificar": True,
                    "cooldown": "1h"
                }
            ],
            "configuracao_notificacoes": {
                "email_ativo": True,
                "email_destinatarios": ["admin@sistema.com"],
                "webhook_ativo": False,
                "webhook_url": "",
                "slack_ativo": False,
                "slack_channel": ""
            },
            "estatisticas": {
                "alertas_hoje": 5,
                "alertas_semana": 23,
                "regras_ativas": 5,
                "taxa_precisao": 0.87
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def obter_config_geral(self):
        """Obter configuração geral do sistema"""
        return {
            "sistema": {
                "nome": "Monitor Político DF 2026",
                "versao": "1.0.0",
                "ambiente": "producao",
                "timezone": "America/Sao_Paulo",
                "idioma": "pt-BR"
            },
            "banco_dados": {
                "tipo": "sqlite",
                "arquivo": "eleicoes_df_2026.db",
                "backup_automatico": True,
                "frequencia_backup": "diario",
                "retencao_dados": "365 dias"
            },
            "api": {
                "rate_limit": "1000/hora",
                "cors_enabled": True,
                "cache_ttl": "300s",
                "log_requests": True
            },
            "relatorios": {
                "formato_padrao": "PDF",
                "gerar_automatico": True,
                "dia_geracao": "segunda",
                "hora_geracao": "18:30",
                "incluir_graficos": True,
                "incluir_anexos": True
            },
            "manutencao": {
                "ultima_atualizacao": "2025-09-17T10:00:00",
                "proxima_manutencao": "2025-09-24T02:00:00",
                "backup_automatico": True,
                "limpeza_logs": "30 dias"
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def atualizar_configuracao(self, secao, dados):
        """Atualizar configuração de uma seção"""
        return {
            "success": True,
            "secao": secao,
            "alteracoes": dados.get('alteracoes', {}),
            "timestamp": datetime.now().isoformat(),
            "message": f"Configuração da seção '{secao}' atualizada com sucesso"
        }

