import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Project_Approval.css';

const ProjectApproval = ({ projects, empList }) => {
  const [selectedProjectForApproval, setSelectedProjectForApproval] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSkills, setSelectedSkills] = useState('');
  const [approvedMessage, setApprovedMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleApprove = (project) => {
    // Display project details for approval
     // Update approval status in the database
     updateApprovalStatus(selectedProjectForApproval);
    console.log('Selected Project for Approval:', project);
  
    // Check if assignedEmps is defined
    if (!project.assignedEmps || project.assignedEmps.length === 0) {
      // Handle the case where assignedEmps is undefined or empty
      console.error('No assigned employees for approval.');
      showError();
      return;
    }
  
    // Log the structure of the project object
    console.log('Project Object:', project);
  
    // Log the assignedEmps array
    console.log('Assigned Employees:', project.assignedEmps);
  
    // Set the approved message
    const approvedDetails = project.assignedEmps.map((emp) => {
      const selectedEmp = empList.find((e) => e.id === emp.empId);
  
      // Log relevant information for debugging
      console.log('Matching Employee:', selectedEmp);
  
      return {
        empId: emp.empId,
        empName: selectedEmp?.name || '',
        empDept: emp.empDept,
        empSkills: selectedEmp?.skills.join(', ') || '',
        approvalStatus: emp.approvalStatus || 'Pending',
      };
    });
  
    // Log approvedDetails for debugging
    console.log('Approved Details:', approvedDetails);
  
    setApprovedMessage({
      projectName: project.name,
      projectDetails: approvedDetails,
    });
  
    // Send email notification
    sendEmailNotification(project.name);
    
   
    
    showSuccess();
  };

  // Function to send email notification
  async function sendEmailNotification(projectName) {
    try {
      const response = await fetch('http://localhost:3001/project-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedProjectApproval: projectName, // Use projectName directly
          email: 'karthi.blogger.avatar@gmail.com', // Replace with the recipient's email address
        }),
      });
  
      const data = await response.json(); // assuming server responds with JSON
      console.log(data); // log the response data
  
      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

// Function to update approval status in the database
async function updateApprovalStatus(projectName) {
  try {
    const response = await fetch('http://localhost:3004/update-approval-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedProjectForApproval: projectName, // pass the project name as a string
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log('Approval status updated successfully!');
    } else {
      console.error('Failed to update approval status.');
    }
  } catch (error) {
    console.error('Error updating approval status:', error);
  }
}



  // Retrieve selected project, employee, department, and skills for approval from location state
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.selectedProjectForApproval) {
      const {
        selectedProject,
        selectedEmployee,
        selectedDepartment,
        selectedSkills,
      } = location.state.selectedProjectForApproval;

      setSelectedProjectForApproval(selectedProject);  // Update this line
      setSelectedEmployee(selectedEmployee);
      setSelectedDepartment(selectedDepartment);
      setSelectedSkills(selectedSkills);
    }
  }, [location.state]);

  // Function to display success message
  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide success message after 3 seconds
  };

  // Function to display error message
  const showError = () => {
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 3000); // Hide error message after 3 seconds
  };

  return (
    <div className="project-approval-container">
      <h1 className="project-approval-title">Project Approval</h1>
      <p className="project-approval-info"><strong>Selected Project for Approval:</strong> {selectedProjectForApproval}</p>
      <p className="project-approval-info"><strong>Selected Employee: </strong>{selectedEmployee}</p>
      <p className="project-approval-info"><strong>Selected Department: </strong>{selectedDepartment}</p>
      <p className="project-approval-info"><strong>Selected Skills:</strong> {selectedSkills}</p>

      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-info">
            <p className="project-name">{`${project.name} - ${project.approvalStatus}`}</p>
            {project.assignedEmps?.map((emp) => (
              <div key={emp.empId} className="assigned-employee-info">
                <p>{`Emp ${emp.empId} - Dept: ${emp.empDept} - Approval: ${emp.approvalStatus || 'Pending'}`}</p>
                <p>{`Selected Skills: ${empList.find((e) => e.id === emp.empId)?.skills.join(', ')}`}</p>
              </div>
            ))}
            {project.approvalStatus === 'Pending' && (
              <div key={project.id}>
                <button className="approve-button" onClick={() => handleApprove(project)}>Approve</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>
          <button className="approve-button" onClick={() => handleApprove({ name: selectedProjectForApproval })}>Approve</button>
        </div>
      )}

      {approvedMessage && (
        <div className="approved-message">
          <p>{`${approvedMessage.projectName} Approved to the Employee Successfully!`}</p>
          {approvedMessage.projectDetails && approvedMessage.projectDetails.length > 0 ? (
            approvedMessage.projectDetails.map((emp) => (
              <div key={emp.empId} className="approved-employee-details">
                <p>{`Emp ${emp.empId} - Name: ${emp.empName} - Dept: ${emp.empDept} - Approval: ${emp.approvalStatus}`}</p>
                <p>{`Selected Skills: ${emp.empSkills}`}</p>
              </div>
            ))
          ) : (
            <p> </p>
          )}
        </div>
      )}
      {showSuccessMessage && (
        <div className="message-popup success">
          <p>Email sent successfully!</p>
        </div>
      )}
      {showErrorMessage && (
        <div className="message-popup error">
          <p>Failed to send email.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectApproval;
