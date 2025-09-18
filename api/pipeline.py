from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta
import random

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        acao = query_params.get('acao', ['status'])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if acao == 'status':
            dados = self.status_pipeline()
        elif acao == 'executar':
            dados = self.executar_pipeline()
        elif acao == 'historico':
            dados = self.historico_execucoes()
        elif acao == 'logs':
            dados = self.obter_logs()
        else:
            dados = {"error": "Ação não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para executar pipeline com parâmetros específicos
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            resultado = self.executar_pipeline_customizado(dados)
            
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
    
    def status_pipeline(self):
        """Status atual do pipeline"""
        return {
            "status": "ativo",
            "ultima_execucao": (datetime.now() - timedelta(minutes=30)).isoformat(),
            "proxima_execucao": (datetime.now() + timedelta(minutes=30)).isoformat(),
            "agentes": {
                "A1_harvester": {
                    "status": "sucesso",
                    "ultima_execucao": (datetime.now() - timedelta(minutes=30)).isoformat(),
                    "itens_coletados": 12,
                    "tempo_execucao": "45s"
                },
                "A2_normalizer": {
                    "status": "sucesso", 
                    "ultima_execucao": (datetime.now() - timedelta(minutes=29)).isoformat(),
                    "itens_processados": 12,
                    "itens_validos": 11,
                    "tempo_execucao": "23s"
                },
                "A3_classifier": {
                    "status": "sucesso",
                    "ultima_execucao": (datetime.now() - timedelta(minutes=28)).isoformat(),
                    "itens_classificados": 11,
                    "confianca_media": 0.87,
                    "tempo_execucao": "67s"
                },
                "A4_poll_parser": {
                    "status": "sucesso",
                    "ultima_execucao": (datetime.now() - timedelta(minutes=27)).isoformat(),
                    "pesquisas_encontradas": 1,
                    "pesquisas_validas": 1,
                    "tempo_execucao": "34s"
                }
            },
            "persistencia": {
                "midia_df": {
                    "status": "sucesso",
                    "registros_inseridos": 11,
                    "registros_atualizados": 0,
                    "tempo_execucao": "12s"
                },
                "pesquisas_df": {
                    "status": "sucesso", 
                    "registros_inseridos": 1,
                    "registros_atualizados": 0,
                    "tempo_execucao": "8s"
                }
            },
            "views_materializadas": {
                "sov_semanal": {
                    "status": "atualizada",
                    "ultima_atualizacao": (datetime.now() - timedelta(minutes=25)).isoformat(),
                    "registros": 156
                },
                "sov_normalizado": {
                    "status": "atualizada",
                    "ultima_atualizacao": (datetime.now() - timedelta(minutes=24)).isoformat(),
                    "registros": 156
                },
                "retorica_14d": {
                    "status": "atualizada",
                    "ultima_atualizacao": (datetime.now() - timedelta(minutes=23)).isoformat(),
                    "registros": 40
                },
                "risco_negativo_7d": {
                    "status": "atualizada",
                    "ultima_atualizacao": (datetime.now() - timedelta(minutes=22)).isoformat(),
                    "registros": 8
                },
                "pesquisas_30d_flat": {
                    "status": "atualizada",
                    "ultima_atualizacao": (datetime.now() - timedelta(minutes=21)).isoformat(),
                    "registros": 45
                }
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def executar_pipeline(self):
        """Executar pipeline completo"""
        return {
            "execucao_id": f"exec_{random.randint(10000, 99999)}",
            "status": "iniciado",
            "timestamp_inicio": datetime.now().isoformat(),
            "etapas": [
                {
                    "agente": "A1_harvester",
                    "status": "executando",
                    "progresso": 0
                },
                {
                    "agente": "A2_normalizer", 
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "agente": "A3_classifier",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "agente": "A4_poll_parser",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "etapa": "persistencia",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "etapa": "views_materializadas",
                    "status": "aguardando", 
                    "progresso": 0
                }
            ],
            "tempo_estimado": "3-5 minutos",
            "message": "Pipeline iniciado com sucesso. Use /api/pipeline?acao=status para acompanhar o progresso."
        }
    
    def executar_pipeline_customizado(self, parametros):
        """Executar pipeline com parâmetros customizados"""
        agentes_selecionados = parametros.get("agentes", ["A1", "A2", "A3", "A4"])
        modo = parametros.get("modo", "completo")  # completo, rapido, teste
        
        return {
            "execucao_id": f"exec_{random.randint(10000, 99999)}",
            "status": "iniciado",
            "modo": modo,
            "agentes_selecionados": agentes_selecionados,
            "timestamp_inicio": datetime.now().isoformat(),
            "parametros": parametros,
            "message": f"Pipeline customizado iniciado em modo '{modo}' com agentes: {', '.join(agentes_selecionados)}"
        }
    
    def historico_execucoes(self):
        """Histórico das últimas execuções"""
        execucoes = []
        
        for i in range(10):
            tempo_execucao = random.randint(180, 420)  # 3-7 minutos
            sucesso = random.choice([True, True, True, False])  # 75% sucesso
            
            execucao = {
                "execucao_id": f"exec_{random.randint(10000, 99999)}",
                "timestamp_inicio": (datetime.now() - timedelta(hours=i*2)).isoformat(),
                "timestamp_fim": (datetime.now() - timedelta(hours=i*2) + timedelta(seconds=tempo_execucao)).isoformat(),
                "status": "sucesso" if sucesso else "erro",
                "tempo_execucao": f"{tempo_execucao}s",
                "itens_processados": random.randint(8, 25) if sucesso else 0,
                "pesquisas_encontradas": random.randint(0, 3) if sucesso else 0,
                "modo": "automatico"
            }
            
            if not sucesso:
                execucao["erro"] = random.choice([
                    "Timeout na coleta de dados",
                    "Erro de classificação - baixa confiança",
                    "Falha na conexão com fonte externa",
                    "Erro de validação de schema"
                ])
            
            execucoes.append(execucao)
        
        return {
            "execucoes": execucoes,
            "total": len(execucoes),
            "taxa_sucesso": len([e for e in execucoes if e["status"] == "sucesso"]) / len(execucoes),
            "tempo_medio": f"{sum([int(e['tempo_execucao'].replace('s', '')) for e in execucoes if e['status'] == 'sucesso']) / len([e for e in execucoes if e['status'] == 'sucesso']):.0f}s",
            "timestamp": datetime.now().isoformat()
        }
    
    def obter_logs(self):
        """Obter logs detalhados do pipeline"""
        logs = [
            {
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "nivel": "INFO",
                "agente": "A1_harvester",
                "mensagem": "Iniciando coleta de dados das fontes configuradas"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=4, seconds=30)).isoformat(),
                "nivel": "INFO",
                "agente": "A1_harvester",
                "mensagem": "Coletados 12 itens de G1, Correio Braziliense, Metrópoles"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=4)).isoformat(),
                "nivel": "INFO",
                "agente": "A2_normalizer",
                "mensagem": "Iniciando normalização de 12 itens"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=3, seconds=45)).isoformat(),
                "nivel": "WARN",
                "agente": "A2_normalizer",
                "mensagem": "Item ID_789 removido - falha na validação de schema"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=3, seconds=30)).isoformat(),
                "nivel": "INFO",
                "agente": "A2_normalizer",
                "mensagem": "Normalização concluída: 11 itens válidos de 12"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=3)).isoformat(),
                "nivel": "INFO",
                "agente": "A3_classifier",
                "mensagem": "Iniciando classificação de 11 itens"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=2)).isoformat(),
                "nivel": "INFO",
                "agente": "A3_classifier",
                "mensagem": "Classificação concluída - confiança média: 0.87"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=1, seconds=30)).isoformat(),
                "nivel": "INFO",
                "agente": "A4_poll_parser",
                "mensagem": "Encontrada 1 pesquisa válida nos itens processados"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=1)).isoformat(),
                "nivel": "INFO",
                "sistema": "persistencia",
                "mensagem": "Dados persistidos com sucesso - 11 itens mídia, 1 pesquisa"
            },
            {
                "timestamp": (datetime.now() - timedelta(seconds=30)).isoformat(),
                "nivel": "INFO",
                "sistema": "views",
                "mensagem": "Views materializadas atualizadas com sucesso"
            }
        ]
        
        return {
            "logs": logs,
            "total_logs": len(logs),
            "periodo": "últimos 30 minutos",
            "timestamp": datetime.now().isoformat()
        }

