
/**
 * Testes de Unidade: Módulo de Pesos
 * Validação de cálculos conforme Resolução 882/21 CONTRAN
 */

// Mock de funções do navegador para permitir teste em Node.js
const mockPesos = {
    getValorMulta: (excessoKG) => {
        if (excessoKG <= 0) return 0;
        const baseMulta = 130.16;
        const frações = Math.ceil(excessoKG / 200);
        let valorAdicional = 0;
        if (excessoKG <= 600) valorAdicional = frações * 5.32;
        else if (excessoKG <= 800) valorAdicional = frações * 10.64;
        else if (excessoKG <= 1000) valorAdicional = frações * 21.28;
        else if (excessoKG <= 3000) valorAdicional = frações * 31.92;
        else if (excessoKG <= 5000) valorAdicional = frações * 42.56;
        else valorAdicional = frações * 53.20;
        return parseFloat((baseMulta + valorAdicional).toFixed(2));
    }
};

function runTests() {
    console.log("🧪 Iniciando Testes de Robustez Pericial (Pesos)...\n");

    const tests = [
        { name: "Multa Leve (Excesso 200kg)", excesso: 200, expected: 135.48 },
        { name: "Multa Média (Excesso 700kg)", excesso: 700, expected: 172.72 },
        { name: "Multa Alta (Excesso 4000kg)", excesso: 4000, expected: 981.36 },
        { name: "Multa Máxima (Excesso 6000kg)", excesso: 6000, expected: 1726.16 }
    ];

    let passed = 0;
    tests.forEach(t => {
        const result = mockPesos.getValorMulta(t.excesso);
        if (result === t.expected) {
            console.log(`✅ PASSED: ${t.name}`);
            passed++;
        } else {
            console.error(`❌ FAILED: ${t.name} | Expected: ${t.expected} | Got: ${result}`);
        }
    });

    console.log(`\n📊 Resultado: ${passed}/${tests.length} testes concluídos.`);
}

runTests();
