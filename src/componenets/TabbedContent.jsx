

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FuzzyText from "./FuzzyText"; // Ensure this path is correct

export default function TabbedContent() {
  const [activeTab, setActiveTab] = useState("deep-learning");

  const tabContent = {
    "deep-learning": (
      <p className="text-white text-center p-8 text-lg font-mono leading-relaxed">
        Deep learning models, a powerful subset of artificial intelligence, have become essential tools for medical image analysis. They can be trained on vast datasets of medical images—such as X-rays, CT scans, and MRIs—to recognize complex patterns often too subtle for the human eye. A <span className="text-yellow-300">Convolutional Neural Network (CNN)</span>, in particular, is a type of deep learning model that excels at processing visual data by using a series of layers to extract features from an image. 
        <br />
        <br />
        <br />
        For bone cancer, a CNN can learn to identify subtle bone lesions, density changes, or irregular borders that may indicate a tumor, enabling earlier and more accurate diagnosis. This automated analysis significantly reduces the time it takes for a radiologist to review each scan, helping to prioritize urgent cases.
      </p>
    ),
    "pacs": (
      <p className="text-white text-center p-8 text-lg font-mono leading-relaxed">
        A <span className="text-yellow-300">Picture Archiving and Communication System (PACS)</span> is the digital backbone of modern medical imaging. It's a comprehensive technology that allows for the secure and efficient storage, retrieval, and distribution of medical images and reports. Before PACS, hospitals relied on physical film, which was cumbersome to store, prone to damage or loss, and difficult to share between different departments or hospitals. PACS revolutionized this process by digitizing images using a standard format called <span className="text-yellow-300">DICOM (Digital Imaging and Communications in Medicine)</span>. 
        <br />
        <br />
        <br />
        This system provides a central, digital "library" that allows doctors to instantly access a patient's entire imaging history from any authorized workstation, eliminating the need for manual film handling and delivery.
      </p>
    ),
    "synergy": (
      <p className="text-white text-center p-8 text-lg font-mono leading-relaxed">
        The real power comes from the <span className="text-yellow-300">synergy between AI and PACS</span>. While PACS provides the essential digital infrastructure for managing and sharing images, AI provides the analytical intelligence to interpret them. Think of it this way: PACS is the <span className="text-yellow-300">storage and delivery system</span>, and AI is the <span className="text-yellow-300">expert analyst</span>. 
        <br />
        <br />
        <br />
        When AI algorithms are integrated into a PACS workflow, they can automatically triage studies by flagging critical findings, such as a potential tumor, and moving them to the top of a radiologist's worklist. This seamless integration enhances diagnostic accuracy, reduces the workload on radiologists by automating routine tasks, and most importantly, accelerates the time to diagnosis and treatment.
      </p>
    ),
  };

  const tabs = [
    { id: "deep-learning", label: "Deep Learning" },
    { id: "pacs", label: "PACS" },
    { id: "synergy", label: "Synergy" },
  ];

  return (
    <div className="flex flex-col w-[95%] items-center justify-center h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-800 mt-12">
      <div className="flex flex-row w-full h-[20%]">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              w-1/3 flex items-center justify-center leading-relaxed
              text-lg font-semibold cursor-pointer
              transition-all duration-300 ease-in-out 
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white border-b-4 border-yellow-500' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-700'
              }
            `}
            onClick={() => setActiveTab(tab.id)}
          >

            <div className="mx-auto font-michroma text-3xl">

              {tab.label}

            </div>

          </div>
        ))}
      </div>

      <div className="w-full h-[80%] bg-gray-900 rounded-b-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}