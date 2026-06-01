const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.post("/api/analyze", (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Sem imagem" });
        }

        const base64 = image.split(",")[1];

        const fileName = `img_${Date.now()}.png`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, base64, "base64");

        res.json({
            status: "ok",
            file: fileName
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no server" });
    }
});

app.listen(3000, () => {
    console.log("Server: http://localhost:3000");
});