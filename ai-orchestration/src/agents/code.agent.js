import { ChatMistralAI } from "@langchain/mistralai";
import config from "../config/config.js";
import { listFiles, readFiles, updateFiles } from "./tools.js";
import { createAgent } from "langchain";

const model = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRAL_API_KEY,
});

const agent = createAgent({
  model,
  tools: [listFiles, readFiles, updateFiles],
});

await agent.invoke({
  messages: [
    {
      role: "user",
      content: "create a snake game with score in this current project also remove the previous things that was like trading dashboard just a simple playable clean UI snake game with score.",
    },
    {
        role: "user",
        content: "in this the food moves too much fast and add css animations and make the UI good"
    },
    {
        role: "user",
        content: "in this the food moves too much fast make it slow that user can atleast take it"
    }
  ],
});
