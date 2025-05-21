import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import interviewer from "../assets/interviewer.png";
import profile from "../assets/profile.jpg";
import "../styles/Interview.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Interview = () => {
  const [isFinished, setIsFinished] = useState(false);
  const [status, setStatus] = useState("Call");

  const [transcriptLog, setTranscriptLog] = useState("");
  const vapiRef = useRef(null);
  const { name } = useSelector((state) => state.auth);

  useEffect(() => {
    vapiRef.current = new Vapi("51760d5a-99ef-4059-bf95-20e4189fe76a");

    const vapi = vapiRef.current;

    const onMessage = (msg) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscriptLog((prev) =>
          prev ? prev + "\n" + msg.transcript : msg.transcript
        );
      }
    };

    const onCallStart = () => {
      setStatus("Hang Up");
      vapi.say(
        "Hi there, this is Chloe from the XPertAI interview team. Thanks for joining! Are you ready to begin your interview now?"
      );
      setIsFinished(true);
    };

    const onCallEnd = () => {
      setIsFinished(false);
      setStatus("Call");
    };

    vapi.on("message", onMessage);
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);

    return () => {
      vapi.off("message", onMessage);
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
    };
  }, []);

  const startInterview = async () => {
    setStatus("Ringing");
    const vapi = vapiRef.current;

    const interviewData = localStorage.getItem("InterviewData");
    if (!interviewData) {
      alert("InterviewData not found in localStorage.");
      return;
    }
    const { resume, description } = JSON.parse(interviewData);

    await vapi.start({
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

Start every conversation with a warm greeting. Example:
"Hi there, this is Chloe from the XPertAI interview team. Thanks for joining! Are you ready to begin your interview now?"

Ask 5-6 questions one at a time based on the resume and job description.
Keep your tone natural, friendly, and conversational — not robotic.

After each answer, say something like "Interesting!", "Got it", or "Thanks for sharing" before moving to the next question.

Finish the interview like this sentence:
"Thanks a lot for your time. We will be in touch soon. Have a great day!"
After that, do not say anything else.`,
          },
        ],
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      name: "Chloe - Inline Interviewer",
    });
  };

  const endInterview = () => {
    vapiRef.current.stop();
    setIsFinished(false)
    localStorage.setItem("InterviewTranscript", transcriptLog);
    
    setTimeout(() => {
        toast.success('Great job! Feedback is in your profile.')
    }, 1000);
  };

  return (
    <div className="main-wrapper">
      <div className="box-wrapper">
        <div className="image-box" style={{}}>
          <img
            src={`${interviewer}`}
            style={{
              width: "8rem",
              height: "8rem",
              borderRadius: "50%",
              border: "2px solid #056c00dd",
            }}
            alt=""
          />
          <h3 className="ai-name">Chloe</h3>
        </div>

        <div className="image-box2" style={{}}>
          <img
            src={`${profile}`}
            style={{
              width: "8rem",
              height: "8rem",
              borderRadius: "50%",
              border: "2px solid #004e86dd",
            }}
            alt=""
          />
          <h3 className="ai-name">{name}</h3>
        </div>
      </div>

      <section
        onClick={status === "Hang Up" ? endInterview : startInterview}
        className={`call-button ${
          status === "Call"
            ? "call"
            : status === "Ringing"
            ? "calling"
            : status === "Hang Up"
            ? "hangup"
            : ""
        }`}
      >
        <a className="cc-calto-action-ripple">
          <i className="fa fa-phone"></i>
          <span className="num">{status}</span>
        </a>
      </section>
    </div>
  );
};

export default Interview;

// Transkript gemini ile degerlendirmeye sokulacak ve puan verilecek.
