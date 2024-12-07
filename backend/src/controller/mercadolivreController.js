const { Router } = require("express");
const browserService = require("../service/browserService");

const mercadolivreController = Router();

mercadolivreController.post("/mercadolivre", async (req, res) => {
    try {
        await browserService.navigate(req.body.urlBase);
        let mensagem = '';

        //Nome do produto
        mensagem += await browserService.findInnerHTML(
            ".poly-component__title"
        );

        mensagem += '%0A';

        //Preço anterior
        try {
            mensagem += '~';
            mensagem += 'De R$ ' + await browserService.findElement(false, [
                ".poly-component__price",
                ".andes-money-amount--previous",
                ".andes-money-amount__fraction"
            ]);

            try {
                mensagem += ',' + await browserService.findElement(false, [
                    ".poly-component__price",
                    ".andes-money-amount--previous",
                    ".andes-money-amount__cents"
                ]);
    
            } catch (error) {
                
            }
            mensagem += '~';
            mensagem += '%0A';
            mensagem += 'Por '
        } catch (error) {
            
        }


        //Preço atual
        mensagem += '*';
        mensagem += 'R$ ' + await browserService.findElement(false, [
            ".poly-component__price",
            ".poly-price__current",
            ".andes-money-amount",
            ".andes-money-amount__fraction"
        ]);

        try {
            mensagem += ',' + await browserService.findElement(false, [
                ".poly-component__price",
                ".poly-price__current",
                ".andes-money-amount",
                ".andes-money-amount__cents"
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
