/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";

export class LLMService {
  private apiKey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY;
    this.model =
      envVars.RAG.OPENROUTER_LLM_MODEL || envVars.RAG.DEESPEEK_OPEN_ROUTER_API_MODEL;

    if (!this.apiKey) {
      throw new Error("OpenRouter api key is missing...");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
      // Combine context with prompt for RAG
      let fullPrompt =
        context.length > 0
          ? `Context information:\n${context.join("\n\n")}\n\nQuestion: ${prompt}\n\nAnswer based on the context above.`
          : prompt;

      if (asJson) {
        fullPrompt += `\n\nReturn ONLY a valid JSON object matching this structure: {"event": [{"title": "event title", "description": "event description", "id": "id"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }

      const systemMessage = asJson
        ? "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags."
        : "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";

      const bodyPayload: any = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more deterministic JSON
        max_tokens: 1500,
      };

      if (
        asJson &&
        (this.model.includes("gpt") || this.model.includes("openai")) || (this.model.includes("DeepSeek"))
      ) {
        bodyPayload.response_format = { type: "json_object" };
      }

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`,
        );
      }

      const data = await response.json();

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }

  async generateSegessions(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {

    const events =
    await prisma.event.findMany({
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
    try {
      const aiPrompt = `
      You are an AI-powered event search engine.
      
      TASK:
      Generate ONLY event-related search suggestions.
      
      USER QUERY:
      ${prompt}
      
      AVAILABLE EVENTS:
      ${JSON.stringify(events)}

      avalible information : 
      ${context}
      
      STRICT RULES:
      - Only event suggestions
      - Short meaningful titles
      - No explanation
      - No markdown
      - JSON only
      
      RETURN FORMAT:
      {
        "suggestions": [
          {
            "title": "event title"
          }
        ]
      }
      `;

      
      const bodyPayload: any = {
        model: this.model,
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more deterministic JSON
        max_tokens: 1500,
      };

      if (
        asJson &&
        (this.model.includes("gpt") || this.model.includes("openai")) || (this.model.includes("DeepSeek"))
      ) {
        bodyPayload.response_format = { type: "json_object" };
      }

  

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`,
        );
      }

      const data = await response.json();

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }

  async generatePersonalizedRecommendations(
    userId: string,
    viewerId:string,
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {

    // User activity history
    const userActivities = await prisma.userActivity.findMany({
      where: {
        viewerId:viewerId,
      },
  
      take: 10,
  
      orderBy: {
        createdAt: "desc",
      },
  
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            category_name: true,
            location: true,
          },
        },
      },
    });

    const events = userActivities.map((item) => ({
      id: item.eventid,
      title: item.event.title,
      description: item.event.description,
      location: item.event.location,
      category_name: item.event.category_name,
    }));

    try {
      const aiPrompt = `
      You are an AI-powered recommendation engine.
  
      TASK:
      Generate ONLY personalized event recommendations.
  
      USER SEARCH:
      ${prompt}  
    
  
      AVAILABLE EVENTS:
      ${JSON.stringify(events)}
  
      EXTRA CONTEXT:
      ${context}
  
      STRICT RULES:
      - Only personalized event recommendations
      - Use user activity + AI history
      - Short meaningful titles
      - Professional response
      - No markdown
      - JSON only
  
      RETURN FORMAT:
      {
        "recommendations": [
          {
            "id": "event id",
            "title": "event title",
            "category": "event category",
            "reason": "recommended based on user activity"
          }
        ]
      }
      `;
  
      const bodyPayload: any = {
        model: this.model,
  
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
      };
  
      if (
        asJson &&
        (
          this.model.includes("gpt") ||
          this.model.includes("openai") ||
          this.model.includes("DeepSeek") ||
          this.model.includes("deepseek")
        )
      ) {
        bodyPayload.response_format = {
          type: "json_object",
        };
      }
  
      const response = await fetch(
        `${this.apiUrl}/chat/completions`,
        {
          method: "POST",
  
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://lumen-management.local",
            "X-Title": "lumen Management System",
          },
  
          body: JSON.stringify(bodyPayload),
        },
      );
  
      if (!response.ok) {
        const errorData = await response.json();
  
        throw new Error(
          `OpenRouter API error: ${response.status} - ${
            errorData.error?.message || "unknown error"
          }`,
        );
      }
  
      const data = await response.json();
      console.log(data,'data')
      console.log(data.choices[0].message.content,'content')
      return data.choices[0].message.content;
  
    } catch (error) {
  
      console.error(
        "Error generating personalized recommendations:",
        error,
      );
  
      throw error;
    }
  }

  async generateTrendingItems(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false
  ) {
    try {
  
      // 1. Get trending data from user activity
      const trendingActivities = await prisma.userActivity.groupBy({
        by: ["eventid"],  
        _count: {
          eventid: true,
        },
  
        orderBy: {
          _count: {
            eventid: "desc",
          },
        },
      });
  
      const eventIds = trendingActivities.map((t) => t.eventid);
  
      // 2. Fetch event details
      const events = await prisma.event.findMany({
        where: {
          id: {
            in: eventIds,
          },
        },
  
        select: {
          id: true,
          title: true,
          description: true,
          category_name: true,
          location: true,
        },
      });
  
      // 3. Maintain ranking order
      const trendingEvents = eventIds.map((id) =>
        events.find((e) => e.id === id),
      );
  
      // 4. AI Prompt (same style as yours)
      const aiPrompt = `
      You are an AI-powered trending engine.
  
      TASK:
      Generate ONLY trending event items based on user activity.
  
      USER SEARCH:
      ${prompt}
  
      AVAILABLE TRENDING EVENTS:
      ${JSON.stringify(trendingEvents)}
  
      EXTRA CONTEXT:
      ${context}
  
      STRICT RULES:
      - Only trending events
      - Based on user activity analysis
      - Short meaningful titles
      - Professional response
      - No markdown
      - JSON only
  
      RETURN FORMAT:
      {
        "trending": [
          {
            "id": "event id",
            "title": "event title",
            "category": "event category",
            "reason": "why this event is trending"
          }
        ]
      }
      `;
  
      // 5. API Payload
      const bodyPayload: any = {
        model: this.model,
  
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
      };
  
      // 6. JSON mode support
      if (
        asJson &&
        (
          this.model.includes("gpt") ||
          this.model.includes("openai") ||
          this.model.includes("DeepSeek") ||
          this.model.includes("deepseek")
        )
      ) {
        bodyPayload.response_format = {
          type: "json_object",
        };
      }
  
      // 7. Call LLM
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
  
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lumen-management.local",
          "X-Title": "lumen Management System",
        },
  
        body: JSON.stringify(bodyPayload),
      });
  
      // 8. Error handling
      if (!response.ok) {
        const errorData = await response.json();
  
        throw new Error(
          `OpenRouter API error: ${response.status} - ${
            errorData.error?.message || "unknown error"
          }`,
        );
      }
  
      // 9. Response
      const data = await response.json();
  
      console.log(data, "data");
      console.log(data.choices[0].message.content, "content");
  
      return data.choices[0].message.content;
  
    } catch (error) {
  
      console.error(
        "Error generating trending items:",
        error,
      );
  
      throw error;
    }
  }
}