import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

const Interview = () => {
  const [isFinished, setIsFinished] = useState(false);
  const [transcriptLog, setTranscriptLog] = useState("");

  console.log(transcriptLog);

  // 🔹 vapi'yi global tanımla
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

    vapi.on("message", (msg) => {
      if (msg.role === "assistant") {
        console.log("Assistant:", msg.content);

        if (msg.content.includes("We will be in touch soon. Have a great day!")) {
          setTimeout(() => {
            vapi.stop();
            setIsFinished(false);
          }, 200);
        }
      }
    });

    vapi.on("transcript", (t) => {
      setTranscriptLog((prev) => prev + `\n${t.speaker}: ${t.text}`);
    });

  }, []);

  const startInterview = async () => {
    setIsFinished(true);

    vapi.start({
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Chloe, a friendly and professional job interviewer.
Here is the candidate’s resume:
${localStorage.getItem("InterviewData") && JSON.parse(localStorage.getItem("InterviewData")).resume}
And here is the job description:
${localStorage.getItem("InterviewData") && JSON.parse(localStorage.getItem("InterviewData")).description}

Start every conversation with a warm greeting. Example:
"Hi there, this is Chloe from the XPertAI interview team. Thanks for joining! Are you ready to begin your interview now?"

Ask 5-6 questions one at a time based on the resume and job description.
Keep your tone natural, friendly, and conversational — not robotic.

After each answer, say something like "Interesting!", "Got it", or "Thanks for sharing" before moving to the next question.

Finish the interview with this exact sentence:
"Thanks a lot for your time. We will be in touch soon. Have a great day!"
After that, do not say anything else.`
          }
        ],
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      name: "Chloe - Inline Interviewer",
    });
  };

  // 🔹 Görüşmeyi manuel bitir
  const endInterview = () => {
    vapi.stop();
    setIsFinished(false);
  };

  return (
    <div>
      {isFinished ? (
        <button style={{ cursor: "pointer", width: "6rem", height: "2rem" }} onClick={endInterview}>
          Hang Up
        </button>
      ) : (
        <button style={{ cursor: "pointer", width: "6rem", height: "2rem" }} onClick={startInterview}>
          Call
        </button>
      )}

      {/* İsteğe bağlı: Transcript gösterimi */}
      {/* <pre>{transcriptLog}</pre> */}
    </div>
  );
};

export default Interview;
