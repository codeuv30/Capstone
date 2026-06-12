import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, (req, res) => {
    console.log(`Sandbox Router server is running on PORT ${PORT}`)
});