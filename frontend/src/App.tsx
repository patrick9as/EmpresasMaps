import { useState } from "react";
import "./App.css";
import axios from "axios";

const api = axios.create({
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

const inputStyle = {
    fontSize: "20px",
};

function App() {
    const [formData, setFormData] = useState({
        linkML: "",
        textoWhatsapp: "",
        botaoWhatsappVisible: false,
    });

    const handleSubmit = async () => {
        const response = await api.post("/mercadolivre", {
            urlBase: formData.linkML,
        });

        const texto = `${response.data.mensagem}%0A${formData.linkML}`;
        setFormData({
            ...formData,
            textoWhatsapp: texto,
            botaoWhatsappVisible: true,
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "20px",
            }}
        >
            <input
                style={inputStyle}
                placeholder="Link do mercado livre"
                value={formData.linkML}
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        linkML: e.target.value,
                    });
                }}
            ></input>

            {!formData.botaoWhatsappVisible && (
                <button type="button" onClick={handleSubmit}>
                    Carregar mensagem
                </button>
            )}

            {formData.botaoWhatsappVisible && (
                <a href={`${shareOptions.WhatsApp}${formData.textoWhatsapp}`}>
                    Compartilhar no Zap
                </a>
            )}
        </div>
    );
}

export default App;
