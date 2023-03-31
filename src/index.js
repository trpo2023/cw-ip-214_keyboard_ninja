const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

let server = app.listen(port, () => {
  console.log(`🚀 Listening on http://localhost:${port}`);
});
