from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        tabela = query_params.get('tabela', [''])[0]
        acao = query_params.get('acao', ['select'])[0]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if acao == 'select':
            dados = self.select_dados(tabela, query_params)
        elif acao == 'schema':
            dados = self.obter_schema(tabela)
        elif acao == 'stats':
            dados = self.obter_estatisticas(tabela)
        elif acao == 'backup':
            dados = self.criar_backup()
        else:
            dados = {"error": "Ação não reconhecida"}
        
        self.wfile.write(json.dumps(dados, ensure_ascii=False).encode('utf-8'))
    
    def do_POST(self):
        # Para inserir/atualizar dados
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            dados = json.loads(post_data.decode('utf-8'))
            tabela = dados.get('tabela', '')
            acao = dados.get('acao', 'insert')
            
            if acao == 'insert':
                resultado = self.inserir_dados(tabela, dados.get('dados', []))
            elif acao == 'update':
                resultado = self.atualizar_dados(tabela, dados.get('dados', {}), dados.get('condicao', {}))
            elif acao == 'upsert':
                resultado = self.upsert_dados(tabela, dados.get('dados', []))
            elif acao == 'delete':
                resultado = self.deletar_dados(tabela, dados.get('condicao', {}))
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
    
    def select_dados(self, tabela, query_params):
        """Simular SELECT de dados"""
        
        if tabela == 'midia_df':
            return self.select_midia_df(query_params)
        elif tabela == 'pesquisas_df':
            return self.select_pesquisas_df(query_params)
        elif tabela == 'alertas':
            return self.select_alertas(query_params)
        elif tabela == 'sov_semanal':
            return self.select_sov_semanal(query_params)
        elif tabela == 'sov_normalizado':
            return self.select_sov_normalizado(query_params)
        elif tabela == 'retorica_14d':
            return self.select_retorica_14d(query_params)
        elif tabela == 'risco_negativo_7d':
            return self.select_risco_negativo_7d(query_params)
        elif tabela == 'pesquisas_30d_flat':
            return self.select_pesquisas_30d_flat(query_params)
        else:
            return {"error": f"Tabela '{tabela}' não encontrada"}
    
    def select_midia_df(self, query_params):
        """Dados mock da tabela midia_df"""
        candidato = query_params.get('candidato', [''])[0]
        limite = int(query_params.get('limit', ['50'])[0])
        
        dados_mock = []
        candidatos = ["Celina Leão", "Izalci Lucas", "Erika Kokay", "José Roberto Arruda", "Damares Alves"]
        
        for i in range(limite):
            item = {
                "id": f"item_{i+1:03d}",
                "candidato": candidato if candidato else candidatos[i % len(candidatos)],
                "fonte": ["G1", "Correio Braziliense", "Metrópoles"][i % 3],
                "url": f"https://exemplo.com/noticia_{i+1}",
                "tipo": "noticia",
                "titulo": f"Notícia sobre política no DF - Item {i+1}",
                "data_publicacao": (datetime.now() - timedelta(days=i//10)).strftime("%Y-%m-%d"),
                "texto": f"Texto da notícia {i+1} sobre política no Distrito Federal...",
                "resumo": f"Resumo da notícia {i+1}",
                "score_credibilidade": round(0.7 + (i % 3) * 0.1, 2),
                "tema": ["economia", "segurança", "saúde"][i % 3],
                "sentimento": round(-0.5 + (i % 11) * 0.1, 2),
                "retorica": ["proposta", "ataque", "defesa", "neutra"][i % 4],
                "alvo": ["auto", "adversario", "instituicao", "eleitorado"][i % 4],
                "origem_coleta": "A1_harvester"
            }
            dados_mock.append(item)
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "midia_df",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_pesquisas_df(self, query_params):
        """Dados mock da tabela pesquisas_df"""
        limite = int(query_params.get('limit', ['10'])[0])
        
        dados_mock = [
            {
                "id": "pesq_001",
                "instituto": "Datafolha",
                "local": "Distrito Federal",
                "data_campo": "2025-09-15",
                "amostra": 1200,
                "margem": 2.9,
                "metodologia": "Telefônica",
                "cenario": "estimulado",
                "resultado_json": {
                    "Celina Leão": 28.5,
                    "Izalci Lucas": 24.0,
                    "Erika Kokay": 18.5,
                    "José Roberto Arruda": 12.0,
                    "Outros": 17.0
                },
                "fonte_url": "https://datafolha.folha.uol.com.br/exemplo",
                "confiabilidade_baixa": False
            },
            {
                "id": "pesq_002",
                "instituto": "Ipec",
                "local": "Distrito Federal",
                "data_campo": "2025-09-10",
                "amostra": 1000,
                "margem": 3.2,
                "metodologia": "Presencial",
                "cenario": "estimulado",
                "resultado_json": {
                    "Celina Leão": 26.0,
                    "Izalci Lucas": 25.5,
                    "Erika Kokay": 19.0,
                    "José Roberto Arruda": 13.5,
                    "Outros": 16.0
                },
                "fonte_url": "https://ipec.com.br/exemplo",
                "confiabilidade_baixa": False
            }
        ]
        
        return {
            "dados": dados_mock[:limite],
            "total": len(dados_mock),
            "tabela": "pesquisas_df",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_sov_semanal(self, query_params):
        """Dados mock da view sov_semanal"""
        candidato = query_params.get('candidato', [''])[0]
        
        dados_mock = []
        candidatos = ["Celina Leão", "Izalci Lucas", "Erika Kokay"] if not candidato else [candidato]
        temas = ["economia", "segurança", "saúde", "educação"]
        
        for semana in range(4):
            data_semana = datetime.now() - timedelta(weeks=semana)
            for cand in candidatos:
                for tema in temas:
                    dados_mock.append({
                        "candidato": cand,
                        "semana": data_semana.strftime("%Y-%m-%d"),
                        "tema_flat": tema,
                        "mentions_candidato_tema": 5 + (semana * 2) + hash(cand + tema) % 10
                    })
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "sov_semanal",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_sov_normalizado(self, query_params):
        """Dados mock da view sov_normalizado"""
        candidato = query_params.get('candidato', [''])[0]
        
        dados_mock = []
        candidatos = ["Celina Leão", "Izalci Lucas", "Erika Kokay"] if not candidato else [candidato]
        temas = ["economia", "segurança", "saúde", "educação"]
        
        for semana in range(4):
            data_semana = datetime.now() - timedelta(weeks=semana)
            for cand in candidatos:
                for tema in temas:
                    # Simular Share of Voice normalizado
                    base_sov = 0.25 + (hash(cand + tema) % 100) / 400  # 0.25 a 0.5
                    if cand == "Celina Leão" and tema == "economia":
                        base_sov = 0.4
                    elif cand == "Izalci Lucas" and tema == "segurança":
                        base_sov = 0.35
                    
                    dados_mock.append({
                        "candidato": cand,
                        "semana": data_semana.strftime("%Y-%m-%d"),
                        "tema": tema,
                        "sov": round(base_sov, 3)
                    })
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "sov_normalizado",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_retorica_14d(self, query_params):
        """Dados mock da view retorica_14d"""
        candidatos = ["Celina Leão", "Izalci Lucas", "Erika Kokay", "José Roberto Arruda", "Damares Alves"]
        
        dados_mock = []
        for cand in candidatos:
            # Distribuição mock de retórica
            if cand == "Celina Leão":
                retorica = {"proposta": 75, "defesa": 20, "neutra": 5}
            elif cand == "Izalci Lucas":
                retorica = {"proposta": 60, "ataque": 25, "defesa": 15}
            else:
                retorica = {"proposta": 50, "ataque": 30, "defesa": 20}
            
            for tipo, pct in retorica.items():
                dados_mock.append({
                    "candidato": cand,
                    "retorica": tipo,
                    "pct": pct
                })
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "retorica_14d",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_risco_negativo_7d(self, query_params):
        """Dados mock da view risco_negativo_7d"""
        dados_mock = [
            {
                "candidato": "José Roberto Arruda",
                "men_negativas_alc": 3,
                "ultima_mencao": (datetime.now() - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                "candidato": "Damares Alves",
                "men_negativas_alc": 1,
                "ultima_mencao": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
            }
        ]
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "risco_negativo_7d",
            "timestamp": datetime.now().isoformat()
        }
    
    def select_pesquisas_30d_flat(self, query_params):
        """Dados mock da view pesquisas_30d_flat"""
        dados_mock = [
            {
                "data_campo": "2025-09-15",
                "instituto": "Datafolha",
                "cenario": "estimulado",
                "candidato": "Celina Leão",
                "intencao": 28.5
            },
            {
                "data_campo": "2025-09-15",
                "instituto": "Datafolha", 
                "cenario": "estimulado",
                "candidato": "Izalci Lucas",
                "intencao": 24.0
            },
            {
                "data_campo": "2025-09-10",
                "instituto": "Ipec",
                "cenario": "estimulado",
                "candidato": "Celina Leão",
                "intencao": 26.0
            },
            {
                "data_campo": "2025-09-10",
                "instituto": "Ipec",
                "cenario": "estimulado",
                "candidato": "Izalci Lucas",
                "intencao": 25.5
            }
        ]
        
        return {
            "dados": dados_mock,
            "total": len(dados_mock),
            "tabela": "pesquisas_30d_flat",
            "timestamp": datetime.now().isoformat()
        }
    
    def obter_schema(self, tabela):
        """Obter schema de uma tabela"""
        schemas = {
            "midia_df": {
                "colunas": [
                    {"nome": "id", "tipo": "TEXT", "pk": True},
                    {"nome": "candidato", "tipo": "TEXT"},
                    {"nome": "fonte", "tipo": "TEXT"},
                    {"nome": "url", "tipo": "TEXT"},
                    {"nome": "tipo", "tipo": "TEXT"},
                    {"nome": "titulo", "tipo": "TEXT"},
                    {"nome": "data_publicacao", "tipo": "DATE"},
                    {"nome": "texto", "tipo": "TEXT"},
                    {"nome": "resumo", "tipo": "TEXT"},
                    {"nome": "score_credibilidade", "tipo": "REAL"},
                    {"nome": "tema", "tipo": "JSON"},
                    {"nome": "sentimento", "tipo": "REAL"},
                    {"nome": "retorica", "tipo": "TEXT"},
                    {"nome": "alvo", "tipo": "TEXT"},
                    {"nome": "origem_coleta", "tipo": "TEXT"}
                ]
            },
            "pesquisas_df": {
                "colunas": [
                    {"nome": "id", "tipo": "TEXT", "pk": True},
                    {"nome": "instituto", "tipo": "TEXT"},
                    {"nome": "local", "tipo": "TEXT"},
                    {"nome": "data_campo", "tipo": "DATE"},
                    {"nome": "amostra", "tipo": "INTEGER"},
                    {"nome": "margem", "tipo": "REAL"},
                    {"nome": "metodologia", "tipo": "TEXT"},
                    {"nome": "cenario", "tipo": "TEXT"},
                    {"nome": "resultado_json", "tipo": "JSON"},
                    {"nome": "fonte_url", "tipo": "TEXT"},
                    {"nome": "confiabilidade_baixa", "tipo": "BOOLEAN"}
                ]
            }
        }
        
        return schemas.get(tabela, {"error": f"Schema para tabela '{tabela}' não encontrado"})
    
    def obter_estatisticas(self, tabela):
        """Obter estatísticas de uma tabela"""
        stats_mock = {
            "midia_df": {
                "total_registros": 1247,
                "registros_ultima_semana": 89,
                "candidato_mais_mencoes": "Celina Leão",
                "fonte_mais_ativa": "G1",
                "sentimento_medio": 0.12,
                "ultima_atualizacao": datetime.now().isoformat()
            },
            "pesquisas_df": {
                "total_registros": 23,
                "pesquisas_ultimo_mes": 6,
                "instituto_mais_ativo": "Datafolha",
                "ultima_pesquisa": "2025-09-15",
                "ultima_atualizacao": datetime.now().isoformat()
            }
        }
        
        return stats_mock.get(tabela, {"error": f"Estatísticas para tabela '{tabela}' não encontradas"})
    
    def inserir_dados(self, tabela, dados):
        """Simular inserção de dados"""
        return {
            "success": True,
            "tabela": tabela,
            "registros_inseridos": len(dados) if isinstance(dados, list) else 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def atualizar_dados(self, tabela, dados, condicao):
        """Simular atualização de dados"""
        return {
            "success": True,
            "tabela": tabela,
            "registros_atualizados": 1,
            "condicao": condicao,
            "timestamp": datetime.now().isoformat()
        }
    
    def upsert_dados(self, tabela, dados):
        """Simular upsert de dados"""
        return {
            "success": True,
            "tabela": tabela,
            "registros_inseridos": len(dados) // 2 if isinstance(dados, list) else 0,
            "registros_atualizados": len(dados) // 2 if isinstance(dados, list) else 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def deletar_dados(self, tabela, condicao):
        """Simular deleção de dados"""
        return {
            "success": True,
            "tabela": tabela,
            "registros_deletados": 1,
            "condicao": condicao,
            "timestamp": datetime.now().isoformat()
        }
    
    def criar_backup(self):
        """Simular criação de backup"""
        return {
            "success": True,
            "backup_id": f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "tabelas_incluidas": ["midia_df", "pesquisas_df", "alertas"],
            "tamanho": "15.2 MB",
            "timestamp": datetime.now().isoformat(),
            "url_download": "https://storage.exemplo.com/backups/backup_20250917.zip"
        }

