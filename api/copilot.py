from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        pergunta = query_params.get('q', [''])[0]
        
        if not pergunta:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Parâmetro 'q' é obrigatório"}).encode())
            return
        
        # Simular resposta do Copilot
        resposta = self.gerar_resposta_copilot(pergunta)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(resposta, ensure_ascii=False).encode('utf-8'))
    
    def gerar_resposta_copilot(self, pergunta):
        """Gerar resposta simulada do Copilot"""
        
        candidatos = [
            "Celina Leão", "Izalci Lucas", "Leandro Grass", "Erika Kokay",
            "Damares Alves", "Leila Barros", "José Roberto Arruda", 
            "Paula Belmonte", "Alberto Fraga", "Fábio Félix"
        ]
        
        pergunta_lower = pergunta.lower()
        
        # Detectar candidato na pergunta
        candidato_detectado = "Celina Leão"
        for candidato in candidatos:
            if candidato.lower() in pergunta_lower:
                candidato_detectado = candidato
                break
        
        # Detectar tipo de pergunta
        if "tema" in pergunta_lower and ("forte" in pergunta_lower or "dominante" in pergunta_lower):
            return self.resposta_tema_dominante(candidato_detectado)
        elif "comparar" in pergunta_lower or "vs" in pergunta_lower:
            return self.resposta_comparacao(candidato_detectado)
        elif "risco" in pergunta_lower or "ações" in pergunta_lower:
            return self.resposta_gestao_risco(candidato_detectado)
        else:
            return self.resposta_quadro_geral()
    
    def resposta_tema_dominante(self, candidato):
        temas_mock = {
            "Celina Leão": {"tema": "economia", "qtd": 8, "total": 19, "pct": 42.1},
            "Izalci Lucas": {"tema": "segurança", "qtd": 6, "total": 15, "pct": 40.0},
            "Erika Kokay": {"tema": "saúde", "qtd": 5, "total": 12, "pct": 41.7}
        }
        
        dados = temas_mock.get(candidato, {"tema": "economia", "qtd": 5, "total": 12, "pct": 41.7})
        
        return {
            "tipo": "tema_dominante",
            "candidato": candidato,
            "resposta": f"""**ANÁLISE: Tema dominante - {candidato}**

**Quadro da Semana:**
• **{dados['tema'].title()}** é o tema dominante ({dados['qtd']} de {dados['total']} menções, {dados['pct']:.1f}%)
• Retórica predominantemente propositiva (75% das menções)
• Sentimento médio: +0.30 (positivo)

**O que mudou vs. semana passada:**
• Crescimento em {dados['tema']} (hipótese: agenda estratégica)
• Manutenção do tom propositivo
• Sentimento melhorou

**Oportunidades:**
• Ampliar narrativa em {dados['tema']} com dados concretos
• Explorar temas com menor concorrência
• Manter consistência retórica

**Fontes consultadas:**
• api:copilot/tema_dominante ({candidato}, 7 dias)
• Análise baseada em {dados['total']} menções
• Dados atualizados: {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Disclaimer:** Análise baseada em correlações observadas. Não implica causalidade.""",
            "dados": dados,
            "timestamp": datetime.now().isoformat()
        }
    
    def resposta_comparacao(self, candidato):
        return {
            "tipo": "comparacao",
            "candidatos": [candidato, "Izalci Lucas"],
            "resposta": f"""**COMPARAÇÃO: {candidato} vs Izalci Lucas em Economia (28d)**

**Quadro da Semana:**
• **{candidato}**: 36.5% SoV médio
• **Izalci Lucas**: 26.5% SoV médio  
• Vantagem de 10.0% para {candidato}

**O que mudou vs. semana passada:**
• {candidato} mantém liderança em economia
• Gap aumentou nas últimas semanas
• Ambos com presença consistente no tema

**Riscos:**
• {candidato}: Complacência com liderança
• Izalci Lucas: Necessidade de recuperação
• Ambos: Tema pode perder relevância na agenda

**Oportunidades:**
• {candidato}: Consolidar liderança com propostas concretas
• Izalci Lucas: Explorar subtemas específicos
• Ambos: Buscar diferenciação técnica

**Fontes consultadas:**
• api:copilot/comparar_sov ({candidato}, Izalci Lucas, economia, 28 dias)
• Análise comparativa baseada em 4 pontos de dados
• Dados atualizados: {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Disclaimer:** Correlações observadas. Mudanças de SoV podem refletir agenda midiática.""",
            "dados": {"sov_a": 36.5, "sov_b": 26.5, "vantagem": 10.0},
            "timestamp": datetime.now().isoformat()
        }
    
    def resposta_gestao_risco(self, candidato):
        riscos_mock = {
            "José Roberto Arruda": {"negativas": 3, "nivel": "ALTO"},
            "Damares Alves": {"negativas": 2, "nivel": "MÉDIO"},
            "Erika Kokay": {"negativas": 1, "nivel": "BAIXO"}
        }
        
        dados = riscos_mock.get(candidato, {"negativas": 0, "nivel": "BAIXO"})
        
        if dados["negativas"] == 0:
            resposta_texto = f"""**GESTÃO DE RISCO: {candidato}**

**Quadro da Semana:**
• Sem riscos detectados nos últimos 7 dias
• Sentimento médio neutro/positivo
• Cobertura midiática equilibrada

**Oportunidades:**
• Aproveitar momento para agenda propositiva
• Ampliar presença em temas estratégicos
• Fortalecer narrativa positiva

**Fontes consultadas:**
• api:copilot/negativas_relevantes (sem alertas para {candidato})
• Dados atualizados: {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Disclaimer:** Ausência de riscos detectados não garante estabilidade futura."""
        else:
            resposta_texto = f"""**GESTÃO DE RISCO: {candidato}**

**Quadro da Semana:**
• **ALERTA**: {dados['negativas']} menções negativas de alto alcance
• Nível de risco: {dados['nivel']}
• Fontes envolvidas: G1, Correio Braziliense

**Riscos:**
• Escalada da narrativa negativa
• Repercussão em redes sociais (monitorar)
• Impacto em próximas pesquisas (hipótese)

**Ações rápidas para reduzir risco:**
• **Imediato**: Resposta técnica/factual às críticas
• **24h**: Agenda positiva para contrabalançar
• **Semana**: Ampliar presença em temas neutros/positivos

**Oportunidades:**
• Demonstrar transparência na resposta
• Reforçar credenciais técnicas
• Mobilizar apoiadores para defesa

**Fontes consultadas:**
• api:copilot/negativas_relevantes ({candidato}, 7 dias)
• Análise de {dados['negativas']} menções negativas
• Dados atualizados: {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Disclaimer:** Ações sugeridas são táticas. Estratégia de longo prazo requer análise mais ampla."""
        
        return {
            "tipo": "gestao_risco",
            "candidato": candidato,
            "resposta": resposta_texto,
            "dados": dados,
            "timestamp": datetime.now().isoformat()
        }
    
    def resposta_quadro_geral(self):
        return {
            "tipo": "quadro_geral",
            "resposta": f"""**QUADRO GERAL: Cenário Político DF**

**Quadro da Semana:**
• Celina Leão mantém liderança (economia dominante, 35% SoV)
• Izalci Lucas em 2º (28% SoV, retórica mais combativa)
• José Roberto Arruda com risco alto (menções negativas)

**O que mudou vs. semana passada:**
• Crescimento de Celina em economia (+3pp SoV)
• Aumento de tom combativo (Izalci, Erika)
• Novos alertas de risco detectados

**Riscos:**
• José Roberto Arruda: menções negativas alto alcance
• Polarização crescente no discurso
• Agenda econômica pode perder espaço

**Oportunidades:**
• Celina: consolidar liderança econômica
• Izalci: diferenciar com propostas técnicas  
• Demais: explorar temas menos disputados

**Fontes consultadas:**
• api:copilot/ranking_sov_tema (economia, todos candidatos)
• api:copilot/alertas_candidato (múltiplos candidatos)
• Dados atualizados: {datetime.now().strftime('%d/%m/%Y %H:%M')}

**Disclaimer:** Análise baseada em correlações. Cenário pode mudar com eventos externos.""",
            "dados": {
                "lider": "Celina Leão",
                "segundo": "Izalci Lucas", 
                "risco_alto": "José Roberto Arruda"
            },
            "timestamp": datetime.now().isoformat()
        }

