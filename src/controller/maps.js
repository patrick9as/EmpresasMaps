const puppeteer = require('puppeteer');
const { Router } = require('express');
const controllerMaps = Router();

async function BuscarEmpresas(baseURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(baseURL, { waitUntil: 'networkidle2' });
    console.log('Navegou para: ' + baseURL);
    await page.waitForSelector('.uQ4NLd.b9tNq.wzN8Ac.rllt__link.a-no-hover-decoration', { visible: true });

    // Captura todos os elementos com a classe especificada
    const empresas = await page.$$('.uQ4NLd.b9tNq.wzN8Ac.rllt__link.a-no-hover-decoration');
    
    return { empresas, browser, page }; // Retorna os elementos das empresas e a instância da página
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function BuscarDetalhesDaEmpresa(page, empresaElement) {
    // Rola até o elemento
    await page.evaluate(el => el.scrollIntoView(), empresaElement);
    
    // Aguarda um pouco para garantir que o elemento esteja pronto para interação
    await sleep(2000); // Aumente o tempo se necessário

    // Verifica se o elemento está visível e clicável
    const isVisible = await empresaElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled;
    });

    if (isVisible) {
        // Usar JavaScript para clicar no elemento
        await page.evaluate(el => el.click(), empresaElement);
        
        // Aguarda o modal aparecer
        await page.waitForSelector('.xpdopen', { visible: true });

        // Aguarda um pouco para garantir que o conteúdo do modal tenha carregado
        await sleep(1000);

        // Coleta o nome da Empresa
        const nomeEmpresa = await page.$eval('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v', el => el.innerText);
        // Coleta o telefone da classe especificada dentro do modal
        const telefone = await page.$$eval('.LrzXr.zdqRlf.kno-fv', elements => 
            elements.map(el => el.innerText) // Coleta todos os detalhes
        );
        const detalhes = await page.$$eval('.LrzXr', elements => 
            elements.map(el => el.innerText) // Coleta todos os detalhes
        );
        console.log(nomeEmpresa);
        console.log(detalhes);

        // Espera o modal fechar, se necessário
        await page.evaluate(() => {
            const modal = document.querySelector('.xpdopen');
            if (modal) {
                modal.parentElement.removeChild(modal); // Remove o modal
            }
        });

        return { nome: nomeEmpresa, detalhes: detalhes }; // Retorna o nome e os detalhes coletados
    } else {
        console.log('Elemento não está visível ou não é clicável');
        return null; // Retorna null ou um valor padrão se o elemento não estiver visível
    }
}

controllerMaps.get('/maps', async (req, res) => {
    try {
        const { empresas, browser, page } = await BuscarEmpresas(req.body.urlBase);
        
        const empresasComDetalhes = [];
        
        for (const empresaElement of empresas) {
            const detalhes = await BuscarDetalhesDaEmpresa(page, empresaElement);
            if (detalhes) {
                empresasComDetalhes.push(detalhes); // Adiciona o objeto que contém o nome e detalhes
            }
        }

        await browser.close(); // Fecha o navegador após coletar todos os dados

        return res.status(200).json({ empresas: empresasComDetalhes });
    } catch (error) {
        console.error('Erro ao buscar a página:', error);
        res.status(500).send('Erro ao buscar a página');
    }
});


module.exports = controllerMaps;