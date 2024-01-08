import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Project_Approval.css';
 
const Project_Approval = ({ projects }) => {
  const [selectedProjectForApproval, setSelectedProjectForApproval] = useState('');
  const [approvedMessage, setApprovedMessage] = useState('');
 
  const handleApprove = (projectName) => {
    // Set the approved message
    //-----------------------------------------------------------------------
    async function sendEmailNotification() {
      try {
        const response = await fetch('http://localhost:3001/sendProjectApproval', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedProjectApproval:selectedProjectForApproval,
            email: 'karthi.blogger.avatar@gmail.com', // Replace 'recipient@example.com' with the recipient's email
          }),
        });

        if (response.ok) {
          console.log('Email sent successfully!');
        } else {
          console.error('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    sendEmailNotification();
    //-----------------------------------------------------------------------
    setApprovedMessage(` ${projectName} approved!`);
  };
 
  // Retrieve selected project for approval from location state
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.selectedProjectForApproval) {
      setSelectedProjectForApproval(location.state.selectedProjectForApproval);
    }
  }, [location.state]);
 
  return (
    <div>
      <h1>Project Approval</h1>
      <p>Selected Project for Approval: {selectedProjectForApproval}</p>
 
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-info">
            <p>{`${project.name} - ${project.approvalStatus}`}</p>
            {project.assignedEmps.map((emp) => (
              <div key={emp.empId}>
                <p>{`Emp ${emp.empId} - Dept: ${emp.empDept} - Approval: ${emp.approvalStatus || 'Pending'}`}</p>
              </div>
            ))}
            {project.approvalStatus === 'Pending' && (
              <div key={project.id}>
                {/* Pass the project name to handleApprove */}
                <button onClick={() => handleApprove(project.name)}>Approve</button>
              </div>
            )}
          </div>
        ))
      ) : (
        // Display an "Approve" button even when there are no projects
        <div>
          {/* Pass null or an appropriate default value if there is no selected project */}
          <button onClick={() => handleApprove(selectedProjectForApproval || 'DefaultProject')}>Approve</button>
        </div>
      )}
 
      {/* Display the approved message */}
      {approvedMessage && <p>{approvedMessage}</p>}
    </div>
  );
};
 
export default Project_Approval;
 