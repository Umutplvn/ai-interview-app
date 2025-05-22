import React from 'react'
import { collection, addDoc } from "firebase/firestore";
import '../styles/InterviewModal.css'
import loading from '../assets/Infinity@1x-1.0s-200px-200px.svg'
import { db } from '../firebase/firebaseConfig'
import { serverTimestamp } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Review {
  score: number;
  strongSides: string[];
  weaknesses: string[];
}

interface ApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  modelVersion: string;
  usageMetadata: any;
}

interface InterviewModalProps {
  showModal: boolean;
  onClose: () => void;
  review?: Review | string | ApiResponse;
}

const isApiResponse = (obj: any): obj is ApiResponse => {
  return obj && typeof obj === "object" && "candidates" in obj;
}

const InterviewModal: React.FC<InterviewModalProps> = ({ showModal, onClose, review }) => {
  const navigate=useNavigate()

  if (!showModal) return null;

  let parsedReview: Review | null = null;

  if (!review) {
    parsedReview = null;
  } else if (typeof review === "string") {
    const cleaned = review.replace(/```json|```/g, "").trim();
    try {
      parsedReview = JSON.parse(cleaned);
    } catch {
      parsedReview = null;
    }
  } else if (isApiResponse(review)) {
    try {
      const rawText = review.candidates[0]?.content?.parts[0]?.text || "";
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsedReview = JSON.parse(cleaned);
    } catch {
      parsedReview = null;
    }
  } else if (typeof review === 'object' && 'score' in review) {
    parsedReview = review as Review;
  } else {
    parsedReview = null;
  }


  const addData = async () => {
    if (!parsedReview) return;
    try {
      const docRef = await addDoc(collection(db, "interviewData"), { ...parsedReview, createdAt: serverTimestamp() });
      toast.success("Result added to profile!");
      navigate('/main')
    } catch (e) {
      toast.error("Failed to save interview data.");
    }
  }


  return (
    <section className='section'>
      <div className="card green">
        <div className="card-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="close"
            onClick={onClose}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="card-body">
          {parsedReview ? (
            <>
              <div>
                <h3>Interview Summary</h3>
                <hr style={{ border: "1px solid #b7b7b7" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxHeight: "20rem", overflowY: "auto", paddingBottom: "3rem" }}>
                  <h4 style={{ color: "white", marginBottom: "0.25rem", paddingTop: "1rem" }}>Score</h4>
                  <p style={{ color: "white", marginTop: 0 }}>{parsedReview.score ?? "-"}/100</p>

                  <h4 style={{ color: "white", marginBottom: "0.25rem", marginTop: "1rem" }}>Strong Sides</h4>
                  <p style={{ color: "white", marginTop: 0 }}>
                    {parsedReview.strongSides && parsedReview.strongSides.length > 0
                      ? parsedReview.strongSides.join(", ")
                      : "-"}
                  </p>

                  <h4 style={{ color: "white", marginBottom: "0.25rem", marginTop: "1rem" }}>Weak Sides</h4>
                  <p style={{ color: "white", marginTop: 0 }}>
                    {parsedReview.weaknesses && parsedReview.weaknesses.length > 0
                      ? parsedReview.weaknesses.join(", ")
                      : "-"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div style={{ width: "100%", height: "100%" }}>

              <img src={loading} style={{ width: "5rem", marginTop: "4rem" }} alt="" />
            </div>
          )}
        </div>

        {parsedReview && (
          <div className="progress" >
            <h4 style={{ color: "white", marginBottom: "1rem" }} >
              Do you want to save the results to your profile?
            </h4>
            <div>
              <a href="#" className="btn-first" onClick={(e) => { e.preventDefault(); onClose() }}>Cancel</a>
              <a href="#" className="btn-second" onClick={(e) => {
                e.preventDefault();
                addData();
                onClose();
              }}>Save</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default InterviewModal;
