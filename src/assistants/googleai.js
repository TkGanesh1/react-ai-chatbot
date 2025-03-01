import { GoogleGenerativeAI } from "@google/generative-ai";

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export class Assistant {
  #chatPro;
  #chatFlash;

  constructor() {
    const geminiPro = googleai.getGenerativeModel({ model: "gemini-1.5-pro" });
    const geminiFlash = googleai.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    this.#chatPro = geminiPro.startChat({ history: [] });
    this.#chatFlash = geminiFlash.startChat({ history: [] });
  }

  async chat(content) {
    try {
      const isSimpleQuery =
        content.length < 20 && /^[a-zA-Z\s?]+$/.test(content);
      const chatModel = isSimpleQuery ? this.#chatFlash : this.#chatPro;

      const result = await chatModel.sendMessage(content);
      return result.response.text();
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content) {
    try {
      const isSimpleQuery =
        content.length < 20 && /^[a-zA-Z\s?]+$/.test(content);
      const chatModel = isSimpleQuery ? this.#chatFlash : this.#chatPro;

      const result = await chatModel.sendMessageStream(content);

      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    } catch (error) {
      console.error("Streaming error:", error);
      throw error;
    }
  }
}
