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
        
        acao = query_params.get('acao', ['listar'])[0]
        candidato = query_params.get('candidato', [''])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if acao == 'listar':
            dados = self.listar_alertas(candidato)
        elif acao == 'marcar_lido':
            alert_id = query_params.get('id', [''])[0]
            dados = self.marcar_como_lido(alert_id)
        elif acao == 'estatisticas':
            dados = self.gerar_estatisticas_alertas()
        else:
            dados = {"error": "Ação não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para criar novos alertas
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            resultado = self.criar_alerta(dados)
            
            self.send_response(201)
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
    
    def listar_alertas(self, candidato_filtro=""):
        """Listar alertas com filtro opcional por candidato"""
        
        alertas_mock = [
            {
                "id": "alert_001",
                "tipo": "queda_sentimento",
                "candidato": "Izalci Lucas",
                "severidade": "alta",
                "titulo": "Queda de Sentimento Detectada",
                "mensagem": "Queda significativa de sentimento para Izalci Lucas (Δ≈-0.55 em 48h). Fontes: G1, Correio Braziliense.",
                "detalhes": {
                    "sentimento_anterior": 0.2,
                    "sentimento_atual": -0.35,
                    "delta": -0.55,
                    "periodo": "48h",
                    "fontes_envolvidas": ["G1", "Correio Braziliense"],
                    "mencoes_negativas": 3
                },
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "lido": False,
                "acao_sugerida": "Resposta rápida nas redes sociais e agenda positiva"
            },
            {
                "id": "alert_002", 
                "tipo": "pico_mencoes",
                "candidato": "Celina Leão",
                "severidade": "media",
                "titulo": "Pico de Menções Detectado",
                "mensagem": "Pico de menções para Celina Leão em 2025-09-16 (11 itens vs. média de 4/dia)",
                "detalhes": {
                    "mencoes_dia": 11,
                    "media_historica": 4,
                    "multiplicador": 2.75,
                    "temas_dominantes": ["economia", "infraestrutura"],
                    "sentimento_medio": 0.45
                },
                "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
                "lido": False,
                "acao_sugerida": "Aproveitar momentum para amplificar mensagem"
            },
            {
                "id": "alert_003",
                "tipo": "mencoes_negativas",
                "candidato": "José Roberto Arruda", 
                "severidade": "alta",
                "titulo": "Alto Volume de Menções Negativas",
                "mensagem": "Alto volume de menções negativas para José Roberto Arruda (3 itens de alto alcance)",
                "detalhes": {
                    "mencoes_negativas": 3,
                    "score_credibilidade_medio": 0.85,
                    "temas_envolvidos": ["corrupção", "gestão"],
                    "alcance_estimado": "alto",
                    "fontes": ["Metrópoles", "Correio Braziliense", "G1"]
                },
                "timestamp": (datetime.now() - timedelta(minutes=25)).isoformat(),
                "lido": True,
                "acao_sugerida": "Resposta técnica e transparente às acusações"
            },
            {
                "id": "alert_004",
                "tipo": "oportunidade_tema",
                "candidato": "Erika Kokay",
                "severidade": "baixa",
                "titulo": "Oportunidade em Saúde",
                "mensagem": "Tema 'saúde' com baixa concorrência e alta relevância para Erika Kokay",
                "detalhes": {
                    "tema": "saúde",
                    "concorrencia": "baixa",
                    "relevancia_candidato": "alta",
                    "mencoes_concorrentes": 2,
                    "janela_oportunidade": "7 dias"
                },
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                "lido": False,
                "acao_sugerida": "Ampliar presença no tema com propostas específicas"
            },
            {
                "id": "alert_005",
                "tipo": "pesquisa_nova",
                "candidato": "Todos",
                "severidade": "info",
                "titulo": "Nova Pesquisa Disponível",
                "mensagem": "Nova pesquisa Datafolha disponível com dados de intenção de voto",
                "detalhes": {
                    "instituto": "Datafolha",
                    "data_campo": "2025-09-15",
                    "amostra": 1200,
                    "margem_erro": 2.9,
                    "cenario": "estimulado"
                },
                "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
                "lido": False,
                "acao_sugerida": "Analisar posicionamento e tendências"
            }
        ]
        
        # Filtrar por candidato se especificado
        if candidato_filtro:
            alertas_filtrados = [a for a in alertas_mock if a["candidato"] == candidato_filtro or a["candidato"] == "Todos"]
        else:
            alertas_filtrados = alertas_mock
        
        return {
            "alertas": alertas_filtrados,
            "total": len(alertas_filtrados),
            "nao_lidos": len([a for a in alertas_filtrados if not a["lido"]]),
            "por_severidade": {
                "alta": len([a for a in alertas_filtrados if a["severidade"] == "alta"]),
                "media": len([a for a in alertas_filtrados if a["severidade"] == "media"]),
                "baixa": len([a for a in alertas_filtrados if a["severidade"] == "baixa"]),
                "info": len([a for a in alertas_filtrados if a["severidade"] == "info"])
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def marcar_como_lido(self, alert_id):
        """Marcar alerta como lido"""
        return {
            "success": True,
            "alert_id": alert_id,
            "message": f"Alerta {alert_id} marcado como lido",
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_estatisticas_alertas(self):
        """Gerar estatísticas dos alertas"""
        return {
            "ultimas_24h": {
                "total": 5,
                "alta_severidade": 2,
                "media_severidade": 1,
                "baixa_severidade": 1,
                "info": 1
            },
            "ultima_semana": {
                "total": 23,
                "alta_severidade": 8,
                "media_severidade": 7,
                "baixa_severidade": 5,
                "info": 3
            },
            "tipos_mais_frequentes": [
                {"tipo": "queda_sentimento", "count": 8},
                {"tipo": "mencoes_negativas", "count": 6},
                {"tipo": "pico_mencoes", "count": 4},
                {"tipo": "oportunidade_tema", "count": 3},
                {"tipo": "pesquisa_nova", "count": 2}
            ],
            "candidatos_mais_alertas": [
                {"candidato": "José Roberto Arruda", "count": 6},
                {"candidato": "Izalci Lucas", "count": 5},
                {"candidato": "Celina Leão", "count": 4},
                {"candidato": "Erika Kokay", "count": 3},
                {"candidato": "Damares Alves", "count": 2}
            ],
            "timestamp": datetime.now().isoformat()
        }
    
    def criar_alerta(self, dados):
        """Criar novo alerta"""
        novo_alerta = {
            "id": f"alert_{random.randint(1000, 9999)}",
            "tipo": dados.get("tipo", "manual"),
            "candidato": dados.get("candidato", ""),
            "severidade": dados.get("severidade", "media"),
            "titulo": dados.get("titulo", ""),
            "mensagem": dados.get("mensagem", ""),
            "detalhes": dados.get("detalhes", {}),
            "timestamp": datetime.now().isoformat(),
            "lido": False,
            "acao_sugerida": dados.get("acao_sugerida", "")
        }
        
        return {
            "success": True,
            "alerta": novo_alerta,
            "message": "Alerta criado com sucesso"
        }

