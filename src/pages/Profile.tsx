import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-hot-toast';
import '../styles/Profile.css'; 

interface InterviewData {
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
          data.push(doc.data() as InterviewData);
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
      {interviews.length === 0 && <p>No interview data found.</p>}
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
            <p><strong>Score:</strong> {selectedInterview.score}</p>
            <p><strong>Strengths:</strong> {selectedInterview.strongSides.join(' ')}</p>
            <p><strong>Weaknesses:</strong> {selectedInterview.weaknesses.join(' ')}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
