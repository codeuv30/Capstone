import app from "./src/app.js";
import config from "./src/config/config.js";

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`Sandbox API server is running on PORT ${PORT}`)
});