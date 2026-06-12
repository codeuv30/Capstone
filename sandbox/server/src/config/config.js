import "dotenv/config";

if(!process.env.PORT) {
    throw new Error("PORT is not defined in environmental variables.");
};

const config = {
    PORT: process.env.PORT,
}

export default config;