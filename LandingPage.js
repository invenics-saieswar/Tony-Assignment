import React, {useState} from "react";
import Header from "./Header";
import Options from './Options';
import Footer from './Footer';
import './LandingPage.css'
import Adding_Employee from "./Adding_Employee";
import View_Employee from "./View_Employee";
import Project from "./Project";
import Assign_Project from "./Assign_Project";
import Skill_Mapping from "./Skill_Mapping";
import View_Department from "./View_Department";
import Add_Department from "./Add_Department";
import About from './About';
import Contact from './Contact';



const LandingPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    return (
    <div>
            <div className="Main">
      <div className="header-div"> 
      <Header />
      </div>
      <div className="main-div">
      <div className='left-div'>
        <Options onSelect={handleOptionClick}/>
      </div>
      <div className='right-div' >
        {selectedOption === 'Employee/Skill Mapping' && <Skill_Mapping />}
        {selectedOption === 'Admin/Employee/Adding Employee' && <Adding_Employee />}
        {selectedOption === 'Admin/Employee/View Employee' && <View_Employee />}
        {selectedOption === 'Admin/Project/Project' && <Project />}
        {selectedOption === 'Admin/Project/Assign Project' && <Assign_Project />}
        {selectedOption === 'Admin/Department/Add Department' && <Add_Department  />}
        {selectedOption === 'Admin/Department/View Department' && <View_Department  />}
        {selectedOption === 'About' && <About />}
        {selectedOption === 'Contact' && <Contact />}
      </div>
      </div>
      <div className="footer-div">
        <Footer />
      </div>
    </div>
        </div>
    )
}

export default LandingPage;