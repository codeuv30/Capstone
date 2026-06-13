import "dotenv/config";

if(!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not defined in environmental variables.");
};

const config = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY
};

export default config;