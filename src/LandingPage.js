import React, { useState } from "react";
import Header from "./Header";
import Options from './Options';
import Footer from './Footer';
import './LandingPage.css';
import Adding_Employee from "./Adding_Employee";
import View_Employee from "./View_Employee";
import Project from "./Project";
import Assign_Project from "./Assign_Project";
// import Skill_Mapping from "./Skill_Mapping";
import { NotificationProvider } from './NotificationContext';
import About from './About';
import Contact from "./Contact";
import DeptAdd from "./deptAdd";
import DeptManagement from "./deptView";
import Project_Approval from "./Project_Approval";
 
const LandingPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAbout, setShowAbout] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showProject, setShowProject] = useState(false);
 
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowAbout(false);
        setShowContact(false);
        setShowProject(false);
    };
 
    const handleAboutClick = () => {
        setSelectedOption(null);
        setShowAbout(true);
        setShowContact(false);
        setShowProject(false);
    };
 
    const handleContactClick = () => {
        setSelectedOption(null);
        setShowAbout(false);
        setShowContact(true);
        setShowProject(false);
    };
 
    const handleProjectClick = () => {
        setSelectedOption(null);
        setShowAbout(false);
        setShowContact(false);
        setShowProject(true);
    };
 
    return (
        <NotificationProvider>
            <div className="Main">
                <div className="header-div">
                    <Header handleAboutClick={handleAboutClick} handleContactClick={handleContactClick} />
                </div>
                <div className="main-div">
                    <div className='left-div'>
                        <Options onSelect={handleOptionClick} />
                    </div>
                    <div className='right-div'>
                        {showAbout && <About />}
                        {showContact && <Contact />}
                        {/* {selectedOption === 'Employee/Skill Mapping' && <Skill_Mapping />} */}
                        {selectedOption === 'Admin/Employee/Adding Employee' && <Adding_Employee />}
                        {selectedOption === 'Admin/Employee/View Employee' && <View_Employee />}
                        {selectedOption === 'Admin/Project/Project' && <Project />}
                        {selectedOption === 'Admin/Project/Assign Project' && <Assign_Project handleProjectClick={handleProjectClick}/>}
                        {selectedOption === 'Admin/Dept/Dept View' && <DeptAdd />}
                        {selectedOption === 'Admin/Dept/Edit Dep' && <DeptManagement />}
                        {showProject && <Project_Approval />}
                    </div>
                </div>
                <div className="footer-div">
                    <Footer />
                </div>
            </div>
        </NotificationProvider>
    )
}
 
export default LandingPage;
 