import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-hot-toast';
import '../styles/Profile.css';
import { deleteDoc, doc } from "firebase/firestore";

interface InterviewData {
  id: string; 
  score: number;
  strongSides: string[];
  weaknesses: string[];
  jobTitle: string;
  company?: string;
  createdAt?: any;
}

const Profile: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<InterviewData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const q = query(collection(db, "interviewData"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: InterviewData[] = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...(doc.data() as Omit<InterviewData, "id">),
          });
        });
        setInterviews(data);
      } catch (error) {
        toast.error("Failed to load interview data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterviews();
  }, []);
  

  const handleDelete = async (interviewId: string) => {
    try {
      await deleteDoc(doc(db, "interviewData", interviewId));
      toast.success("Interview deleted!");
      closeModal();
      setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
    } catch (error) {
      toast.error("Failed to delete the interview.");
      console.error("Deletion error:", error);
    }
  };
  

  const openModal = (interview: InterviewData) => {
    setSelectedInterview(interview);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedInterview(null);
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Interview Results</h2>
      {interviews.length === 0 && 
      <div>
        <br /> <br /> <br />
        <p style={{textAlign:"center", fontSize:'1.3rem'}}>No interview data found.</p>
      </div>
      
      }
      {interviews.map((interview, idx) => (
        <div
          onClick={() => openModal(interview)}
          key={idx}
          className="profile-interviewItem"
        >
          <h4>{interview.jobTitle}</h4> {interview.company ? `- ${interview.company}` : ''}
          <h4> Score: {interview.score}</h4>
        </div>
      ))}

      {showModal && selectedInterview && (
        <div className="profile-modalBackdrop">
          <div className="profile-modalContent">
            <h3>{selectedInterview.jobTitle} {selectedInterview.company ? `- ${selectedInterview.company}` : ''}</h3>
            <p>
              <strong>Score:</strong><br />
              {selectedInterview.score !== undefined ? `${selectedInterview.score}/100` : "-"}
            </p>

            <p>
              <strong>Strengths:</strong><br />
              {selectedInterview.strongSides && selectedInterview.strongSides.length > 0
                ? selectedInterview.strongSides.join(' ')
                : "-"}
            </p>

            <p>
              <strong>Weaknesses:</strong><br />
              {selectedInterview.weaknesses && selectedInterview.weaknesses.length > 0
                ? selectedInterview.weaknesses.join(' ')
                : "-"}
            </p>

            <div style={{ width: '100%', display: 'flex', justifyContent: "center", gap:'1rem', marginTop:'2rem' }}>

              <button  onClick={closeModal} className="btn-close">Close</button>
              <button onClick={() => handleDelete(selectedInterview.id)} className="btn-delete">Delete</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
