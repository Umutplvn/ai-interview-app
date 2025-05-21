import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyBtRyabSRdfcGwmHJe0dGUY8JUC7UTxf48", // Still recommending moving this to .env
  });

export const analyzeTranscript = async (transcriptLog) => {
  const interviewData = localStorage.getItem("InterviewData");
  if (!interviewData) {
    console.error("InterviewData not found");
    return null;
  }

  let resume, description;
  try {
    ({ resume, description } = JSON.parse(interviewData));
  } catch (e) {
    console.error("Invalid InterviewData format", e);
    return null;
  }

  const prompt = `
You are an expert job interviewer and evaluator.

Here is the transcript of an interview with a candidate:
${transcriptLog}

Here is the job description and resume:
Job Description: ${description}
Resume: ${resume}

Please analyze the candidate’s performance and return a JSON object with the following structure:

{
  "score": number,
  "strongSides": string[],
  "weaknesses": string[]
}

Only output the JSON object, no extra text.
`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-pro"
    const result = await model.generateContent([
      { role: "user", parts: [{ text: prompt }] },
    ]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return null;
  }
};
