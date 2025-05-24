import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-hot-toast';
import '../styles/Profile.css';
import { deleteDoc, doc } from "firebase/firestore";
import Gauge from '../components/Gauge';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';

interface InterviewData {
  id: string;
  score: number;
  strongSides: string[];
  weaknesses: string[];
  position: string;
  company?: string;
  createdAt?: any;
}

const Profile: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<InterviewData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchInterviews = async () => {

      console.log(userId);
      try {
        const q = query(
          collection(db, "interviewData"),
          where("userId", "==", userId),
          where("createdAt", "!=", null), 
          orderBy("createdAt", "desc")
        );
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

  const handleAccountDelete = () => {
    setShowDeleteModal(false);

    toast.success("Account deleted!"); 
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
    <div style={{width:"100%", height:"100%", display:"flex",  flexDirection:"column", alignItems:'center'}}>
    <div className="profile-container">
      <h2>Interview Results</h2>
      <hr style={{ border: "1px solid #b7b7b7" }} />

      {interviews.length === 0 &&
        <div>
          <br /> <br /> <br />
          <p style={{ textAlign: "center", fontSize: '1.3rem' }}>No interview data found.</p>
        </div>

      }
      {interviews?.map((interview, idx) => (
        <div
          onClick={() => openModal(interview)}
          key={interview.id}
          className="profile-interviewItem"
        >
          <h4 style={{ width: "75%" }}> {interview.position.length > 20
            ? interview.position.slice(0, 30) + "..."
            : interview.position}</h4>

          <Gauge value={interview.score} max={100} size={70} />

        </div>
      ))}

      {showModal && selectedInterview && (
        <div className="profile-modalBackdrop">
          <div className="profile-modalContent">
            <h3>{selectedInterview.position} {selectedInterview.company ? `- ${selectedInterview.company}` : ''}</h3>
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

            <p style={{ fontSize: "0.8rem", textAlign: "end", color: '#dedede' }}>
              {selectedInterview?.createdAt
                ? selectedInterview.createdAt.toDate
                  ? selectedInterview.createdAt.toDate().toLocaleDateString()
                  : new Date(selectedInterview.createdAt).toLocaleDateString()
                : "-"}
            </p>
            <div style={{ width: '100%', display: 'flex', justifyContent: "center", gap: '1rem', marginTop: '2rem' }}>

              <button onClick={closeModal} className="btn-close">Close</button>
              <button onClick={() => handleDelete(selectedInterview.id)} className="btn-delete">Delete</button>

            </div>
          </div>
        </div>
      )}
      
    </div>

    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'white', fontSize: '1rem' }}>
        Click{" "}
        <span
          style={{ color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          onClick={() => setShowDeleteModal(true)}
        >
          here
        </span>{" "}
        to delete your account
      </p>

      {/* Hesap silme onay modalı */}
      {showDeleteModal && (
        <div className="profile-modalBackdrop-delete">
          <div className="profile-modalContent" >
            <h4 style={{color:'white', textAlign:'center'}}>Do you really want to delete your account?</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn-close">Cancel</button>
              <button onClick={handleAccountDelete} className="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
