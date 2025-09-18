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
        
        tipo = query_params.get('tipo', [''])[0]
        candidato = query_params.get('candidato', [''])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if tipo == 'kpis':
            dados = self.gerar_kpis()
        elif tipo == 'alertas':
            dados = self.gerar_alertas()
        elif tipo == 'sov':
            dados = self.gerar_sov_data(candidato)
        elif tipo == 'retorica':
            dados = self.gerar_retorica_data(candidato)
        elif tipo == 'pesquisas':
            dados = self.gerar_pesquisas_data(candidato)
        elif tipo == 'noticias':
            dados = self.gerar_noticias_data(candidato)
        else:
            dados = {"error": "Tipo não reconhecido"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def gerar_kpis(self):
        return {
            "itens_processados": {
                "valor": 47,
                "trend": "+12%",
                "status": "Ativo",
                "cor": "success"
            },
            "pesquisas_registradas": {
                "valor": 6,
                "trend": "+2",
                "status": "Atualizado", 
                "cor": "info"
            },
            "fontes_alto_alcance": {
                "valor": 5,
                "trend": "=",
                "status": "Estável",
                "cor": "warning"
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_alertas(self):
        alertas = [
            {
                "id": "alert_001",
                "tipo": "queda_sentimento",
                "candidato": "Izalci Lucas",
                "severidade": "alta",
                "mensagem": "Queda de sentimento para Izalci Lucas (Δ≈-0.55 em 48h)",
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "lido": False
            },
            {
                "id": "alert_002", 
                "tipo": "pico_mencoes",
                "candidato": "Celina Leão",
                "severidade": "media",
                "mensagem": "Pico de menções para Celina Leão em 2025-09-16 (11 itens) — ver feed",
                "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
                "lido": False
            },
            {
                "id": "alert_003",
                "tipo": "mencoes_negativas",
                "candidato": "José Roberto Arruda", 
                "severidade": "alta",
                "mensagem": "Alto volume de menções negativas para José Roberto Arruda (3 itens)",
                "timestamp": (datetime.now() - timedelta(minutes=25)).isoformat(),
                "lido": True
            }
        ]
        
        return {
            "alertas": alertas,
            "total": len(alertas),
            "nao_lidos": len([a for a in alertas if not a["lido"]]),
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_sov_data(self, candidato):
        # Dados mock de Share of Voice por tema
        temas = ["economia", "segurança", "saúde", "educação"]
        semanas = []
        
        # Gerar 4 semanas de dados
        for i in range(4):
            data = datetime.now() - timedelta(weeks=i)
            semana_data = {
                "semana": data.strftime("%Y-%m-%d"),
                "dados": []
            }
            
            for tema in temas:
                # Valores mock baseados no candidato
                base_value = 0.2 + random.uniform(-0.1, 0.1)
                if candidato == "Celina Leão" and tema == "economia":
                    base_value = 0.4
                elif candidato == "Izalci Lucas" and tema == "segurança":
                    base_value = 0.35
                
                semana_data["dados"].append({
                    "tema": tema,
                    "sov": round(base_value, 3),
                    "candidato": candidato or "Celina Leão"
                })
            
            semanas.append(semana_data)
        
        return {
            "semanas": semanas,
            "candidato": candidato or "Celina Leão",
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_retorica_data(self, candidato):
        # Dados mock de retórica
        retorica_mock = {
            "Celina Leão": {"proposta": 75, "defesa": 20, "neutra": 5},
            "Izalci Lucas": {"proposta": 60, "ataque": 25, "defesa": 15},
            "Erika Kokay": {"proposta": 50, "ataque": 35, "defesa": 15}
        }
        
        dados = retorica_mock.get(candidato, {"proposta": 70, "defesa": 20, "neutra": 10})
        
        return {
            "candidato": candidato or "Celina Leão",
            "retorica": dados,
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_pesquisas_data(self, candidato):
        # Dados mock de pesquisas
        pesquisas = [
            {
                "data_campo": "2025-09-10",
                "instituto": "Datafolha",
                "cenario": "estimulado",
                "intencao": 28.5
            },
            {
                "data_campo": "2025-09-08", 
                "instituto": "Ipec",
                "cenario": "estimulado",
                "intencao": 26.0
            },
            {
                "data_campo": "2025-09-06",
                "instituto": "Quaest", 
                "cenario": "estimulado",
                "intencao": 25.5
            }
        ]
        
        return {
            "candidato": candidato or "Celina Leão",
            "pesquisas": pesquisas,
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_noticias_data(self, candidato):
        # Dados mock de notícias
        noticias = [
            {
                "id": "noticia_001",
                "data_publicacao": "2025-09-16T14:30:00",
                "fonte": "G1",
                "titulo": f"{candidato or 'Celina Leão'} apresenta proposta para economia do DF",
                "resumo": "Candidata detalha plano econômico com foco em geração de empregos e atração de investimentos para o Distrito Federal.",
                "url": "https://g1.globo.com/exemplo",
                "sentimento": 0.7
            },
            {
                "id": "noticia_002", 
                "data_publicacao": "2025-09-16T10:15:00",
                "fonte": "Correio Braziliense",
                "titulo": f"Pesquisa mostra {candidato or 'Celina Leão'} na liderança",
                "resumo": "Levantamento do instituto Datafolha aponta candidata com 28% das intenções de voto para o governo do DF.",
                "url": "https://correiobraziliense.com.br/exemplo",
                "sentimento": 0.5
            },
            {
                "id": "noticia_003",
                "data_publicacao": "2025-09-15T16:45:00", 
                "fonte": "Metrópoles",
                "titulo": f"{candidato or 'Celina Leão'} participa de debate sobre segurança",
                "resumo": "Candidata apresentou propostas para redução da criminalidade e fortalecimento da segurança pública no DF.",
                "url": "https://metropoles.com/exemplo",
                "sentimento": 0.3
            }
        ]
        
        return {
            "candidato": candidato or "Celina Leão",
            "noticias": noticias,
            "timestamp": datetime.now().isoformat()
        }

