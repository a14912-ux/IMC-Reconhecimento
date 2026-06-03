const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.post("/analisar", async (req, res) => {
  try {
    const { image, peso, altura } = req.body;

    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const imc = (peso / (altura * altura)).toFixed(2);

    let classificacao = "";
    if (imc < 18.5) classificacao = "abaixo do peso";
    else if (imc < 25) classificacao = "peso normal";
    else if (imc < 30) classificacao = "excesso de peso";
    else classificacao = "obesidade";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "SUA_API_KEY_AQUI",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: base64 }
              },
              {
                type: "text",
                text: `Olha para esta foto de uma pessoa.
A pessoa tem ${altura}m de altura, pesa ${peso}kg e o IMC é ${imc} (${classificacao}).
Responde APENAS com JSON válido neste formato exacto, sem texto antes ou depois, sem backticks:
{"idade": 25, "dica": "conselho curto aqui"}
- idade: número inteiro estimado pela cara, mínimo 16
- dica: 1 frase curta e prática para melhorar o IMC tendo em conta a classificação "${classificacao}"`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // log para ver o que o Claude devolveu
    console.log("Resposta Claude:", data.content[0].text);

    const texto = data.content[0].text.trim();

    // extrai o JSON mesmo que venha com texto à volta
    const match = texto.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON não encontrado na resposta");

    const resultado = JSON.parse(match[0]);

    res.json({
      idade: Math.max(16, resultado.idade),
      imc: parseFloat(imc),
      classificacao,
      dica: resultado.dica
    });

  } catch (err) {
    console.error("ERRO:", err);
    res.json({ erro: "Erro no servidor: " + err.message });
  }
});

app.listen(3000, () => console.log("Server ON: http://localhost:3000"));