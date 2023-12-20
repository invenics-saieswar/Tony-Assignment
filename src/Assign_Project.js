// AdminDashboard.js
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import './AdminDashboard.css';

const Assign_Project = () => {
  const [empList] = useState([
    { id: 1, name: 'Emp 1', role: 'Developer', skills: ['C++'], assignedProjects: [] },
    { id: 2, name: 'Emp 2', role: 'Manager', skills: ['Java'], assignedProjects: [] },
    { id: 3, name: 'Emp 3', role: 'Developer', skills: ['Python'], assignedProjects: [] },
    // Add more employees as needed
    { id: 4, name: 'Emp 4', role: 'Manager', skills: ['JavaScript'], assignedProjects: [] },
    { id: 5, name: 'Emp 5', role: 'Developer', skills: ['React'], assignedProjects: [] },
    { id: 6, name: 'Emp 6', role: 'Manager', skills: ['Node.js'], assignedProjects: [] },
    { id: 7, name: 'Emp 7', role: 'Developer', skills: ['HTML', 'CSS'], assignedProjects: [] },
    { id: 8, name: 'Emp 8', role: 'Manager', skills: ['Python', 'Django'], assignedProjects: [] },
    { id: 9, name: 'Emp 9', role: 'Developer', skills: ['Java', 'Spring'], assignedProjects: [] },
    { id: 10, name: 'Emp 10', role: 'Manager', skills: ['Angular'], assignedProjects: [] },
  ]);
 
  const [projects, setProjects] = useState([
    { id: 101, name: 'Project A', description: 'Description for Project A', department: 'IT', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 102, name: 'Project B', description: 'Description for Project B', department: 'HR', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 103, name: 'Project C', description: 'Description for Project C', department: 'Finance', assignedEmps: [], approvalStatus: 'Pending' },
    // Add more projects as needed
    { id: 104, name: 'Project D', description: 'Description for Project D', department: 'Marketing', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 105, name: 'Project E', description: 'Description for Project E', department: 'Automation', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 106, name: 'Project F', description: 'Description for Project F', department: 'Application Development', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 107, name: 'Project G', description: 'Description for Project G', department: 'IT', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 108, name: 'Project H', description: 'Description for Project H', department: 'HR', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 109, name: 'Project I', description: 'Description for Project I', department: 'Marketing', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 110, name: 'Project J', description: 'Description for Project J', department: 'Automation', assignedEmps: [], approvalStatus: 'Pending' },
  ]);
 
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [showAssignedPopup, setShowAssignedPopup] = useState(false);
  const [ ,setSelectedProjectForApproval] = useState('');
 
  const availableDepartments = ['IT', 'HR', 'Finance','Marketing','Automation','Application Development'];
  const availableSkills = ['C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Django', 'Spring', 'Angular'];
  const employeesWithSkill = empList.filter((emp) => emp.skills.includes(selectedSkill));

  const navigate = useNavigate();
 
  const assignProject = () => {
   
    const updatedProjects = projects.map((project) => {
      if (project.name === selectedProject) {
        return {
          ...project,
          assignedEmps: employeesWithSkill.map((emp) => ({
            empId: emp.id,
            empDept: selectedDepartment,
            approvalStatus: 'Pending',
            skill: selectedSkill,
          })),
          approvalStatus: 'Pending', // Set project approval status
        };
      }
  
      return project;
    });

    setProjects(updatedProjects);
    setShowAssignedPopup(true);
    //---------------------------------------------------------------------------------------
    async function sendEmailNotification() {
      try {
        const response = await fetch('http://localhost:3001/sendProjectAssign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName: selectedProject,
            Department: selectedDepartment,
            Skill: selectedSkill,
            EmpName: empList.find((emp) => emp.id === parseInt(selectedEmp))?.name || '',
            Approval: 'Pending',
            email: 'karthi.blogger.avatar@gmail.com',
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
    //-----------------------------------------------------------------------------------------

    setTimeout(() => {
      setShowAssignedPopup(false);
      // Redirect to ProjectApproval page after assigning

      setSelectedProjectForApproval(selectedProject);
      navigate('/project-approval', { state: { selectedProjectForApproval: selectedProject } });
    }, 800);
  };
 
  return (
    <Container>
     
      <Typography variant="h3" component="h1" sx={{ my: 4 }}>
        <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
          Admin Dashboard
        </Link>
      </Typography>
      <div className="admin-dashboard">
        <h1 className="dashboard-title">
          <Link to="/admin">Admin Dashboard</Link>
        </h1>
        <label className="project-name-label">
          Project Name:
          <select
            className="project-name-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className="department-label">
          Department:
          <select
            className="department-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {availableDepartments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className="skill-label">
        Skill:
        <select
          className="skill-select"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">Select Skill</option>
          {availableSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label className="emp-label">
        Emp:
        <select
          className="emp-select"
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          {employeesWithSkill.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </label>
      <br />
        <button className="assign-button" onClick={assignProject}>
          Assign Project
        </button>
        {showAssignedPopup && (
          <div className="popup assigned-popup">
            <p>{`Assigned ${selectedProject} to selected employees successfully!`}</p>
          </div>
        )}
      </div>
    
    </Container>
  );
};

export default Assign_Project;