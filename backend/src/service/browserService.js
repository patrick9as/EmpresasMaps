const puppeteer = require("puppeteer");

class BrowserService {
    constructor() {
        (this.browser = {}), (this.page = {});
    }

    async navigate(url) {
        if (process.env.BROWSER == "LOCAL") {
            this.browser = await puppeteer.launch({
                executablePath: "/usr/bin/google-chrome-stable", // Caso queira usar uma instalação do Chrome
                headless: true,
            });
        } else {
            this.browser = await puppeteer.launch({
                headless: true,
            });
        }

        this.page = await this.browser.newPage();

        await this.page.goto(url, { waitUntil: "networkidle2" });

        this.sleep(5000);
    }

    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async findElement(willWaitForSelector, elementsList) {
        let elementHandle = this.page;

        for (let index = 0; index < elementsList.length; index++) {
            const elementName = elementsList[index];


			if (willWaitForSelector)
            	await elementHandle.waitForSelector(elementName, { visible: true });
            elementHandle = await elementHandle.$(elementName); // Retorna um handle do elemento
        }

		const innerHTML = await elementHandle.evaluate((el) => el.textContent.trim());
    	return innerHTML;
    }

    async findInnerHTML(elementName) {
        await this.page.waitForSelector(elementName, { visible: true });

        const result = await this.page.evaluate(async (selector) => {
            const element = await document.querySelector(selector);
            return element ? element.innerHTML.trim() : null;
        }, elementName); // Passando elementName como argumento para o evaluate

        return result; // Retorna o resultado
    }

    async close() {
        await this.browser.close();
    }
}

const browserService = new BrowserService();
module.exports = browserService;
