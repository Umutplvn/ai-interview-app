import React, { useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const Interview = () => {
  const vapiRef = useRef(null);        
  const [transcriptLog, setTranscriptLog] = useState("");
  const [inCall, setInCall] = useState(false);

  // İlk render’da Vapi örneğini üret
  React.useEffect(() => {

 


    vapiRef.current = new Vapi("51760d5a-99ef-4059-bf95-20e4189fe76a");
    return () => vapiRef.current?.stop(); // component unmount’ta görüşmeyi kapat
  }, []);

  const startInterview = async () => {
    const stored = localStorage.getItem("InterviewData");
    if (!stored) return console.error("InterviewData bulunamadı.");

    const { resume, description } = JSON.parse(stored);
    if (!resume || !description) {
      return console.error("resume veya description eksik.");
    }

    const assistantConfig = {
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
${resume}

And here is the job description:
${description}

Start every conversation with a warm greeting, e.g.:
"Hi there, this is Chloe from the XPertAI interview team. Thanks for joining! Are you ready to begin your interview now?"

Interview rules:
- Ask one question at a time (≈6 questions total) based on resume & description.
- Tone: natural, conversational, friendly.
- After every answer say a short acknowledgement (“Got it”, “Interesting!”, …).
- Wait until the candidate finishes speaking before the next question.
- Focus on relevant skills, experience, personality fit.
- Avoid robotic phrases like “this is a simulated interview”.
- Finish politely:
"Thanks a lot for your time. We will be in touch soon. Have a great day!"
After your final polite closing sentence, do not say anything further. Let the conversation end naturally.
`,
          },
        ],
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      name: "Chloe – Inline Interviewer",
      recordingEnabled: false,
    };

    await vapiRef.current.start(assistantConfig);
    setInCall(true);
  };

  const endInterview = () => {
    vapiRef.current.stop();
    setInCall(false);
  };

  return (
    <div>
      {inCall ? (
        <button onClick={endInterview} style={btnStyle}>
          Hang Up
        </button>
      ) : (
        <button onClick={startInterview} style={btnStyle}>
          Call
        </button>
      )}
    </div>
  );
};

const btnStyle = { cursor: "pointer", width: "4rem", height: "2rem" };

export default Interview;
