import { useState } from "react";
import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8080",
    baseURL: "http://ec2-15-228-39-219.sa-east-1.compute.amazonaws.com:8080",
});

const shareOptions = {
    Facebook: "https://www.facebook.com/sharer/sharer.php?u=",
    Google: "https://plus.google.com/share?url=",
    Twitter: "https://twitter.com/intent/tweet?url=",
    LinkedIn: "https://www.linkedin.com/sharing/share-offsite/?url=",
    WhatsApp: "https://api.whatsapp.com/send?text=",
    Reddit: "https://www.reddit.com/submit?url=",
    Telegram: "https://t.me/share/url?url=",
    Pinterest: "https://pinterest.com/pin/create/button/?url=",
    Tumblr: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=",
    "Copiar Link": "",
    Email: "mailto:?body=",
};

function App() {
    const [formData, setFormData] = useState({
        linkProduto: "",
        textoWhatsapp: "",
        botaoWhatsappVisible: false,
        loading: false,
        falhaCapturarDados: false,
    });

    const handleSubmit = async () => {
        setFormData({
            ...formData,
            loading: true,
            falhaCapturarDados: false,
        });

        let response = undefined;

        if (
            formData.linkProduto.includes("amazon") ||
            formData.linkProduto.includes("amzn.to")
        )
            response = await api.post("/amazon", {
                urlBase: formData.linkProduto,
            });

        if (formData.linkProduto.includes("mercadolivre"))
            response = await api.post("/mercadolivre", {
                urlBase: formData.linkProduto,
            });

        console.log("response");
        if (!response) {
            setFormData({
                ...formData,
                loading: false,
                botaoWhatsappVisible: false,
                falhaCapturarDados: true,
            });
            return;
        }
        const texto = `${response.data.mensagem}%0A${formData.linkProduto}`;
        setFormData({
            ...formData,
            textoWhatsapp: texto,
            botaoWhatsappVisible: true,
            loading: false,
            falhaCapturarDados: false,
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "20px",
                padding: "30px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <h2>Espião de marketplace</h2>
                <img
                    src="https://static-00.iconduck.com/assets.00/spy-icon-2048x1979-xmmsyi34.png"
                    style={{
                        maxWidth: "50px",
                        background: "white",
                        borderRadius: "50%",
                        padding: "12px",
                    }}
                />
            </div>

            <div
            style={{display: "flex", flexDirection: "column", gap: "18px"}}
            >
                {!formData.botaoWhatsappVisible && (
                    <input
                        placeholder="Link do produto"
                        value={formData.linkProduto}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                linkProduto: e.target.value,
                            });
                        }}
                    ></input>
                )}

                {!formData.botaoWhatsappVisible && (
                    <button type="button" onClick={handleSubmit}>
                        Carregar mensagem
                    </button>
                )}
            </div>

            {formData.falhaCapturarDados && (
                <span style={{ color: "red" }}>Falha ao capturar dados!</span>
            )}

            {formData.loading && (
                <img src="https://c.tenor.com/jgDVuidR3bkAAAAd/tenor.gif"></img>
            )}

            {formData.botaoWhatsappVisible && (
                <a href={`${shareOptions.WhatsApp}${formData.textoWhatsapp}`}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                        }}
                    >
                        <p>Enviar por </p>
                        <img
                            src="https://static.whatsapp.net/rsrc.php/yZ/r/JvsnINJ2CZv.svg"
                            alt=""
                        ></img>
                    </div>
                </a>
            )}
        </div>
    );
}

export default App;
