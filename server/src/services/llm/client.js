import OpenAI from "openai";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const groq = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const callLLM = async ({
  systemPrompt,
  userPrompt,
  temperature = 0.8,
  maxTokens = 2000,
  jsonMode = true,
}) => {
  if (!env.GROQ_API_KEY) {
    throw ApiError.internal("GROQ_API_KEY is not configured");
  }

  const attempt = async (model) => {
    const response = await groq.chat.completions.create({
      model,

      temperature,

      max_tokens: maxTokens,

      response_format: jsonMode
        ? { type: "json_object" }
        : undefined,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const text = response.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("Groq returned empty response");
    }

    return text;
  };

  try {
    return await attempt(env.GROQ_MODEL);
  } catch (err) {
    const status = err.status;

    const retry =
      !status ||
      status === 429 ||
      status >= 500;

    if (
      retry &&
      env.GROQ_MODEL !== env.GROQ_FALLBACK_MODEL
    ) {
      console.warn("Primary Groq model failed, trying fallback...");

      try {
        return await attempt(env.GROQ_FALLBACK_MODEL);
      } catch (err2) {
        throw ApiError.internal(
          `Groq unavailable: ${err2.message}`
        );
      }
    }

    throw ApiError.internal(err.message);
  }
};

export const parseJSON = (raw) => {
  if (!raw) throw new Error("Empty response");

  let txt = raw.trim();

  if (txt.startsWith("```")) {
    txt = txt
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }

  const first = txt.indexOf("{");
  const last = txt.lastIndexOf("}");

  if (first !== -1 && last !== -1) {
    txt = txt.slice(first, last + 1);
  }

  return JSON.parse(txt);
};