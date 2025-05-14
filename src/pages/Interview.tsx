import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'react-hot-toast';

const apiKey = process.env.REACT_APP_GEMINI_API!;

interface InterviewData {
  resume: string;
  description: string;
}

const Interview = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- Loading state

  useEffect(() => {
    if (!apiKey) {
      toast.error("API key is not valid!");
      return;
    }

    const rawData = localStorage.getItem('InterviewData');

    if (!rawData) {
      toast.error("No interview data found in localStorage.");
      return;
    }

    let interviewData: InterviewData;
    try {
      interviewData = JSON.parse(rawData);
    } catch (error) {
      toast.error("Interview data could not be parsed.");
      return;
    }

    const ai = new GoogleGenerativeAI(apiKey);

    async function main() {
      try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Here is a resume: ${interviewData.resume}
Here is a job description: ${interviewData.description}
Can you generate 5 interview questions based on this information?
Please format them like this:
QZT1: [Your first question]
QZT2: [Your second question]
QZT3: ...
`;



        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = await response.text();

        console.log("Gemini Output:", text);

        const extractedQuestions = text
          .split('\n')
          .filter(line => line.trim().startsWith("QZT"))
          .map(line => {
            const parts = line.split(':');
            return parts.slice(1).join(':').trim();
          });

        setQuestions(extractedQuestions);
      } catch (error) {
        console.error("Gemini failed:", error);
        toast.error("Gemini failed to generate content.");
      } finally {
        setIsLoading(false); // Set loading to false after API call
      }
    }

    main();
  }, []);

  return (
    <div>
    
    </div>
  );
};

export default Interview;
