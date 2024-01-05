import React, {useState} from "react";
import Header from "./Header";
import Options from './Options';
import Footer from './Footer';
import './LandingPage.css'
import Adding_Employee from "./Adding_Employee";
import View_Employee from "./View_Employee";
import Project from "./Project";
import Assign_Project from "./Assign_Project";




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
    
        {selectedOption === 'Admin/Employee/Adding Employee' && <Adding_Employee />}
        {selectedOption === 'Admin/Employee/View Employee' && <View_Employee />}
        {selectedOption === 'Admin/Project/Project' && <Project />}
        {selectedOption === 'Admin/Project/Assign Project' && <Assign_Project />}
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