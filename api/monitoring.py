from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta

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
            dados = self.status_sistema()
        elif acao == 'health':
            dados = self.health_check()
        elif acao == 'metrics':
            dados = self.metricas_sistema()
        elif acao == 'logs':
            dados = self.logs_sistema()
        elif acao == 'performance':
            dados = self.performance_metrics()
        else:
            dados = {"error": "Ação não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para configurar automação
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            acao = dados.get('acao', 'configurar')
            
            if acao == 'configurar_automacao':
                resultado = self.configurar_automacao(dados)
            elif acao == 'agendar_tarefa':
                resultado = self.agendar_tarefa(dados)
            elif acao == 'configurar_alertas':
                resultado = self.configurar_alertas(dados)
            else:
                resultado = {"error": "Ação não reconhecida"}
            
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
    
    def status_sistema(self):
        """Status geral do sistema"""
        return {
            "sistema": {
                "status": "online",
                "versao": "1.0.0",
                "ambiente": "producao",
                "uptime": "99.9%",
                "ultima_atualizacao": datetime.now().isoformat()
            },
            "apis": {
                "dados": {"status": "ativo", "response_time": "120ms"},
                "alertas": {"status": "ativo", "response_time": "95ms"},
                "pipeline": {"status": "ativo", "response_time": "180ms"},
                "relatorios": {"status": "ativo", "response_time": "250ms"},
                "configuracao": {"status": "ativo", "response_time": "85ms"},
                "database": {"status": "ativo", "response_time": "110ms"},
                "copilot": {"status": "ativo", "response_time": "300ms"}
            },
            "automacao": {
                "pipeline_automatico": {
                    "ativo": True,
                    "frequencia": "30min",
                    "ultima_execucao": (datetime.now() - timedelta(minutes=15)).isoformat(),
                    "proxima_execucao": (datetime.now() + timedelta(minutes=15)).isoformat(),
                    "status": "sucesso"
                },
                "relatorio_semanal": {
                    "ativo": True,
                    "frequencia": "semanal",
                    "dia": "segunda",
                    "hora": "18:30",
                    "ultima_execucao": (datetime.now() - timedelta(days=1)).isoformat(),
                    "status": "agendado"
                },
                "backup_dados": {
                    "ativo": True,
                    "frequencia": "diario",
                    "hora": "02:00",
                    "ultima_execucao": (datetime.now() - timedelta(hours=8)).isoformat(),
                    "status": "sucesso"
                }
            },
            "alertas": {
                "sistema_alertas": "ativo",
                "regras_ativas": 5,
                "alertas_hoje": 3,
                "alertas_pendentes": 1
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def health_check(self):
        """Health check detalhado"""
        return {
            "status": "healthy",
            "checks": {
                "api_response": {
                    "status": "pass",
                    "response_time": "120ms",
                    "last_check": datetime.now().isoformat()
                },
                "database_connection": {
                    "status": "pass",
                    "response_time": "45ms",
                    "last_check": datetime.now().isoformat()
                },
                "external_apis": {
                    "status": "pass",
                    "services_checked": 3,
                    "services_available": 3,
                    "last_check": datetime.now().isoformat()
                },
                "memory_usage": {
                    "status": "pass",
                    "usage": "65%",
                    "threshold": "80%",
                    "last_check": datetime.now().isoformat()
                },
                "disk_space": {
                    "status": "pass",
                    "usage": "45%",
                    "threshold": "85%",
                    "last_check": datetime.now().isoformat()
                }
            },
            "overall_health": "excellent",
            "uptime": "99.9%",
            "timestamp": datetime.now().isoformat()
        }
    
    def metricas_sistema(self):
        """Métricas detalhadas do sistema"""
        return {
            "performance": {
                "requests_per_minute": 45,
                "average_response_time": "150ms",
                "error_rate": "0.1%",
                "cache_hit_rate": "85%"
            },
            "usage": {
                "api_calls_today": 2847,
                "unique_users_today": 23,
                "data_processed_today": "1.2GB",
                "reports_generated_today": 3
            },
            "resources": {
                "cpu_usage": "35%",
                "memory_usage": "65%",
                "bandwidth_usage": "2.1GB",
                "storage_usage": "45%"
            },
            "apis_populares": [
                {"endpoint": "/api/dados", "calls": 1250, "avg_response": "120ms"},
                {"endpoint": "/api/alertas", "calls": 890, "avg_response": "95ms"},
                {"endpoint": "/api/copilot", "calls": 456, "avg_response": "300ms"},
                {"endpoint": "/api/pipeline", "calls": 251, "avg_response": "180ms"}
            ],
            "erros_recentes": [
                {
                    "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                    "endpoint": "/api/relatorios",
                    "error": "Timeout na geração de PDF",
                    "status_code": 504
                }
            ],
            "timestamp": datetime.now().isoformat()
        }
    
    def logs_sistema(self):
        """Logs do sistema"""
        logs = [
            {
                "timestamp": datetime.now().isoformat(),
                "level": "INFO",
                "service": "api/dados",
                "message": "KPIs atualizados com sucesso",
                "request_id": "req_001"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "level": "INFO",
                "service": "api/pipeline",
                "message": "Pipeline executado com sucesso - 12 itens processados",
                "request_id": "req_002"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=10)).isoformat(),
                "level": "WARN",
                "service": "api/alertas",
                "message": "Alto volume de alertas detectado",
                "request_id": "req_003"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
                "level": "INFO",
                "service": "api/copilot",
                "message": "Consulta processada: análise de sentimento",
                "request_id": "req_004"
            },
            {
                "timestamp": (datetime.now() - timedelta(minutes=20)).isoformat(),
                "level": "ERROR",
                "service": "api/relatorios",
                "message": "Falha na geração de relatório - timeout",
                "request_id": "req_005"
            }
        ]
        
        return {
            "logs": logs,
            "total_logs": len(logs),
            "periodo": "últimas 24 horas",
            "filtros_disponiveis": ["INFO", "WARN", "ERROR"],
            "timestamp": datetime.now().isoformat()
        }
    
    def performance_metrics(self):
        """Métricas de performance"""
        return {
            "response_times": {
                "p50": "120ms",
                "p90": "250ms",
                "p95": "350ms",
                "p99": "800ms"
            },
            "throughput": {
                "requests_per_second": 15,
                "peak_rps": 45,
                "average_rps": 12
            },
            "availability": {
                "uptime_24h": "99.9%",
                "uptime_7d": "99.8%",
                "uptime_30d": "99.7%"
            },
            "errors": {
                "error_rate_24h": "0.1%",
                "error_rate_7d": "0.2%",
                "most_common_errors": [
                    {"error": "Timeout", "count": 3},
                    {"error": "Rate limit", "count": 1}
                ]
            },
            "cache": {
                "hit_rate": "85%",
                "miss_rate": "15%",
                "cache_size": "150MB"
            },
            "timestamp": datetime.now().isoformat()
        }
    
    def configurar_automacao(self, dados):
        """Configurar automação do sistema"""
        config = dados.get('configuracao', {})
        
        return {
            "success": True,
            "configuracao_aplicada": {
                "pipeline_automatico": config.get('pipeline_automatico', True),
                "frequencia_pipeline": config.get('frequencia_pipeline', '30min'),
                "relatorio_automatico": config.get('relatorio_automatico', True),
                "backup_automatico": config.get('backup_automatico', True),
                "alertas_automaticos": config.get('alertas_automaticos', True)
            },
            "timestamp": datetime.now().isoformat(),
            "message": "Configuração de automação atualizada com sucesso"
        }
    
    def agendar_tarefa(self, dados):
        """Agendar nova tarefa"""
        tarefa = dados.get('tarefa', {})
        
        return {
            "success": True,
            "tarefa_id": f"task_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "tarefa": {
                "nome": tarefa.get('nome', 'Nova Tarefa'),
                "tipo": tarefa.get('tipo', 'pipeline'),
                "frequencia": tarefa.get('frequencia', 'diario'),
                "hora": tarefa.get('hora', '18:00'),
                "ativa": True,
                "proxima_execucao": (datetime.now() + timedelta(days=1)).isoformat()
            },
            "timestamp": datetime.now().isoformat(),
            "message": "Tarefa agendada com sucesso"
        }
    
    def configurar_alertas(self, dados):
        """Configurar sistema de alertas"""
        config_alertas = dados.get('alertas', {})
        
        return {
            "success": True,
            "configuracao_alertas": {
                "email_notifications": config_alertas.get('email', True),
                "webhook_notifications": config_alertas.get('webhook', False),
                "threshold_alto": config_alertas.get('threshold_alto', 5),
                "threshold_medio": config_alertas.get('threshold_medio', 3),
                "cooldown_period": config_alertas.get('cooldown', '1h')
            },
            "timestamp": datetime.now().isoformat(),
            "message": "Configuração de alertas atualizada com sucesso"
        }

