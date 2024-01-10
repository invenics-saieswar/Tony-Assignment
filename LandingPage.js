import React, { useState } from "react";
import Header from "./Header";
import Options from './Options';
import Footer from './Footer';
import './LandingPage.css'
import Adding_Employee from "./Adding_Employee";
import View_Employee from "./View_Employee";
import Project from "./Project";
import Assign_Project from "./Assign_Project";
import Skill_Mapping from "./Skill_Mapping";
import { NotificationProvider } from './NotificationContext';
import About from './About'; // Import the About component
import Contact from "./Contact"; // Import the Contact component
import Add_Department from "./Add_Department";
import ViewDepartment from "./View_Department";

const LandingPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAbout, setShowAbout] = useState(false);
    const [showContact, setShowContact] = useState(false);


    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowAbout(false); // Reset showAbout state on option click
        setShowContact(false);
    };

    const handleAboutClick = () => {
        setSelectedOption(null); // Reset selectedOption when About is clicked
        setShowAbout(true);
        setShowContact(false);
    };

    const handleContactClick = () => {
      setSelectedOption(null); // Reset selectedOption when About is clicked
      setShowAbout(false);
      setShowContact(true);
  };

    return (
        <NotificationProvider>
            <div className="Main">
                <div className="header-div">
                    <Header handleAboutClick={handleAboutClick} handleContactClick={handleContactClick}/> {/* Pass handleAboutClick function */}
                </div>
                <div className="main-div">
                    <div className='left-div'>
                        <Options onSelect={handleOptionClick} />
                    </div>
                    <div className='right-div'>
                        {/* Conditionally render the About component */}
                        {showAbout && <About />}
                        {showContact && <Contact />}
                        {/* Displaying based on selectedOption */}
                        {selectedOption === 'Employee/Skill Mapping' && <Skill_Mapping />}
                        {selectedOption === 'Admin/Employee/Adding Employee' && <Adding_Employee />}
                        {selectedOption === 'Admin/Employee/View Employee' && <View_Employee />}
                        {selectedOption === 'Admin/Project/Project' && <Project />}
                        {selectedOption === 'Admin/Project/Assign Project' && <Assign_Project />}
                        {selectedOption === 'Admin/Department/Add Department' && <Add_Department/>}
                        {selectedOption === 'Admin/Department/View Department' && <ViewDepartment/>}
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