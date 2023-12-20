import React from 'react';
import LandingPage from './LandingPage';
import About from './About';
import Contact from './Contact';
import {  Route, Routes } from 'react-router-dom';
import Project_Approval from './Project_Approval';
import './App.css'


function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project-approval" element={<Project_Approval />} />
      </Routes>
  );
}

export default App;