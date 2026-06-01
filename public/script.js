window.addEventListener("load", () => {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const startCamera = document.getElementById("startCamera");
    const takePhoto = document.getElementById("takePhoto");
    const result = document.getElementById("result");

    let stream;

    console.log("JS carregado ✔");

    // 📷 ABRIR CÂMARA
    startCamera.addEventListener("click", async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await video.play();

            console.log("Câmara ligada ✔");
            result.innerHTML = "📷 Câmara ligada com sucesso";

        } catch (err) {
            console.error(err);
            result.innerHTML = "❌ Erro ao abrir câmara";
        }
    });

    // 📸 TIRAR FOTO + RESULTADO
    takePhoto.addEventListener("click", () => {

        console.log("Botão foto clicado ✔");

        if (!video.videoWidth) {
            result.innerHTML = "⚠️ Liga a câmara primeiro";
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/png");

        console.log("Imagem capturada ✔");

        // 🔥 RESULTADO SIMPLES (TESTE PRIMEIRO)
        const fakeHeight = 1.72;
        const fakeWeight = 70;
        const bmi = (fakeWeight / (fakeHeight * fakeHeight)).toFixed(2);

        let category = "";

        if (bmi < 18.5) category = "Baixo peso";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Excesso de peso";
        else category = "Obesidade";

        result.innerHTML = `
            <h3>📊 Resultado</h3>
            <p>📏 Altura: ${fakeHeight} m</p>
            <p>⚖️ Peso: ${fakeWeight} kg</p>
            <p>📉 IMC: ${bmi}</p>
            <p>📌 Categoria: ${category}</p>
        `;
    });

});