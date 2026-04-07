/**
 * Modulo: Prazos de licenciamento por UF
 * Exibe apenas datas validadas em fonte oficial para o exercicio de 2026.
 * Quando a confirmacao oficial nao foi fechada no app, os prazos exatos sao ocultados.
 */

const PRAZOS_LICENCIAMENTO_UF = {
    SC: {
        nome: "Santa Catarina",
        status: "verificado",
        datas: [
            "31/03/2026",
            "30/04/2026",
            "31/05/2026",
            "30/06/2026",
            "31/07/2026",
            "31/08/2026",
            "30/09/2026",
            "31/10/2026",
            "30/11/2026",
            "31/12/2026"
        ],
        obs: "Calendario oficial da SEF/SC para 2026, com vencimento por final de placa.",
        fonteLabel: "SEF/SC - Prazos do IPVA e licenciamento",
        fonteUrl: "https://www.sef.sc.gov.br/servicos/servico/93"
    },
    SP: {
        nome: "Sao Paulo",
        status: "nao_verificado",
        obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026.",
        fonteLabel: "Detran-SP - Licenciamento digital",
        fonteUrl: "https://gestaoconteudo.detran.sp.gov.br/wps/portal/portaldetran/cidadao/veiculos/fichaservico/Licenciamento/licenciamento%20digital/b3fba327-cd93-44cd-b0ef-4794f9ce068f/%21ut/p/z1/tVjZdqM4EP2aedShtCI9gtdgJ7TjdhLz0kcI4WHGwVnc6Ul__YhMlvEG7tDmwUKm6tZV6aok8BLvxktK_VQs9LpYlXrp-vNEfKMcpirEAcB40oWA9YczfN7DY4W96xcD2LgCCC9JSAEGU_CSyp-9-svLCwlBPPgSSSkJfIFX_w-D3lUfAnlJ-7gXE5DiOH84cAXb8SHsQTASjlznAsMAvCtvHnrz8eg5PJvskNmJtgnGu4HjSidxPOjjuMN2_HeiJcck81CAKW4aTL2_I7gRX4ZD58_iaIhFn8jRO__DBhvxIfpKHbw_usLjgA4mYjv-rkGNfxw1-FcGSX16rpvUmtRr5dpL9ph8yDkmew029bZFclfQLwbRBDrDoSTjAe52IFCMnZ9FIwqKNiCMdkPsTnPTRM1dovxDQid97l0_FfaHNytXD7euCkwrxDtTZN4cp4C1EQxRawliVEqUMp6hHBRhVikjBPaG0BTBbxmhHv6KtYSPmsqOq4vFX_f3SeAlZlWu7T9r7-Zu9bDWy8yuH3T5B2y3S7soHpfa6FV1XyxX9rFCIQ_nnfOFI6fXf6KizFfezdvT7TFuLndZM0kiS7OUpRgBaItY7n40JTmihuSp0sww_KaBdx0CcyMLOPh9OhkTEOK3wB9iP8InZT_kJ2U_O21y4rbwUdNGcbx8XVCdVZp91OhOL4pSF2VhCkdqawzQPeu-FBky5mdugsnhMThxZZwQgdxyk4iB5khSxRFYHyvgqcEZ24HfqGG1KfoM_FYNJdASPmraqvYv_c9QH4ywX-0P4bQbEwKDmsxYCcLQXCCOrUZMSY4UpApJhpUwLM0xgYbES78lfNS0eX1Cm-VqXWnyvWQeOMBMa7gTI1nGuUHcvHDPLVKUujmQBAuqFGCFG-AJOy28aAkfNR3_9mvyKOzjJ83VkdX9d5vrn_bh_rsuMzd_v5KdA4eai5rkK6sgN7lBWBhAjKe8kqRFKcaUaJErsLQB3vdbwkdNR7L9yT8K-xMrZv309lf75MQCnzL3LKzJPRVuAFYJlDkc5EqMQSkhGFlp3KDBKkZEA_vopPAs5C3ho6a3pv3KOQq7lXJ-JTkHXsku6OHkpDRP3dHGRyZTDp6ZDKVgc8R8xXJlLAiZN8DXvcj8BvgraAkfNX4Q6Lx_m0iwd3c7m83K5-K_C_192bsc_gwv0KCTyh9f89truX5pX7sfzTOtzObRU9UkKV_cfjvvUb582rD56O4C_f9p1V38CyCAxco%21/dz/d5/L2dBISEvZ0FBIS9nQSEh/?1dmy=&pagedesign=portaldetran%2FPT-FichaServicosVisualizarImpressao&urile=wcm%3Apath%3A%2Fportaldetran%2Fdetran%2Fsa-veiculos%2FSA-ServicosOnline%2FSA-Licenciamento%2FLicenciamento%2Bdigital%2Fb3fba327-cd93-44cd-b0ef-4794f9ce068f"
    },
    PR: {
        nome: "Parana",
        status: "nao_verificado",
        obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026.",
        fonteLabel: "Detran-PR - Licenciamento de frotas",
        fonteUrl: "https://www.detran.pr.gov.br/servicos/Veiculo/Guias-para-pagamento-e-taxas/Emitir-guia-para-pagamento-de-licenciamento-de-frotas-4n3nddoZ"
    },
    RS: {
        nome: "Rio Grande do Sul",
        status: "verificado",
        datas: [
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026"
        ],
        obs: "Prazo unico do exercicio 2026, conforme Portaria DetranRS numero 555/2025.",
        fonteLabel: "DetranRS - Consultar calendario de IPVA e licenciamento",
        fonteUrl: "https://www.detran.rs.gov.br/veiculos/servicos/986"
    },
    RJ: {
        nome: "Rio de Janeiro",
        status: "verificado",
        datas: [
            "31/05/2026",
            "31/05/2026",
            "31/05/2026",
            "30/06/2026",
            "30/06/2026",
            "30/06/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026",
            "31/07/2026"
        ],
        obs: "Calendario oficial 2026 por grupos de final de placa: 0 a 3, 4 a 6 e 7 a 9.",
        fonteLabel: "Detran-RJ - Calendario anual de licenciamento 2026",
        fonteUrl: "https://www.detran.rj.gov.br/_documento.asp?cod=12223"
    },
    MG: {
        nome: "Minas Gerais",
        status: "verificado",
        datas: [
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026",
            "31/03/2026"
        ],
        obs: "Taxa de Renovacao do Licenciamento Anual do Veiculo (TRLAV) com vencimento em 31/03/2026, sem escalonamento por final de placa.",
        fonteLabel: "SEF/MG - Vencimento da terceira parcela do IPVA 2026",
        fonteUrl: "https://www.fazenda.mg.gov.br/noticias/2026/2026.04.06_IPVA_Parcela3/index.html"
    },
    ES: {
        nome: "Espirito Santo",
        status: "verificado",
        datas: [
            "09/09/2026",
            "09/09/2026",
            "10/09/2026",
            "10/09/2026",
            "11/09/2026",
            "11/09/2026",
            "14/09/2026",
            "14/09/2026",
            "15/09/2026",
            "15/09/2026"
        ],
        obs: "Calendario oficial 2026 do Detran-ES por pares de final de placa.",
        fonteLabel: "Detran-ES - Calendario de Licenciamento 2026 (PDF)",
        fonteUrl: "https://detran.es.gov.br/Media/detran/Calendarios%20de%20pagamento/2026/Calend%C3%A1rio%20de%20Licenciamento%202026.pdf"
    },
    BA: { nome: "Bahia", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    PE: { nome: "Pernambuco", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    CE: { nome: "Ceara", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    DF: { nome: "Distrito Federal", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    GO: { nome: "Goias", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    MT: { nome: "Mato Grosso", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    MS: { nome: "Mato Grosso do Sul", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    PA: { nome: "Para", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    AM: { nome: "Amazonas", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    AC: { nome: "Acre", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    AL: { nome: "Alagoas", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    AP: { nome: "Amapa", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    MA: { nome: "Maranhao", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    PB: { nome: "Paraiba", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    PI: { nome: "Piaui", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    RN: { nome: "Rio Grande do Norte", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    RO: { nome: "Rondonia", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    RR: { nome: "Roraima", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    SE: { nome: "Sergipe", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." },
    TO: { nome: "Tocantins", status: "nao_verificado", obs: "Calendario removido do app ate validacao oficial completa do exercicio 2026." }
};

const PRAZOS_ORDEM_FINAIS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const PRAZOS_PLACEHOLDER = "Consulte o calendario oficial da UF";

function prazos_init() {
    prazos_carregarCalendario();
}

function prazos_carregarCalendario() {
    const uf = document.getElementById("prazos_uf_select")?.value;
    const dados = PRAZOS_LICENCIAMENTO_UF[uf];

    if (!dados) {
        return;
    }

    const titulo = document.getElementById("prazos_uf_titulo");
    const observacao = document.getElementById("prazos_obs_uf");
    const status = document.getElementById("prazos_status_uf");
    const fonte = document.getElementById("prazos_fonte_uf");
    const body = document.getElementById("prazos_tabela_body");

    titulo.innerText = `Licenciamento ${dados.nome}`;
    observacao.innerText = `* ${dados.obs}`;

    if (status) {
        status.innerText = dados.status === "verificado"
            ? "Status: calendario 2026 validado com fonte oficial."
            : "Status: prazos exatos ocultados ate confirmacao oficial.";
        status.style.color = dados.status === "verificado" ? "var(--primary)" : "#b45309";
    }

    if (fonte) {
        if (dados.fonteUrl && dados.fonteLabel) {
            fonte.innerHTML = `<a href="${dados.fonteUrl}" target="_blank" rel="noopener noreferrer">${dados.fonteLabel}</a>`;
        } else {
            fonte.innerText = "Fonte: consultar portal oficial do Detran da UF.";
        }
    }

    body.innerHTML = "";

    PRAZOS_ORDEM_FINAIS.forEach((final, index) => {
        const prazo = dados.status === "verificado" && Array.isArray(dados.datas)
            ? dados.datas[index]
            : PRAZOS_PLACEHOLDER;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding: 10px; border: 1px solid var(--border); text-align: center; font-weight: bold; color: var(--primary);">${final}</td>
            <td style="padding: 10px; border: 1px solid var(--border); text-align: center;">${prazo}</td>
        `;
        body.appendChild(row);
    });
}

window.prazos_init = prazos_init;
window.prazos_carregarCalendario = prazos_carregarCalendario;

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("prazos_uf_select")) {
        prazos_carregarCalendario();
    }
});
