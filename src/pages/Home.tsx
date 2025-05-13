import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../assets/10041622.png';
import BlurText from "../components/BlurText";
import ShinyText from '../components/ShinyText';
import '../styles/homeStyle.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
          }}
          aria-label="Profile Image"
        />
        <BlurText
          text="Turn Nerves Into Confidence!"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-2xl mb-8"
        />
      </div>
      
      <div style={{ height: "50%" }}>
        <button
          className="btn"
          style={{
            backgroundColor: "black",
            borderRadius: '1rem',
            cursor: "pointer",
          }}
          onClick={handleNavigate}
          aria-label="Go to Login Page"
        >
          <ShinyText text="Join Us" disabled={false} speed={3} className="custom-class" />
        </button>
      </div>
    </div>
  );
};

export default Home;
