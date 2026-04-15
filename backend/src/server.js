require("dotenv").config();
const { initDb } = require("./config/initDB");
const app = require("./app");

const PORT = process.env.PORT || 3000;

initDb();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});