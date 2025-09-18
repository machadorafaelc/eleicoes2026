from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta
import base64

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        acao = query_params.get('acao', ['listar'])[0]
        tipo = query_params.get('tipo', ['semanal'])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if acao == 'listar':
            dados = self.listar_relatorios()
        elif acao == 'gerar':
            dados = self.gerar_relatorio(tipo)
        elif acao == 'download':
            relatorio_id = query_params.get('id', [''])[0]
            dados = self.download_relatorio(relatorio_id)
        elif acao == 'status':
            dados = self.status_geracao()
        else:
            dados = {"error": "Ação não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para gerar relatórios customizados
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            resultado = self.gerar_relatorio_customizado(dados)
            
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
    
    def listar_relatorios(self):
        """Listar relatórios disponíveis"""
        relatorios = [
            {
                "id": "rel_20250916",
                "tipo": "semanal",
                "titulo": "Relatório Semanal - 09 a 16 Set 2025",
                "data_geracao": "2025-09-16T18:30:00",
                "periodo": {
                    "inicio": "2025-09-09",
                    "fim": "2025-09-16"
                },
                "status": "concluido",
                "tamanho": "2.3 MB",
                "paginas": 12,
                "url_download": "/api/relatorios?acao=download&id=rel_20250916"
            },
            {
                "id": "rel_20250909",
                "tipo": "semanal", 
                "titulo": "Relatório Semanal - 02 a 09 Set 2025",
                "data_geracao": "2025-09-09T18:30:00",
                "periodo": {
                    "inicio": "2025-09-02",
                    "fim": "2025-09-09"
                },
                "status": "concluido",
                "tamanho": "2.1 MB",
                "paginas": 11,
                "url_download": "/api/relatorios?acao=download&id=rel_20250909"
            },
            {
                "id": "rel_20250902",
                "tipo": "semanal",
                "titulo": "Relatório Semanal - 26 Ago a 02 Set 2025", 
                "data_geracao": "2025-09-02T18:30:00",
                "periodo": {
                    "inicio": "2025-08-26",
                    "fim": "2025-09-02"
                },
                "status": "concluido",
                "tamanho": "1.9 MB",
                "paginas": 10,
                "url_download": "/api/relatorios?acao=download&id=rel_20250902"
            },
            {
                "id": "rel_custom_001",
                "tipo": "customizado",
                "titulo": "Análise Comparativa - Celina vs Izalci",
                "data_geracao": "2025-09-15T14:20:00",
                "periodo": {
                    "inicio": "2025-08-15",
                    "fim": "2025-09-15"
                },
                "status": "concluido",
                "tamanho": "1.5 MB", 
                "paginas": 8,
                "candidatos": ["Celina Leão", "Izalci Lucas"],
                "url_download": "/api/relatorios?acao=download&id=rel_custom_001"
            }
        ]
        
        return {
            "relatorios": relatorios,
            "total": len(relatorios),
            "tipos_disponiveis": ["semanal", "mensal", "customizado", "comparativo"],
            "ultimo_semanal": relatorios[0]["data_geracao"],
            "proximo_semanal": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%dT18:30:00"),
            "timestamp": datetime.now().isoformat()
        }
    
    def gerar_relatorio(self, tipo):
        """Gerar novo relatório"""
        if tipo == "semanal":
            return self.gerar_relatorio_semanal()
        elif tipo == "mensal":
            return self.gerar_relatorio_mensal()
        else:
            return {"error": f"Tipo de relatório '{tipo}' não suportado"}
    
    def gerar_relatorio_semanal(self):
        """Gerar relatório semanal"""
        hoje = datetime.now()
        inicio_semana = hoje - timedelta(days=7)
        
        return {
            "relatorio_id": f"rel_{hoje.strftime('%Y%m%d')}",
            "tipo": "semanal",
            "status": "gerando",
            "titulo": f"Relatório Semanal - {inicio_semana.strftime('%d %b')} a {hoje.strftime('%d %b %Y')}",
            "periodo": {
                "inicio": inicio_semana.strftime("%Y-%m-%d"),
                "fim": hoje.strftime("%Y-%m-%d")
            },
            "timestamp_inicio": datetime.now().isoformat(),
            "tempo_estimado": "2-3 minutos",
            "etapas": [
                {
                    "nome": "Coleta de dados",
                    "status": "executando",
                    "progresso": 25
                },
                {
                    "nome": "Análise de sentimento",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "nome": "Geração de gráficos",
                    "status": "aguardando", 
                    "progresso": 0
                },
                {
                    "nome": "Compilação PDF",
                    "status": "aguardando",
                    "progresso": 0
                }
            ],
            "message": "Relatório semanal iniciado. Use /api/relatorios?acao=status para acompanhar o progresso."
        }
    
    def gerar_relatorio_mensal(self):
        """Gerar relatório mensal"""
        hoje = datetime.now()
        inicio_mes = hoje.replace(day=1)
        
        return {
            "relatorio_id": f"rel_mensal_{hoje.strftime('%Y%m')}",
            "tipo": "mensal",
            "status": "gerando",
            "titulo": f"Relatório Mensal - {inicio_mes.strftime('%B %Y')}",
            "periodo": {
                "inicio": inicio_mes.strftime("%Y-%m-%d"),
                "fim": hoje.strftime("%Y-%m-%d")
            },
            "timestamp_inicio": datetime.now().isoformat(),
            "tempo_estimado": "5-8 minutos",
            "etapas": [
                {
                    "nome": "Coleta de dados históricos",
                    "status": "executando",
                    "progresso": 15
                },
                {
                    "nome": "Análise de tendências",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "nome": "Comparação com mês anterior",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "nome": "Geração de gráficos avançados",
                    "status": "aguardando",
                    "progresso": 0
                },
                {
                    "nome": "Compilação PDF",
                    "status": "aguardando",
                    "progresso": 0
                }
            ],
            "message": "Relatório mensal iniciado. Processamento mais longo devido ao volume de dados."
        }
    
    def gerar_relatorio_customizado(self, parametros):
        """Gerar relatório customizado"""
        candidatos = parametros.get("candidatos", [])
        periodo_inicio = parametros.get("periodo_inicio", "")
        periodo_fim = parametros.get("periodo_fim", "")
        secoes = parametros.get("secoes", ["resumo", "sov", "sentimento"])
        
        return {
            "relatorio_id": f"rel_custom_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "tipo": "customizado",
            "status": "gerando",
            "titulo": f"Relatório Customizado - {periodo_inicio} a {periodo_fim}",
            "parametros": {
                "candidatos": candidatos,
                "periodo": {
                    "inicio": periodo_inicio,
                    "fim": periodo_fim
                },
                "secoes": secoes
            },
            "timestamp_inicio": datetime.now().isoformat(),
            "tempo_estimado": "3-5 minutos",
            "message": f"Relatório customizado iniciado para {len(candidatos)} candidatos no período especificado."
        }
    
    def status_geracao(self):
        """Status da geração de relatórios"""
        return {
            "relatorios_em_andamento": [
                {
                    "relatorio_id": "rel_20250917",
                    "tipo": "semanal",
                    "progresso_geral": 75,
                    "etapa_atual": "Geração de gráficos",
                    "tempo_restante": "45s",
                    "timestamp_inicio": (datetime.now() - timedelta(minutes=2)).isoformat()
                }
            ],
            "fila_geracao": [],
            "ultimo_concluido": {
                "relatorio_id": "rel_20250916",
                "tipo": "semanal",
                "timestamp_conclusao": (datetime.now() - timedelta(hours=2)).isoformat(),
                "tempo_total": "2m 34s"
            },
            "estatisticas": {
                "relatorios_gerados_hoje": 3,
                "relatorios_gerados_semana": 12,
                "tempo_medio_geracao": "2m 45s",
                "taxa_sucesso": 0.95
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def download_relatorio(self, relatorio_id):
        """Simular download de relatório"""
        # Em produção, retornaria o arquivo PDF real
        # Aqui retornamos metadados e um link simulado
        
        relatorios_mock = {
            "rel_20250916": {
                "titulo": "Relatório Semanal - 09 a 16 Set 2025",
                "tamanho": "2.3 MB",
                "paginas": 12
            },
            "rel_20250909": {
                "titulo": "Relatório Semanal - 02 a 09 Set 2025", 
                "tamanho": "2.1 MB",
                "paginas": 11
            }
        }
        
        if relatorio_id not in relatorios_mock:
            return {"error": "Relatório não encontrado"}
        
        relatorio = relatorios_mock[relatorio_id]
        
        return {
            "relatorio_id": relatorio_id,
            "titulo": relatorio["titulo"],
            "tamanho": relatorio["tamanho"],
            "paginas": relatorio["paginas"],
            "formato": "PDF",
            "url_download": f"https://storage.exemplo.com/relatorios/{relatorio_id}.pdf",
            "expires_in": "24 horas",
            "timestamp": datetime.now().isoformat(),
            "message": "Link de download gerado com sucesso. Válido por 24 horas."
        }

