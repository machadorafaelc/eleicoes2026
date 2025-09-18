// Validador de Schemas para Sistema de Monitoramento Político

class SchemaValidator {
    constructor() {
        this.schemas = null;
        this.loadSchemas();
    }

    async loadSchemas() {
        try {
            const response = await fetch('data/schemas.json');
            this.schemas = await response.json();
            console.log('Schemas carregados:', this.schemas);
        } catch (error) {
            console.error('Erro ao carregar schemas:', error);
        }
    }

    // Validar item de mídia
    validateMidiaItem(item) {
        if (!this.schemas) {
            return { valid: false, errors: ['Schemas não carregados'] };
        }

        const schema = this.schemas.schemas.midia_item;
        const errors = [];

        // Verificar campos obrigatórios
        for (const field of schema.required) {
            if (!item[field] || item[field] === '') {
                errors.push(`Campo obrigatório ausente: ${field}`);
            }
        }

        // Validações específicas
        if (item.texto && item.texto.length < 400) {
            errors.push('Texto deve ter pelo menos 400 caracteres');
        }

        if (item.titulo && (item.titulo.length < 10 || item.titulo.length > 200)) {
            errors.push('Título deve ter entre 10 e 200 caracteres');
        }

        if (item.score_credibilidade && (item.score_credibilidade < 0 || item.score_credibilidade > 1)) {
            errors.push('Score de credibilidade deve estar entre 0 e 1');
        }

        if (item.fonte && !schema.properties.fonte.enum.includes(item.fonte)) {
            errors.push(`Fonte não autorizada: ${item.fonte}`);
        }

        if (item.candidato && !schema.properties.candidato.enum.includes(item.candidato)) {
            errors.push(`Candidato não reconhecido: ${item.candidato}`);
        }

        if (item.tipo && !schema.properties.tipo.enum.includes(item.tipo)) {
            errors.push(`Tipo de conteúdo não permitido: ${item.tipo}`);
        }

        // Validar formato de data
        if (item.data_publicacao && !this.isValidISODate(item.data_publicacao)) {
            errors.push('Data de publicação deve estar no formato ISO 8601');
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            score: this.calculateQualityScore(item, errors)
        };
    }

    // Validar item de pesquisa
    validatePesquisaItem(item) {
        if (!this.schemas) {
            return { valid: false, errors: ['Schemas não carregados'] };
        }

        const schema = this.schemas.schemas.pesquisa_item;
        const errors = [];

        // Verificar campos obrigatórios
        for (const field of schema.required) {
            if (!item[field] || item[field] === '') {
                errors.push(`Campo obrigatório ausente: ${field}`);
            }
        }

        // Validações específicas
        if (item.amostra && (item.amostra < 100 || item.amostra > 10000)) {
            errors.push('Amostra deve estar entre 100 e 10.000 entrevistados');
        }

        if (item.margem && (item.margem < 1 || item.margem > 10)) {
            errors.push('Margem de erro deve estar entre 1 e 10 pontos percentuais');
        }

        if (item.instituto && !schema.properties.instituto.enum.includes(item.instituto)) {
            errors.push(`Instituto não autorizado: ${item.instituto}`);
        }

        if (item.local && !schema.properties.local.enum.includes(item.local)) {
            errors.push(`Local inválido: ${item.local}`);
        }

        if (item.metodologia && !schema.properties.metodologia.enum.includes(item.metodologia)) {
            errors.push(`Metodologia não reconhecida: ${item.metodologia}`);
        }

        if (item.cenario && !schema.properties.cenario.enum.includes(item.cenario)) {
            errors.push(`Cenário não reconhecido: ${item.cenario}`);
        }

        // Validar resultado
        if (item.resultado && Array.isArray(item.resultado)) {
            if (item.resultado.length === 0) {
                errors.push('Resultado deve conter pelo menos um candidato');
            }

            item.resultado.forEach((resultado, index) => {
                if (!resultado.candidato || !resultado.percentual) {
                    errors.push(`Resultado ${index + 1}: candidato e percentual são obrigatórios`);
                }

                if (resultado.percentual < 0 || resultado.percentual > 100) {
                    errors.push(`Resultado ${index + 1}: percentual deve estar entre 0 e 100`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            score: this.calculateQualityScore(item, errors)
        };
    }

    // Calcular score de qualidade
    calculateQualityScore(item, errors) {
        let score = 1.0;

        // Penalizar por erros
        score -= errors.length * 0.1;

        // Bonificar por campos opcionais preenchidos
        const optionalFields = ['resumo', 'score_credibilidade', 'origem_coleta', 'fonte_url'];
        const filledOptional = optionalFields.filter(field => item[field] && item[field] !== '').length;
        score += filledOptional * 0.05;

        // Garantir que o score esteja entre 0 e 1
        return Math.max(0, Math.min(1, score));
    }

    // Validar formato de data ISO 8601
    isValidISODate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Obter estatísticas de validação
    getValidationStats(items, type = 'midia') {
        const stats = {
            total: items.length,
            valid: 0,
            invalid: 0,
            errors: [],
            averageScore: 0
        };

        let totalScore = 0;

        items.forEach(item => {
            const validation = type === 'midia' 
                ? this.validateMidiaItem(item)
                : this.validatePesquisaItem(item);

            if (validation.valid) {
                stats.valid++;
            } else {
                stats.invalid++;
                stats.errors.push(...validation.errors);
            }

            totalScore += validation.score;
        });

        stats.averageScore = items.length > 0 ? totalScore / items.length : 0;
        stats.successRate = items.length > 0 ? (stats.valid / items.length) * 100 : 0;

        return stats;
    }

    // Filtrar itens válidos
    filterValidItems(items, type = 'midia') {
        return items.filter(item => {
            const validation = type === 'midia' 
                ? this.validateMidiaItem(item)
                : this.validatePesquisaItem(item);
            return validation.valid;
        });
    }

    // Gerar relatório de validação
    generateValidationReport(items, type = 'midia') {
        const stats = this.getValidationStats(items, type);
        const report = {
            timestamp: new Date().toISOString(),
            type: type,
            summary: stats,
            details: []
        };

        items.forEach((item, index) => {
            const validation = type === 'midia' 
                ? this.validateMidiaItem(item)
                : this.validatePesquisaItem(item);

            report.details.push({
                index: index,
                id: item.id || `item_${index}`,
                valid: validation.valid,
                score: validation.score,
                errors: validation.errors
            });
        });

        return report;
    }
}

// Exportar para uso global
window.SchemaValidator = SchemaValidator;

// Exemplo de uso
/*
const validator = new SchemaValidator();

// Exemplo de item de mídia
const midiaItem = {
    id: "noticia_001",
    candidato: "Celina Leão",
    fonte: "G1",
    url: "https://g1.globo.com/df/distrito-federal/noticia/...",
    tipo: "noticia",
    titulo: "Celina Leão apresenta propostas para o DF",
    data_publicacao: "2025-09-15T10:30:00Z",
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." // > 400 chars
};

const validation = validator.validateMidiaItem(midiaItem);
console.log('Validação:', validation);
*/

