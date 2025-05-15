import React, { useState, useEffect, useRef } from 'react';

const Main = () => {
  const [callActive, setCallActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 5;
  const [resume, setResume] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string | null>(null);

  useEffect(() => {
    const storedResume = localStorage.getItem('resume');
    const storedJobDescription = localStorage.getItem('jobDescription');
    setResume(storedResume);
    setJobDescription(storedJobDescription);
  }, []);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
    return utterance;
  };

  const startInterview = async () => {
    if (!resume || !jobDescription) {
      speak("Please ensure the resume and job description are stored in local storage.");
      return;
    }

    setAnswers([]);
    setCurrentQuestion("");
    setQuestionCount(0);
    setCallActive(true);
    speak("Please ensure the resume and job description are stored in local storage.").onend?.(() => {
      // --- Conceptual vapi.ai Integration ---
      // In a real application, you would make an API call here.
      // For this example, we'll simulate getting the first question.
      getFirstQuestionFromAI(resume, jobDescription).then(firstQuestion => {
        if (firstQuestion) {
          setCurrentQuestion(firstQuestion);
          speak(firstQuestion);
        } else {
          speak("Failed to get the first question.");
          setCallActive(false);
        }
      });
    });
  };
  // --- Conceptual Function to Get the First Question from vapi.ai ---
  const getFirstQuestionFromAI = async (resume: string, jobDescription: string): Promise<string | null> => {
    // In a real application, you would use fetch to call the vapi.ai API.
    // Example (replace with actual vapi.ai endpoint and API key):
    // const response = await fetch('https://api.vapi.ai/generate_first_question', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'YOUR_VAPI_AI_API_KEY',
    //   },
    //   body: JSON.stringify({ resume, job_description: jobDescription }),
    // });
    // const data = await response.json();
    // return data.question;

    // Simulate a response for this example
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return "Tell me about your experience related to this job description.";
  };

  // --- Conceptual Function to Get Subsequent Questions from vapi.ai ---
  const getNextQuestionFromAI = async (currentQuestion: string, userAnswer: string, resume: string, jobDescription: string): Promise<string | null> => {
    // In a real application, you would use fetch to call the vapi.ai API.
    // Example (replace with actual vapi.ai endpoint and API key):
    // const response = await fetch('https://api.vapi.ai/generate_next_question', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'YOUR_VAPI_AI_API_KEY',
    //   },
    //   body: JSON.stringify({ current_question: currentQuestion, user_answer: userAnswer, resume, job_description: jobDescription }),
    // });
    // const data = await response.json();
    // return data.question;

    // Simulate a response for this example
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    const simulatedQuestions = [
      "Why are you interested in this company?",
      "Describe a time you faced a challenge and how you overcame it.",
      "What are your salary expectations?",
      "Do you have any questions for me?",
    ];
    return simulatedQuestions[questionCount - 1] || null;
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;

    setAnswers(prev => [...prev, userAnswer.trim()]);
    setUserAnswer("");
    setQuestionCount(prevCount => prevCount + 1);

    if (questionCount < totalQuestions) {
      speak("Thank you for your answer. Let me think...");
      const nextQuestion = await getNextQuestionFromAI(currentQuestion, userAnswer, resume!, jobDescription!);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        speak(nextQuestion);
      } else {
        speak("Something went wrong while generating the next question.");
        setCallActive(false);
      }
    } else {
      speak("Thank you for your answers. The voice interview is now complete.");
      setCallActive(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!callActive ? (
        <button onClick={startInterview} disabled={!resume || !jobDescription}>
          Start Voice Interview
        </button>
      ) : (
        <button onClick={() => setCallActive(false)}>End Call</button>
      )}

      {callActive && (
        <div style={{ marginTop: 20 }}>
          {currentQuestion && <p><strong>AI:</strong> {currentQuestion}</p>}

          <textarea
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />

          <button onClick={handleAnswerSubmit} disabled={!userAnswer.trim()}>
            Submit Answer
          </button>

          <div style={{ marginTop: 20 }}>
            <h3>Your Answers:</h3>
            <ul>
              {answers.map((ans, i) => (
                <li key={i}><strong>Q{i + 1}:</strong> {ans}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;