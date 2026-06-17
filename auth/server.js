import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

const PORT = 3000;

app.listen(PORT, () => {
    connectToDB();
    console.log(`Auth server is listening on PORT ${PORT}`);
});