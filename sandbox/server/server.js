import app from "./src/app.js";
import config from "./src/config/config.js";
import connectToDB from "./src/config/db.js";

const PORT = config.PORT;

app.listen(PORT, () => {
    connectToDB();
    console.log(`Sandbox API server is running on PORT ${PORT}`)
});