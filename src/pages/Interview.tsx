import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-hot-toast";

const apiKey = process.env.REACT_APP_GEMINI_API!;

const Interview = () => {
  const recognitionRef = useRef<any | null>(null);
  const synthRef = useRef(window.speechSynthesis);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      toast.error("API key is not valid!");
      return;
    }

    // Başlangıçta AI sesli "Hello" desin:
    speakText("Hello, welcome to your interview. Please answer the questions after the beep.");
  }, []);

  // Text-to-Speech fonksiyonu
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      toast.error("Speech Synthesis not supported.");
      return;
    }
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsSpeaking(false);
      // Konuşma bittikten sonra mikrofonu açabiliriz:
      startListening();
    };

    synthRef.current.cancel(); // varsa eski konuşmayı iptal et
    synthRef.current.speak(utterance);
  };

  // Konuşma tanıma başlatma
  const startListening = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      toast.error("Speech Recognition API is not supported.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionClass();

    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");

      // Kullanıcı cevabını al
      console.log("User said:", transcript);

      // AI'dan cevap al ve seslendir
      await generateAndSpeakAIResponse(transcript);
    };

    recognitionRef.current.start();
  };

  // AI modeliyle konuşmayı yönet
  const generateAndSpeakAIResponse = async (userInput: string) => {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an interview assistant. Respond conversationally and briefly to the candidate's answer:

Candidate said: "${userInput}"
Your response:
`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = await response.text();

      console.log("AI response:", text);

      // AI cevabını seslendir
      speakText(text);
    } catch (error) {
      toast.error("Failed to get AI response.");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Kullanıcıya sadece sesli mülakat olduğu için UI minimal veya boş olabilir */}
      <p style={{ display: "none" }}>Interview is in progress...</p>
      {/* İstersen mikrofonun açık/kapalı durumunu gösteren küçük bir ikon veya yazı koyabilirsin */}
    </div>
  );
};

export default Interview;
