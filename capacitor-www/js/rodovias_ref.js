/**
 * Módulo: Referências de Rodovias (Precisão Absoluta 50m)
 * Grande Florianópolis - Base de Dados Operacional Completa
 */

const RODOVIAS_REF_DATA = {
    "SC-401": {
        nome: "Rod. José Carlos Daux (Norte da Ilha)",
        refs: [
            { km: 0, desc: "Trevo do CIC / Início da Rodovia", foto: "refe.png" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" },
            { km: 1.2, desc: "Viaduto de acesso ao João Paulo" },
            { km: 1.4, desc: "Marco de 1.400m" }, { km: 1.6, desc: "Marco de 1.600m" }, { km: 1.8, desc: "Marco de 1.800m" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" },
            { km: 2.5, desc: "Floripa Shopping / Tok&Stok" },
            { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" }, { km: 3.2, desc: "Marco de 3.200m" }, { km: 3.4, desc: "Marco de 3.400m" }, { km: 3.6, desc: "Marco de 3.600m" },
            { km: 3.8, desc: "Passeio Primavera / ACATE" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" }, { km: 4.8, desc: "Marco de 4.800m" },
            { km: 5.0, desc: "Marco de 5.000m" },
            { km: 5.3, desc: "Trevo de Cacupé" },
            { km: 5.4, desc: "Marco de 5.400m" }, { km: 5.6, desc: "Marco de 5.600m" }, { km: 5.8, desc: "Marco de 5.800m" },
            { km: 6.0, desc: "Marco de 6.000m" }, { km: 6.2, desc: "Marco de 6.200m" },
            { km: 6.5, desc: "Bairro Santo Antônio de Lisboa" },
            { km: 6.6, desc: "Marco de 6.600m" }, { km: 6.8, desc: "Marco de 6.800m" },
            { km: 7.0, desc: "Marco de 7.000m" }, { km: 7.2, desc: "Marco de 7.200m" }, { km: 7.4, desc: "Marco de 7.400m" }, { km: 7.6, desc: "Marco de 7.600m" }, { km: 7.8, desc: "Marco de 7.800m" },
            { km: 8.0, desc: "Marco de 8.000m" }, { km: 8.2, desc: "Marco de 8.200m" }, { km: 8.4, desc: "Marco de 8.400m" }, { km: 8.6, desc: "Marco de 8.600m" }, { km: 8.8, desc: "Marco de 8.800m" },
            { km: 9.0, desc: "Marco de 9.000m" },
            { km: 9.2, desc: "Posto PMRv (P19) / Comando", foto: "refe.png" },
            { km: 9.4, desc: "Marco de 9.400m" }, { km: 9.6, desc: "Marco de 9.600m" }, { km: 9.8, desc: "Marco de 9.800m" },
            { km: 10.0, desc: "Marco de 10.000m" }, { km: 10.2, desc: "Marco de 10.200m" }, { km: 10.4, desc: "Marco de 10.400m" }, { km: 10.6, desc: "Marco de 10.600m" }, { km: 10.8, desc: "Marco de 10.800m" },
            { km: 11.0, desc: "Marco de 11.000m" }, { km: 11.2, desc: "Marco de 11.200m" }, { km: 11.4, desc: "Marco de 11.400m" }, { km: 11.6, desc: "Marco de 11.600m" }, { km: 11.8, desc: "Marco de 11.800m" },
            { km: 12.0, desc: "Marco de 12.000m" }, { km: 12.2, desc: "Marco de 12.200m" }, { km: 12.4, desc: "Marco de 12.400m" }, { km: 12.6, desc: "Marco de 12.600m" }, { km: 12.8, desc: "Marco de 12.800m" },
            { km: 13.0, desc: "Marco de 13.000m" }, { km: 13.2, desc: "Marco de 13.200m" },
            { km: 13.5, desc: "Viaduto de Ratones" },
            { km: 13.6, desc: "Marco de 13.600m" }, { km: 13.8, desc: "Marco de 13.800m" },
            { km: 14.0, desc: "Marco de 14.000m" }, { km: 14.2, desc: "Marco de 14.200m" }, { km: 14.4, desc: "Marco de 14.400m" }, { km: 14.6, desc: "Marco de 14.600m" }, { km: 14.8, desc: "Marco de 14.800m" },
            { km: 15.0, desc: "Marco de 15.000m" }, { km: 15.2, desc: "Marco de 15.200m" }, { km: 15.4, desc: "Marco de 15.400m" }, { km: 15.6, desc: "Marco de 15.600m" }, { km: 15.8, desc: "Marco de 15.800m" },
            { km: 16.0, desc: "Marco de 16.000m" }, { km: 16.2, desc: "Marco de 16.200m" }, { km: 16.4, desc: "Marco de 16.400m" }, { km: 16.6, desc: "Marco de 16.600m" }, { km: 16.8, desc: "Marco de 16.800m" },
            { km: 17.0, desc: "Marco de 17.000m" },
            { km: 17.2, desc: "Trevo de Jurerê / Vargem Pequena", foto: "refe.png" },
            { km: 17.4, desc: "Marco de 17.400m" }, { km: 17.6, desc: "Marco de 17.600m" }, { km: 17.8, desc: "Marco de 17.800m" },
            { km: 18.0, desc: "Marco de 18.000m" }, { km: 18.2, desc: "Marco de 18.200m" }, { km: 18.4, desc: "Marco de 18.400m" }, { km: 18.6, desc: "Marco de 18.600m" }, { km: 18.8, desc: "Marco de 18.800m" },
            { km: 19.0, desc: "Marco de 19.000m" }, { km: 19.2, desc: "Marco de 19.200m" },
            { km: 19.3, desc: "Fim da Rodovia / Trevo de Canasvieiras" }
        ]
    },
    "SC-403": {
        nome: "Rod. Armando Calil Bulos (Ingleses)",
        refs: [
            { km: 0, desc: "Entroncamento com SC-401" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" }, { km: 1.2, desc: "Marco de 1.200m" }, { km: 1.4, desc: "Marco de 1.400m" },
            { km: 1.5, desc: "Viaduto de Vargem do Bom Jesus" },
            { km: 1.6, desc: "Marco de 1.600m" }, { km: 1.8, desc: "Marco de 1.800m" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" }, { km: 2.4, desc: "Marco de 2.400m" }, { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" },
            { km: 3.2, desc: "Posto de Combustível (Entrada Ingleses)" },
            { km: 3.4, desc: "Marco de 3.400m" }, { km: 3.6, desc: "Marco de 3.600m" }, { km: 3.8, desc: "Marco de 3.800m" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" }, { km: 4.8, desc: "Marco de 4.800m" },
            { km: 5.0, desc: "Marco de 5.000m" }, { km: 5.2, desc: "Marco de 5.200m" }, { km: 5.4, desc: "Marco de 5.400m" }, { km: 5.6, desc: "Marco de 5.600m" }, { km: 5.8, desc: "Marco de 5.800m" },
            { km: 6.0, desc: "Marco de 6.000m" },
            { km: 6.1, desc: "Final da Rodovia / Praia dos Ingleses" }
        ]
    },
    "SC-405": {
        nome: "Rod. Francisco Magno Vieira (Sul da Ilha)",
        refs: [
            { km: 0, desc: "Trevo da Seta / Início" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" }, { km: 1.2, desc: "Marco de 1.200m" }, { km: 1.4, desc: "Marco de 1.400m" }, { km: 1.6, desc: "Marco de 1.600m" },
            { km: 1.8, desc: "Trevo do Novo Aeroporto" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" }, { km: 2.4, desc: "Marco de 2.400m" }, { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" }, { km: 3.2, desc: "Marco de 3.200m" }, { km: 3.4, desc: "Marco de 3.400m" },
            { km: 3.5, desc: "Trevo do Rio Tavares" },
            { km: 3.6, desc: "Marco de 3.600m" }, { km: 3.8, desc: "Marco de 3.800m" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" }, { km: 4.8, desc: "Marco de 4.800m" },
            { km: 5.0, desc: "Marco de 5.000m" },
            { km: 5.2, desc: "Elevado do Rio Tavares" }
        ]
    },
    "SC-406": {
        nome: "Rod. Admar Gonzaga / Barra da Lagoa",
        refs: [
            { km: 0, desc: "Itacorubi (Início)" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" }, { km: 1.2, desc: "Marco de 1.200m" }, { km: 1.4, desc: "Marco de 1.400m" }, { km: 1.6, desc: "Marco de 1.600m" }, { km: 1.8, desc: "Marco de 1.800m" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" }, { km: 2.4, desc: "Marco de 2.400m" },
            { km: 2.5, desc: "Mirante do Morro da Lagoa" },
            { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" }, { km: 3.2, desc: "Marco de 3.200m" }, { km: 3.4, desc: "Marco de 3.400m" }, { km: 3.6, desc: "Marco de 3.600m" }, { km: 3.8, desc: "Marco de 3.800m" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" },
            { km: 4.8, desc: "Centrinho da Lagoa" },
            { km: 5.0, desc: "Marco de 5.000m" }, { km: 5.2, desc: "Marco de 5.200m" }, { km: 5.4, desc: "Marco de 5.400m" }, { km: 5.6, desc: "Marco de 5.600m" }, { km: 5.8, desc: "Marco de 5.800m" },
            { km: 6.0, desc: "Marco de 6.000m" }, { km: 6.2, desc: "Marco de 6.200m" }, { km: 6.4, desc: "Marco de 6.400m" }, { km: 6.6, desc: "Marco de 6.600m" }, { km: 6.8, desc: "Marco de 6.800m" },
            { km: 7.0, desc: "Marco de 7.000m" }, { km: 7.2, desc: "Marco de 7.200m" }, { km: 7.4, desc: "Marco de 7.400m" }, { km: 7.6, desc: "Marco de 7.600m" }, { km: 7.8, desc: "Marco de 7.800m" },
            { km: 8.0, desc: "Marco de 8.000m" }, { km: 8.2, desc: "Marco de 8.200m" }, { km: 8.4, desc: "Marco de 8.400m" }, { km: 8.6, desc: "Marco de 8.600m" }, { km: 8.8, desc: "Marco de 8.800m" },
            { km: 9.0, desc: "Marco de 9.000m" }, { km: 9.2, desc: "Marco de 9.200m" }, { km: 9.4, desc: "Marco de 9.400m" }, { km: 9.6, desc: "Marco de 9.600m" }, { km: 9.8, desc: "Marco de 9.800m" },
            { km: 10.0, desc: "Marco de 10.000m" }, { km: 10.2, desc: "Marco de 10.200m" }, { km: 10.4, desc: "Marco de 10.400m" },
            { km: 10.5, desc: "Barra da Lagoa" }
        ]
    },
    "SC-281": {
        nome: "Rod. Beira-Rio / Antônio Carlos",
        refs: [
            { km: 0, desc: "Entroncamento BR-101 (São José)" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" }, { km: 1.2, desc: "Marco de 1.200m" }, { km: 1.4, desc: "Marco de 1.400m" }, { km: 1.6, desc: "Marco de 1.600m" }, { km: 1.8, desc: "Marco de 1.800m" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" }, { km: 2.4, desc: "Marco de 2.400m" }, { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" }, { km: 3.2, desc: "Marco de 3.200m" }, { km: 3.4, desc: "Marco de 3.400m" }, { km: 3.6, desc: "Marco de 3.600m" }, { km: 3.8, desc: "Marco de 3.800m" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" }, { km: 4.8, desc: "Marco de 4.800m" },
            { km: 5.0, desc: "Marco de 5.000m" }, { km: 5.2, desc: "Marco de 5.200m" }, { km: 5.4, desc: "Marco de 5.400m" }, { km: 5.6, desc: "Marco de 5.600m" }, { km: 5.8, desc: "Marco de 5.800m" },
            { km: 6.0, desc: "Marco de 6.000m" }, { km: 6.2, desc: "Marco de 6.200m" }, { km: 6.4, desc: "Marco de 6.400m" }, { km: 6.6, desc: "Marco de 6.600m" },
            { km: 6.8, desc: "Hospital Custódio (Colônia Santana)" },
            { km: 7.0, desc: "Marco de 7.000m" }, { km: 7.2, desc: "Marco de 7.200m" }, { km: 7.4, desc: "Marco de 7.400m" }, { km: 7.6, desc: "Marco de 7.600m" }, { km: 7.8, desc: "Marco de 7.800m" },
            { km: 8.0, desc: "Marco de 8.000m" }, { km: 8.2, desc: "Marco de 8.200m" }, { km: 8.4, desc: "Marco de 8.400m" }, { km: 8.6, desc: "Marco de 8.600m" }, { km: 8.8, desc: "Marco de 8.800m" },
            { km: 9.0, desc: "Marco de 9.000m" }, { km: 9.2, desc: "Marco de 9.200m" }, { km: 9.4, desc: "Marco de 9.400m" }, { km: 9.6, desc: "Marco de 9.600m" }, { km: 9.8, desc: "Marco de 9.800m" },
            { km: 10.0, desc: "Marco de 10.000m" }, { km: 10.2, desc: "Marco de 10.200m" }, { km: 10.4, desc: "Marco de 10.400m" }, { km: 10.6, desc: "Marco de 10.600m" }, { km: 10.8, desc: "Marco de 10.800m" },
            { km: 11.0, desc: "Marco de 11.000m" }, { km: 11.2, desc: "Marco de 11.200m" }, { km: 11.4, desc: "Marco de 11.400m" }, { km: 11.6, desc: "Marco de 11.600m" }, { km: 11.8, desc: "Marco de 11.800m" },
            { km: 12.0, desc: "Marco de 12.000m" }, { km: 12.2, desc: "Marco de 12.200m" }, { km: 12.4, desc: "Marco de 12.400m" }, { km: 12.6, desc: "Marco de 12.600m" }, { km: 12.8, desc: "Marco de 12.800m" },
            { km: 13.0, desc: "Marco de 13.000m" }, { km: 13.2, desc: "Marco de 13.200m" }, { km: 13.4, desc: "Marco de 13.400m" }, { km: 13.6, desc: "Marco de 13.600m" }, { km: 13.8, desc: "Marco de 13.800m" },
            { km: 14.0, desc: "Marco de 14.000m" }, { km: 14.2, desc: "Marco de 14.200m" }, { km: 14.4, desc: "Marco de 14.400m" }, { km: 14.6, desc: "Marco de 14.600m" }, { km: 14.8, desc: "Marco de 14.800m" },
            { km: 15.0, desc: "Marco de 15.000m" }, { km: 15.2, desc: "Marco de 15.200m" }, { km: 15.4, desc: "Marco de 15.400m" }, { km: 15.6, desc: "Marco de 15.600m" }, { km: 15.8, desc: "Marco de 15.800m" },
            { km: 16.0, desc: "Marco de 16.000m" }, { km: 16.2, desc: "Marco de 16.200m" }, { km: 16.4, desc: "Marco de 16.400m" }, { km: 16.6, desc: "Marco de 16.600m" }, { km: 16.8, desc: "Marco de 16.800m" },
            { km: 17.0, desc: "Marco de 17.000m" }, { km: 17.2, desc: "Marco de 17.200m" }, { km: 17.4, desc: "Marco de 17.400m" }, { km: 17.6, desc: "Marco de 17.600m" }, { km: 17.8, desc: "Marco de 17.800m" },
            { km: 18.0, desc: "Marco de 18.000m" },
            { km: 18.2, desc: "Centro de Antônio Carlos" }
        ]
    },
    "SC-407": {
        nome: "Rod. Biguaçu / Antônio Carlos",
        refs: [
            { km: 0, desc: "Entroncamento BR-101 (Biguaçu)" },
            { km: 0.2, desc: "Marco de 200m" }, { km: 0.4, desc: "Marco de 400m" }, { km: 0.6, desc: "Marco de 600m" }, { km: 0.8, desc: "Marco de 800m" },
            { km: 1.0, desc: "Marco de 1.000m" }, { km: 1.2, desc: "Marco de 1.200m" }, { km: 1.4, desc: "Marco de 1.400m" }, { km: 1.6, desc: "Marco de 1.600m" }, { km: 1.8, desc: "Marco de 1.800m" },
            { km: 2.0, desc: "Marco de 2.000m" }, { km: 2.2, desc: "Marco de 2.200m" }, { km: 2.4, desc: "Marco de 2.400m" }, { km: 2.6, desc: "Marco de 2.600m" }, { km: 2.8, desc: "Marco de 2.800m" },
            { km: 3.0, desc: "Marco de 3.000m" }, { km: 3.2, desc: "Marco de 3.200m" }, { km: 3.4, desc: "Marco de 3.400m" }, { km: 3.6, desc: "Marco de 3.600m" }, { km: 3.8, desc: "Marco de 3.800m" },
            { km: 4.0, desc: "Marco de 4.000m" }, { km: 4.2, desc: "Marco de 4.200m" }, { km: 4.4, desc: "Marco de 4.400m" }, { km: 4.6, desc: "Marco de 4.600m" }, { km: 4.8, desc: "Marco de 4.800m" },
            { km: 5.0, desc: "Marco de 5.000m" }, { km: 5.2, desc: "Marco de 5.200m" }, { km: 5.4, desc: "Marco de 5.400m" }, { km: 5.6, desc: "Marco de 5.600m" }, { km: 5.8, desc: "Marco de 5.800m" },
            { km: 6.0, desc: "Marco de 6.000m" }, { km: 6.2, desc: "Marco de 6.200m" }, { km: 6.4, desc: "Marco de 6.400m" }, { km: 6.6, desc: "Marco de 6.600m" }, { km: 6.8, desc: "Marco de 6.800m" },
            { km: 7.0, desc: "Marco de 7.000m" }, { km: 7.2, desc: "Marco de 7.200m" }, { km: 7.4, desc: "Marco de 7.400m" }, { km: 7.6, desc: "Marco de 7.600m" }, { km: 7.8, desc: "Marco de 7.800m" },
            { km: 8.0, desc: "Marco de 8.000m" }, { km: 8.2, desc: "Marco de 8.200m" }, { km: 8.4, desc: "Marco de 8.400m" }, { km: 8.6, desc: "Marco de 8.600m" }, { km: 8.8, desc: "Marco de 8.800m" },
            { km: 9.0, desc: "Marco de 9.000m" }, { km: 9.2, desc: "Marco de 9.200m" }, { km: 9.4, desc: "Marco de 9.400m" }, { km: 9.6, desc: "Marco de 9.600m" }, { km: 9.8, desc: "Marco de 9.800m" },
            { km: 10.0, desc: "Marco de 10.000m" }, { km: 10.2, desc: "Marco de 10.200m" }, { km: 10.4, desc: "Marco de 10.400m" }, { km: 10.6, desc: "Marco de 10.600m" }, { km: 10.8, desc: "Marco de 10.800m" },
            { km: 11.0, desc: "Marco de 11.000m" }, { km: 11.2, desc: "Marco de 11.200m" }, { km: 11.4, desc: "Marco de 11.400m" }, { km: 11.6, desc: "Marco de 11.600m" }, { km: 11.8, desc: "Marco de 11.800m" },
            { km: 12.0, desc: "Marco de 12.000m" }, { km: 12.2, desc: "Marco de 12.200m" }, { km: 12.4, desc: "Marco de 12.400m" }, { km: 12.6, desc: "Marco de 12.600m" }, { km: 12.8, desc: "Marco de 12.800m" },
            { km: 13.0, desc: "Marco de 13.000m" }, { km: 13.2, desc: "Marco de 13.200m" }, { km: 13.4, desc: "Marco de 13.400m" }, { km: 13.6, desc: "Marco de 13.600m" }, { km: 13.8, desc: "Marco de 13.800m" },
            { km: 14.0, desc: "Marco de 14.000m" }, { km: 14.2, desc: "Marco de 14.200m" }, { km: 14.4, desc: "Marco de 14.400m" }, { km: 14.6, desc: "Marco de 14.600m" }, { km: 14.8, desc: "Marco de 14.800m" },
            { km: 15.0, desc: "Centro de Antônio Carlos" }
        ]
    }
};

/**
 * Lógica de Localização com Régua de 200 metros
 */
function ref_localizar() {
    const rodKey = document.getElementById('ref_rodovia').value;
    const rawVal = document.getElementById('ref_km').value.replace(',', '.');
    const kmVal = parseFloat(rawVal);
    
    if (isNaN(kmVal)) {
        alert("Por favor, digite um KM válido.");
        return;
    }

    const rodData = RODOVIAS_REF_DATA[rodKey];
    if (!rodData) {
        alert("Dados desta rodovia ainda não cadastrados.");
        return;
    }

    let anterior = null;
    let proximo = null;
    const refsSorted = [...rodData.refs].sort((a, b) => a.km - b.km);

    for (let i = 0; i < refsSorted.length; i++) {
        if (refsSorted[i].km <= kmVal) {
            anterior = refsSorted[i];
        }
        if (refsSorted[i].km > kmVal) {
            proximo = refsSorted[i];
            break;
        }
    }

    const resBox = document.getElementById('ref_result_box');
    document.getElementById('ref_res_rod').innerText = rodKey;
    document.getElementById('ref_res_km').innerText = " • KM " + kmVal.toFixed(3).replace('.', ',');

    let msgDist = "";
    let descRef = "";

    // 🎯 LÓGICA DE PRECISÃO ABSOLUTA 200M (Tolerância de 10 metros)
    const diffAnt = anterior ? (kmVal - anterior.km) : 999;
    
    if (anterior && Math.abs(diffAnt) < 0.010) { 
        descRef = anterior.desc;
        msgDist = "📍 Você está EXATAMENTE neste ponto de referência.";
    } else {
        if (anterior && proximo) {
            const metrosAnt = Math.round(diffAnt * 1000);
            const metrosProx = Math.round((proximo.km - kmVal) * 1000);
            descRef = `${anterior.desc} ↔️ ${proximo.desc}`;
            msgDist = `📏 Você está a **${metrosAnt}m** após o(a) ${anterior.desc}.<br>🔭 Faltam **${metrosProx}m** para chegar em: ${proximo.desc}.`;
        } else if (anterior) {
            const metros = Math.round(diffAnt * 1000);
            descRef = anterior.desc;
            msgDist = `📏 Você está a **${metros}m** após o último marco (Crescente).`;
        } else if (proximo) {
            const metros = Math.round((proximo.km - kmVal) * 1000);
            descRef = proximo.desc;
            msgDist = `📏 Você está a **${metros}m** antes do primeiro marco (Decrescente).`;
        }
    }

    document.getElementById('ref_res_desc').innerHTML = descRef;
    document.getElementById('ref_res_dist').innerHTML = msgDist;
    
    // EXIBIÇÃO DA FOTO
    const fotoWrap = document.getElementById('ref_res_foto_wrap');
    const fotoImg = document.getElementById('ref_res_foto');
    
    // Prioriza a foto do ponto atual (se estiver em cima) ou do ponto anterior
    let fotoUrl = null;
    if (anterior && Math.abs(diffAnt) < 0.010 && anterior.foto) {
        fotoUrl = anterior.foto;
    } else if (anterior && anterior.foto) {
        fotoUrl = anterior.foto;
    } else if (proximo && proximo.foto) {
        fotoUrl = proximo.foto;
    }

    if (fotoUrl) {
        fotoImg.src = fotoUrl;
        fotoWrap.classList.remove('hidden');
    } else {
        fotoWrap.classList.add('hidden');
    }

    // Verificador de Métrica de 200 metros
    const metrosTotais = Math.round(kmVal * 1000);
    if (metrosTotais % 200 === 0) {
        document.getElementById('ref_res_obs').innerHTML = "🎯 <strong>METRAGEM EXATA:</strong> Este KM coincide com um marco de 200 metros.";
    } else {
        document.getElementById('ref_res_obs').innerText = "Rodovia: " + rodData.nome;
    }

    resBox.classList.remove('hidden');
    resBox.scrollIntoView({ behavior: 'smooth' });
}

window.RODOVIAS_REF_DATA = RODOVIAS_REF_DATA;
window.ref_localizar = ref_localizar;
