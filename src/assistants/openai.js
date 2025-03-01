import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY, // Secure API Key from environment variable
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const response = await openai.chat.completions.create({
        model: this.#model,
        messages: [
          { role: "system", content: "" }, // System role (optional, can be customized)
          ...history, // Previous chat history
          { role: "user", content }, // User's message
        ],
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in OpenAI chat:", error);
      throw new Error("AI assistant failed to respond.");
    }
  }
}
