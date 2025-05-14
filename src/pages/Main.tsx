import React, { useState } from 'react';
import interviewA from '../assets/ai.jpg';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { AnimatePresence, motion } from 'framer-motion';
import "../styles/Main.css"
import iconUpload from "../assets/upload.svg"

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface Ingredient {
  icon: string;
  label: string;
}

const tabs: Ingredient[] = [
  { icon: "📝", label: "TextBox" },
  { icon: "📄", label: "Upload Document" },
];

const Main = () => {
  const [selectedTab, setSelectedTab] = useState<Ingredient>(tabs[0]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

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
        console.log('PDF Text:', text);
      };
      fileReader.readAsArrayBuffer(file);
    } else if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      console.log('DOCX Text:', result.value);
    } else {
      console.error('Unsupported file type');
    }
  };

  return (
    <div style={{ display:"flex", alignItems:"center", flexDirection:"column"}}>
      <div className="image-container">
        <img
          src={interviewA}
          className="image"
        />
      </div>

      <div className="container">
        <nav className="nav">
          <ul className="tabs-container">
            {tabs.map((item: Ingredient) => (
              <motion.li
                key={item.label}
                initial={false}
                animate={{
                  backgroundColor: item === selectedTab ? "#eee" : "#eee0",
                }}
                className="tab"
                onClick={() => setSelectedTab(item)}
              >
                <span
                  className={`tab-text ${item === selectedTab ? 'selected' : ''}`}
                >
                  {`${item.icon} ${item.label}`}
                </span>
                {item === selectedTab ? (
                  <motion.div
                    className="underline"
                    layoutId="underline"
                  />
                ) : null}
              </motion.li>
            ))}
          </ul>
        </nav>
        <main className="icon-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="icon"
            >
              {selectedTab ? (
                selectedTab.label === "TextBox" ? (
                  <textarea
                    className="textarea"
                    placeholder="Add Job Description"
                  />
                ) : selectedTab.label === "Upload Document" ? (
                  <label className="file-label">
                  <img src={`${iconUpload}`} alt="Upload" className="upload-icon" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                </label>
                ) : (
                  selectedTab.icon
                )
              ) : (
                "😋"
              )}
            </motion.div>
          </AnimatePresence>
        </main>


      </div>

<button style={{marginTop:"2rem"}}>
  <span style={{backgroundColor:"transparent"}}>Continue</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 74 74"
    height="34"
    width="34"
  >
    <circle stroke-width="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
    <path
      fill="black"
      d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
    ></path>
  </svg>
</button>

    </div>
  );
};

export default Main;
