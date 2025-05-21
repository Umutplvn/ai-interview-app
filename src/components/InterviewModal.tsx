import React from 'react'
import '../styles/InterviewModal.css'
import loading from '../assets/Infinity@1x-1.0s-200px-200px.svg'

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>

              <div>
                <h3>Interview Summary</h3>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxHeight: "20rem", overflowY: "auto" }}>
                  <h4 style={{ color: "white", marginBottom: "0.25rem" }}>Score</h4>
                  <p style={{ color: "white", marginTop: 0 }}>{parsedReview.score ?? "-"}</p>

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
            <div style={{width:"100%", height:"100%"}}>

                <img src={loading} style={{width:"5rem", marginTop:"4rem"}} alt="" />
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
              <a href="#" className="btn-second">Save</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default InterviewModal;
