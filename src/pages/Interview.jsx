import React, { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const Interview = () => {
  const [isFinished, setIsFinished] = useState(false)
  const vapi = new Vapi("51760d5a-99ef-4059-bf95-20e4189fe76a");

  useEffect(() => {
    const interviewData = localStorage.getItem("InterviewData");
    if (!interviewData) {
      console.error("InterviewData not found in localStorage.");
      return;
    }
    const { resume, description } = JSON.parse(interviewData);
    if (!resume || !description) {
      console.error("Missing resume or job description in InterviewData.");
      return;
    }
  
    vapi.send({
      type: "add-message",
      message: {
        role: "system",
        content: `You are Chloe, a friendly and professional job interviewer.

        Here is the candidate’s resume:
        {{resume}}
        
        And here is the job description:
        {{description}}
        
        Start every conversation with a warm greeting. 
        Example opening:
        "Hi there, this is Chloe from the interview team. Thanks for joining! Are you ready to begin your interview now?"
        
        Here’s how you should conduct the interview:
        
        - Ask one interview question at a time, based on the candidate's resume and the job description.
        - Make your tone natural, conversational, and friendly — not robotic.
        - After each response, give a short and human-like acknowledgement like “Got it”, “Interesting!”, or “Thanks for sharing.”
        - Transition smoothly to the next question.
        - Wait for the candidate to fully finish speaking before you move on.
        - Focus on relevant skills, experience, and personality fit.
        
        Avoid robotic phrases like “this is a simulated interview” or “I will now ask 5 questions”.
        - Ask around 6 questions about the job details.
        
        Finish the interview with a polite closing like:
        "Thanks a lot for your time, {{candidateName}}. We’ll be in touch soon. Have a great day!"
        `
      },
    });
  
  }, []); 

  
const startInterview=async ()=>{
  vapi.start("94203692-8db1-4266-b900-a5ec1c36705f");
  setIsFinished(true)
}

const endInterview=()=>{
  vapi.on("call-end", () => {
    console.log("Call has ended.");
  });
  setIsFinished(false)
}
    


  return (
    <div>
      {isFinished? 
      <button onClick={endInterview}>Hang Up</button>:
      <button onClick={startInterview}>Call</button>
      }
    </div>
  );

  }
export default Interview
