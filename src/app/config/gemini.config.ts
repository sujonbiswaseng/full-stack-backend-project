import OpenAI from "openai";
import { envVars } from "./env";

const apiKey = envVars.GEMINI_API_KEY || envVars.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    })
  : null;

export default openai