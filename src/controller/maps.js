const puppeteer = require('puppeteer');
const fs = require('fs'); // Importando o módulo fs
const { Router } = require('express');
const controllerMaps = Router();

async function BuscarPadarias(baseURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navega até a página desejada
    await page.goto(baseURL, { waitUntil: 'networkidle2' });

    // Aguarda até que o seletor '.hfpxzc' apareça
    await page.waitForSelector('.hfpxzc', { visible: true });

    // Captura o HTML completo da página
    const pageContent = await page.content();

    // Salva o HTML em um arquivo de texto
    fs.writeFileSync('pageContent.txt', pageContent);

    // Lê o arquivo para buscar os elementos
    const fileContent = fs.readFileSync('pageContent.txt', 'utf8');
    
    // Usa expressão regular para encontrar todos os elementos da classe 'hfpxzc'
    const regex = /<a class="hfpxzc" aria-label="([^"]+)" href="([^"]+)"/g; // Captura aria-label e href
    let match;
    const elements = [];

    while ((match = regex.exec(fileContent)) !== null) {
        const ariaLabel = match[1]; // Captura o aria-label
        const href = match[2]; // Captura o href

        // Adiciona um objeto com aria-label e href ao array
        elements.push({ ariaLabel, href });
    }

    await browser.close();

    // Retorna os elementos encontrados
    return elements;
}

async function BuscarDetalhesDaPadaria(href) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navega até o href da padaria
    await page.goto(href, { waitUntil: 'networkidle2' });

    // Aguarda até que a classe desejada apareça
    await page.waitForSelector('.Io6YTe.fontBodyMedium.kR99db.fdkmkc', { visible: true });

    // Coleta todos os textos da classe especificada
    const textos = await page.$$eval('.Io6YTe.fontBodyMedium.kR99db.fdkmkc', elements => 
        elements.map(el => el.innerText) // Retorna um array de textos
    );

    await browser.close();

    return textos; // Retorna os textos coletados
}

controllerMaps.get('/maps', async (req, res) => {
    try {
        const padarias = await BuscarPadarias('https://www.google.com.br/maps/search/padarias+em+taubat%C3%A9/@-23.1149555,-45.9003591,10.75z?entry=ttu&g_ep=EgoyMDI0MTAxMy4wIKXMDSoASAFQAw%3D%3D');
        
        // Navega até cada padaria e coleta informações adicionais
        const padariasComDetalhes = await Promise.all(padarias.map(async (padaria) => {
            const detalhes = await BuscarDetalhesDaPadaria(padaria.href);
            return { ...padaria, detalhes }; // Combina os dados da padaria com os detalhes coletados
        }));

        return res.status(200).json({ padarias: padariasComDetalhes });
    } catch (error) {
        console.error('Erro ao buscar a página:', error);
        res.status(500).send('Erro ao buscar a página');
    }
});

module.exports = controllerMaps;
