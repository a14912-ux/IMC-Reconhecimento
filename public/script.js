const video = document.getElementById("video");
const startCamera = document.getElementById("startCamera");
const takePhoto = document.getElementById("takePhoto");
const resultado = document.getElementById("resultado");

let stream;

startCamera.onclick = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
};

takePhoto.onclick = async () => {
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
    });

    const data = await res.json();

    resultado.innerText =
        `IMC: ${data.imc}
Altura: ${data.height}
Peso: ${data.weight}
Categoria: ${data.categoria}`;
};