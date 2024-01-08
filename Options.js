import React, { useState } from "react";
import "./Options.css";

const Options = ({ onSelect }) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
  const [showAdminEmployeeOptions, setShowAdminEmployeeOptions] = useState(false);
  const [showAdminProjectOptions, setShowAdminProjectOptions] = useState(false);
  const [showAdminDepartmentOptions, setShowAdminDepartmentOptions] = useState(false);

  const handleOptionClick = (option) => {
    onSelect(option); // option is selected
  };

  // This is for Admin main click
  const handleAdminClick = () => {
    setShowAdminOptions(!showAdminOptions);
    setShowEmployeeOptions(false); // Close Employee options when Admin is clicked
  };

  // This is for Employee main click
  const handleEmployeeClick = () => {
    setShowEmployeeOptions(!showEmployeeOptions);
    setShowAdminOptions(false); // Close Admin options when Employee is clicked
  };

  // This is for admin employee click
  const handleAdminEmployeeClick = () => {
    setShowAdminEmployeeOptions(!showAdminEmployeeOptions);
    setShowAdminProjectOptions(false); // Close Admin Project options when Admin Employee is clicked
    setShowAdminDepartmentOptions(false); // Close Admin Department Options when Admin Employee is clicked
  };

  // This is for Admin Project click
  const handleAdminProjectClick = () => {
    setShowAdminProjectOptions(!showAdminProjectOptions);
    setShowAdminEmployeeOptions(false); // Close Admin Employee  options when Admin Project is clicked
    setShowAdminDepartmentOptions(false); // close Admin Department options when admin project is clicked
  };

  const handleAdminDepartmentClick = () => {
    setShowAdminDepartmentOptions(!showAdminDepartmentOptions);
    setShowAdminEmployeeOptions(false); // Close Admin Employee options when Employee is clicked
    setShowAdminProjectOptions(false); // close Admin Project options when Admin Department is clicked
  };

  return (
    // This is main div for options
    <div className="options-div">
      <h3>Dashboard</h3>

      {/*  This is for Employee div*/}
      <div className="option-container">
        <a href="#" onClick={handleEmployeeClick}>
          Employee
        </a>
        {/* This is for Employee options div*/}
        {showEmployeeOptions && (
          <div className="employee-options">
            <a href="#" onClick={() => handleOptionClick("Employee/Skill Mapping")}>
              Skill Mapping
            </a>
          </div>
        )}
      </div>
          <hr />
      {/* This is for Admin main div*/}
      <div className="option-container">
        <a href="#" onClick={handleAdminClick}>
          Admin
        </a>

        {/* This is for Admin options div*/}
        {showAdminOptions && (
          <div className="admin-options">
            <a href="#" onClick={handleAdminEmployeeClick}>
              Employee
            </a>

            {/* This is Admin Employee div*/}
            {showAdminEmployeeOptions && (
              <div className="adminEmployee-options">
                <a href="#" onClick={() => handleOptionClick("Admin/Employee/Adding Employee")}>
                  Adding Employee
                </a>
                <hr />
                <a href="#" onClick={() => handleOptionClick("Admin/Employee/View Employee")}>
                  View Employee
                </a>
              </div>
            )}

            
            <a href="#" onClick={handleAdminProjectClick}>
               Project
            </a>
            {/* This is for Admin Project div*/}
            {showAdminProjectOptions && (
              <div className="adminProject-options">
                <a href="#" onClick={() => handleOptionClick("Admin/Project/Project")}>
                  Project
                </a>
                <hr />
                <a href="#" onClick={() => handleOptionClick("Admin/Project/Assign Project")}>
                  Assign Project
                </a>
              </div>
            )}
            <a href="#" onClick={handleAdminDepartmentClick}>
               Department
            </a>
            {/* This is for Admin Project div*/}
            {showAdminDepartmentOptions && (
              <div className="adminDepartment-options">
                <a href="#" onClick={() => handleOptionClick("Admin/Department/Add Department")}>
                  Add Department
                </a>
                <hr />
                <a href="#" onClick={() => handleOptionClick("Admin/Department/View Department")}>
                  View Department
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Options;
