import { useState } from "react";
import "./App.css";
import axios from "axios";

axios.create({
    baseURL: 'http://ec2-15-228-39-219.sa-east-1.compute.amazonaws.com:8080/'
})

function App() {
    const [formData, setFormData] = useState({
        linkML: ''
    });

    const handleSubmit = async () => {
        axios.post('/mercadolivre', formData.linkML);
    };

    return (
        <>
            <input
                placeholder="Link do mercado livre"
                value={formData.linkML}
            ></input>
        </>
    );
}

export default App;
