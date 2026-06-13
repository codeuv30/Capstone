import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, (req, res) => {
    console.log(`AI Orchestration server is running on PORT ${PORT}`)
});