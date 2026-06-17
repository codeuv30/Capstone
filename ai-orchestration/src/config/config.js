import "dotenv/config";

console.log(process.env.GEMINI_API_KEY);

if(!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environmental variables.");
};

if(!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not defined in environmental variables.");
};

const config = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};

export default config;