const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultado = document.getElementById("resultado");

let imagem = null;

// webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    resultado.style.display = "block";
    resultado.innerHTML = "Webcam não disponível";
  });

// tirar foto
document.getElementById("tirarFoto").addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  imagem = canvas.toDataURL("image/jpeg", 0.8);
  resultado.style.display = "block";
  resultado.innerHTML = "Foto tirada! Mete o peso e altura e clica em Analisar.";
});

// analisar
document.getElementById("analisar").addEventListener("click", async () => {
  const altura = parseFloat(document.getElementById("altura").value);
  const peso = parseFloat(document.getElementById("peso").value);

  if (!imagem) {
    resultado.style.display = "block";
    resultado.innerHTML = "Tira a foto primeiro!";
    return;
  }

  if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
    resultado.style.display = "block";
    resultado.innerHTML = "Mete a altura em metros (ex: 1.75) e o peso em kg (ex: 70)!";
    return;
  }

  resultado.style.display = "block";
  resultado.innerHTML = "A analisar...";

  try {
    const res = await fetch("/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imagem, peso: peso, altura: altura })
    });

    const data = await res.json();

    if (data.erro) {
      resultado.innerHTML = "Erro: " + data.erro;
      return;
    }

    let emoji = "";
    if (data.classificacao === "abaixo do peso") emoji = "⚠️";
    else if (data.classificacao === "peso normal") emoji = "✅";
    else if (data.classificacao === "excesso de peso") emoji = "⚠️";
    else emoji = "🔴";

    resultado.innerHTML =
      "👤 Idade estimada: " + data.idade + " anos<br>" +
      "⚖️ IMC: " + data.imc + "<br>" +
      emoji + " Classificação: " + data.classificacao + "<br><br>" +
      "💡 Dica: " + data.dica;

  } catch (err) {
    resultado.innerHTML = "Erro ao ligar ao servidor";
  }
});