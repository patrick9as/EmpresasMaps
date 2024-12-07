const { Router } = require("express");
const browserService = require("../service/browserService");

const mercadolivreController = Router();

mercadolivreController.post("/amazon", async (req, res) => {
    try {
        await browserService.navigate(req.body.urlBase);
        let mensagem = '';

        //Nome do produto
        mensagem += await browserService.findInnerHTML(
            "#productTitle"
        );

        mensagem += '%0A';

        //Preço atual
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
        
        await browserService.close();

        res.status(200).json({ mensagem: mensagem });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = mercadolivreController;
