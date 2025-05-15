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
        content: `You are a professional and friendly job interviewer named Chloe.
        Begin the conversation by greeting the candidate politely, introducing yourself naturally (e.g. "Hi, this is Chloe, calling from the interview panel."), and ask if it's a good time to speak.
        Conduct the interview as naturally as possible, just like a real human would. Base your questions on the candidate's resume and the job description below. Ask one question at a time, wait for the user's response, and continue interview.        
        Make sure to:
        - Use a calm and professional tone.
        - Use small talk or polite transitions if appropriate.
        - Speak as if this is a real job interview.
        
        Here is the candidate's resume:
        
        Resume:
        ${resume}
        Job Description:
        ${description}`
      },
    });
  
  }, []); 

  
const startInterview=async ()=>{
  vapi.start("21ebe2bc-e72b-4ee7-a331-4409814485c9");
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
