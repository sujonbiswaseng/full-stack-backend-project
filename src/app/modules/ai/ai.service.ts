import openai from "../../config/gemini.config";
import { prisma } from "../../lib/prisma";
import { LLMService } from "../rag/llm.service";
import AppError from "../../errorHelper/AppError";
import status from "http-status";

const llm = new LLMService();

/* ---------------- SEARCH SUGGESTIONS ---------------- */

const searchSuggestions = async (prompt: string) => {
  console.log(prompt, "prompt");

  // ⚡ FAST DB SEARCH
  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: prompt,
        mode: "insensitive",
      },
    },

    take: 5,

    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  const content= `
  You are an AI-powered event search engine
  TASK:
  Generate ONLY event-related search suggestions based on the user query and available event data.
  
  USER QUERY:
  ${prompt}
  
  AVAILABLE EVENTS:
  ${JSON.stringify(events)}
  
  STRICT RULES:
  - Only return event-related suggestions
  - Each suggestion must be short and meaningful
  - No explanation, no extra text
  - Do NOT include non-event data
  - Do NOT include markdown or text outside JSON
  
  OUTPUT FORMAT (STRICT JSON):
  {
    "suggestions": [
      {
        "title": "short event title"
      }
    ]
  }
  `
  if (!openai) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "AI suggestions are unavailable because no Gemini/OpenAI key is configured. Add GEMINI_API_KEY or OPENAI_API_KEY to your .env file."
    );
  }

  const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
      {
        role: "user",
        content:content,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseContent = response.choices[0].message.content;
  console.log(responseContent,'content')
  const result = JSON.parse(responseContent || "{}");
  return result;
};

export const aiService = {
  searchSuggestions,
};
