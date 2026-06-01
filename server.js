const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

const uploadDir = path.join(__dirname, "uploads");

// garantir pasta existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.post("/api/analyze", (req, res) => {
    try {
        const image = req.body.image;

        if (!image) {
            return res.json({ error: "Sem imagem" });
        }

        // remover base64 prefix
        const base64 = image.split(",")[1];

        const fileName = `img_${Date.now()}.png`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, base64, "base64");

        return res.json({
            imc: 22.5,
            height: 1.70,
            weight: 65,
            categoria: "Normal"
        });

    } catch (err) {
        console.log(err);
        return res.json({ error: "Server crash" });
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});