const puppeteer = require("puppeteer");
const { Router } = require("express");
const controllerMercadoLivre = Router();

async function BuscarProduto(baseURL) {
    // const browser = await puppeteer.launch({ headless: true });
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable', // Caso queira usar uma instalação do Chrome
        headless: true,
      });
    const page = await browser.newPage();

    try {
        await page.goto(baseURL, { waitUntil: "networkidle2" });
        console.log("Navegou para: " + baseURL);

        // Espera pelo seletor estar visível
        await page.waitForSelector(".poly-component__title", { visible: true });

        // Captura o texto do elemento com a classe especificada
        const produto = await page.evaluate(() => {
            const elemento = document.querySelector(".poly-component__title");
            return elemento ? elemento.innerHTML.trim() : null; // Retorna o conteúdo ou null se não existir
        });

        const valor = await page.evaluate(() => {
            let valorInteiro = document.querySelector(
                ".poly-price__current .andes-money-amount__fraction"
            );
            valorInteiro = valorInteiro ? valorInteiro.innerHTML.trim() : null; // Retorna o conteúdo ou null se não existir

            let valorDecimal = document.querySelector(
                ".poly-price__current .andes-money-amount__cents"
            );
            valorDecimal = valorDecimal ? valorDecimal.innerHTML.trim() : null; // Retorna o conteúdo ou null se não existir

            return "R$ " + valorInteiro + "," + valorDecimal;
        });

        // console.log('Produto encontrado:', produto, valor);
        await browser.close();
        return { produto, valor };
    } catch (error) {
        console.error("Erro:", error.message);
        await browser.close();
        return { error: error.message };
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

controllerMercadoLivre.post("/mercadolivre", async (req, res) => {
    try {
        const { produto, valor } = await BuscarProduto(req.body.urlBase);

        return res.status(200).json({mensagem: 
`Confira este produto
${produto} por apenas ${valor}`});
    } catch (error) {
        console.error("Erro ao buscar a página:", error);
        res.status(500).send("Erro ao buscar a página");
    }
});

module.exports = controllerMercadoLivre;
