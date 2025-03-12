import { GoogleGenerativeAI } from "@google/generative-ai";

export const callGeminiApi = async (prompt:string, apiKey:string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}