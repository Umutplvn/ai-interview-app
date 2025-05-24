import React, { useState } from 'react';
import interviewA from '../assets/ai.jpg';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { AnimatePresence, motion } from 'framer-motion';
import "../styles/Main.css";
import iconUpload from "../assets/upload.svg";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc, getDocs } from "firebase/firestore";


GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

interface Ingredient {
  icon: string;
  label: string;
}

const tabs: Ingredient[] = [
  { icon: "📝", label: "TextBox" },
  { icon: "📄", label: "Upload Document" },
];

const Main: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Ingredient>(tabs[0]);
  const [data, setData] = useState({ description: "", resume: "", fileName: "" });
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem("InterviewData", JSON.stringify(data));
    navigate('/interview');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    setData(prev => ({ ...prev, fileName: file.name }));
    if (extension === 'pdf') {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await getDocument({ data: typedArray }).promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setData(prev => ({ ...prev, resume: text }));
      };
      fileReader.readAsArrayBuffer(file);
    } else if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setData(prev => ({ ...prev, resume: result.value }));
    } else {
      toast.error('Unsupported file type');
      setData(prev => ({ ...prev, fileName: "" }));
    }
  };



  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: '100vw', height: "100vh", overflow: 'scroll' }}>
      <div className="image-container">
        <img src={interviewA} className="image" alt="Interview Assistant" />
      </div>

      <div className="container">
        <nav className="nav">
          <ul className="tabs-container">
            {tabs.map((item) => (
              <motion.li
                key={item.label}
                initial={false}
                animate={{ backgroundColor: item === selectedTab ? "#eee" : "#eee0" }}
                className="tab"
                onClick={() => setSelectedTab(item)}
              >
                <span className={`tab-text ${item === selectedTab ? 'selected' : ''}`}>
                  {item.icon} {item.label}
                </span>
                {item === selectedTab && (
                  <motion.div className="underline" layoutId="underline" />
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        <main className="icon-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="icon"
            >
              {selectedTab.label === "TextBox" ? (
                <div style={{ height: "18rem", borderRadius: "1rem", overflow: "scroll", width: "100%" }}>
                  <textarea
                    required
                    className="textarea"
                    value={data.description}
                    placeholder="Add Job Description"
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <label className="file-label">
                    <img src={iconUpload} style={{ width: "8rem", cursor: "pointer" }} alt="Upload" className="upload-icon" />
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                  </label>
                  {data.fileName && (
                    <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#333", textAlign: "center" }}>
                      {data.fileName}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <button
        className="btn-main"
        style={{ marginTop: "2rem", opacity: data.description && data.resume ? 1 : 0.5 }}
        disabled={!(data.description && data.resume)}
        onClick={handleContinue}
      >
        <span style={{ backgroundColor: "transparent" }}>Continue</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 74 74"
          height="34"
          width="34"
        >
          <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37" />
          <path
            fill="black"
            d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
          />
        </svg>
      </button>


    </div>
  );
};

export default Main;
