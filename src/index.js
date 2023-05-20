require("dotenv").config();

const express = require("express");
const path = require("path");
const compression = require("compression");
const controllers = require("./controllers/controllers");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.use(compression());

app.get("/api/get_text", controllers.text.getText);
app.get("/api/get_vocabs", controllers.text.getVocabs);

app.listen(port, () => {
  console.log(`🚀 Listening on http://localhost:${port}`);
});
