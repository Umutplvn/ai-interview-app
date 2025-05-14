import React, { useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API!;

const Interview = () => {
  useEffect(() => {
    if (!apiKey) {
      console.error("API anahtarı tanımlı değil");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    async function main() {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Explain how AI works in a few words");
        const response = await result.response;
        const text = await response.text();
        console.log(text);
      } catch (error) {
        console.error("Gemini hatası:", error);
      }
    }
    main();
  }, []);

  return <div>Interview Page</div>;
};

export default Interview;
