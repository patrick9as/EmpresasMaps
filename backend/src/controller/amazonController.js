const { Router } = require("express");
const browserService = require("../service/browserService");

const mercadolivreController = Router();

mercadolivreController.post("/amazon", async (req, res) => {
    try {
        await browserService.navigate(req.body.urlBase);
        let mensagem = '';

        //Nome do produto
        mensagem += await browserService.findElement(true, 
            ["#productTitle"]
        );
        //Nome do produto

        //Preço anterior
        try {
            mensagem += '%0A';
            mensagem += '~';
            mensagem += await browserService.findElement(false, [
                '.a-size-small.aok-offscreen',
            ]);
            mensagem += '~';
        } catch (error) {
            
        }
        //Preço anterior

        //Preço atual
        mensagem += '%0A';
        mensagem += '*';
        mensagem += 'R$ ' + await browserService.findElement(false, [
            ".a-price-whole",
        ]);
        
        try {
            mensagem += await browserService.findElement(false, [
                ".a-price-fraction",
            ]);
        } catch (error) {
            
        }
        mensagem += '*';
        //Preço atual

        await browserService.close();

        res.status(200).json({ mensagem: mensagem });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = mercadolivreController;
