import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../assets/10041622.png';
import BlurText from "../components/BlurText";
import ShinyText from '../components/ShinyText';
import DecryptedText from '../components/DecryptedText';
import '../styles/homeStyle.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleNavigate = () => {
    navigate('/login');
  };

  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 300); 
  }, []);

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
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            transition: 'all 1s ease-out',
            filter: imageLoaded ? 'brightness(1)' : 'brightness(0.1)', 
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

      <div style={{ marginBottom: '2rem', height: '25rem', padding: '2rem 1rem' }}>
        <DecryptedText
          text="Upload your resume here to begin the online interview process. This platform provides an efficient way for you to present your qualifications and expertise, enabling you to engage directly with potential employers in a professional setting."
          speed={80}
          maxIterations={20}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
        />
      </div>

      <div style={{ position: 'relative', bottom: '5rem' }}>
        <button
          className="btn"
          style={{
            backgroundColor: 'black',
            borderRadius: '1rem',
            cursor: 'pointer',
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
