// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import './Assign_Project.css';

const Assign_Project = () => {
  const [empList] = useState([
    { id: 1, name: 'Emp 1', role: 'Director', skills: ['C'], assignedProjects: [] },
    { id: 2, name: 'Emp 2', role: 'Manager', skills: ['Java'], assignedProjects: [] },
    { id: 3, name: 'Emp 3', role: 'Analyst', skills: ['Python'], assignedProjects: [] },
    // Add more employees as needed
    { id: 4, name: 'Emp 4', role: 'Manager', skills: ['JavaScript'], assignedProjects: [] },
    { id: 5, name: 'Emp 5', role: 'Director', skills: ['React'], assignedProjects: [] },
    { id: 6, name: 'Emp 6', role: 'Analyst', skills: ['Node', 'UI Path'], assignedProjects: [] },
    { id: 7, name: 'Emp 7', role: 'Director', skills: ['HTML', 'CSS'], assignedProjects: [] },
    { id: 8, name: 'Emp 8', role: 'Manager', skills: ['Python', 'Django'], assignedProjects: [] },
    { id: 9, name: 'Emp 9', role: 'Analyst', skills: ['Java', 'Spring'], assignedProjects: [] },
    { id: 10, name: 'Emp 10', role: 'Manager', skills: ['Angular', 'UI Path'], assignedProjects: [] },
  ]);

  const [projects, setProjects] = useState([
    { id: 101, name: 'Project A', description: 'Description for Project A', department: 'SAP', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 102, name: 'Project B', description: 'Description for Project B', department: 'Product', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 103, name: 'Project C', description: 'Description for Project C', department: 'Automation', assignedEmps: [], approvalStatus: 'Pending' },
    // Add more projects as needed
    { id: 104, name: 'Project D', description: 'Description for Project D', department: 'App Dev', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 105, name: 'Project E', description: 'Description for Project E', department: 'Automation', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 106, name: 'Project F', description: 'Description for Project F', department: 'App Dev', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 107, name: 'Project G', description: 'Description for Project G', department: 'SAP', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 108, name: 'Project H', description: 'Description for Project H', department: 'Product', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 109, name: 'Project I', description: 'Description for Project I', department: 'App Dev', assignedEmps: [], approvalStatus: 'Pending' },
    { id: 110, name: 'Project J', description: 'Description for Project J', department: 'Automation', assignedEmps: [], approvalStatus: 'Pending' },
  ]);

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [showAssignedPopup, setShowAssignedPopup] = useState(false);
  const [, setSelectedProjectForApproval] = useState([]);
  // Add setAvailableSkills to the list of destructured variables
  const [availableSkills, setAvailableSkills] = useState([]);
  // Define the state for available departments
  const [availableDepartments] = useState(['Automation', 'SAP', 'App Dev', 'Product']);

  const employeesWithSkill = empList.filter((emp) => emp.skills.includes(selectedSkill));

  const navigate = useNavigate();

  useEffect(() => {
    // Update available skills based on the selected department
    setAvailableSkills(getSkillsForDepartment(selectedDepartment));
  }, [selectedDepartment]);

  const getSkillsForDepartment = (department) => {
    switch (department) {
      case 'SAP':
        return ['Python', 'JavaScript', 'HTML', 'CSS', 'Django', 'Spring', 'Angular'];
      case 'App Dev':
        return ['C', 'Java', 'Python', 'JavaScript', 'React', 'Node', 'HTML', 'CSS'];
      case 'Automation':
        return ['UI Path', 'Python', 'JavaScript', 'React', 'Node', 'HTML', 'CSS'];
      case 'Product':
        return ['C', 'Java', 'Python', 'JavaScript', 'React', 'Node', 'Django', 'Angular'];
      default:
        return [];
    }
  };
  async function sendProjectAssignment() {
    try {
      const response = await fetch('http://localhost:3004/assignProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: selectedProject,
          department: selectedDepartment,
          skill: selectedSkill,
          empId: selectedEmp,
        }),
      });

      if (response.ok) {
        console.log('Project assigned successfully!');
      } else {
        console.error('Failed to assign project. Server response:', await response.text());
      }
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  }
  const assignProject = () => {
    // Validation for each field
    if (!selectedProject || !selectedDepartment || !selectedSkill || !selectedEmp) {
      alert('Please select all fields before assigning a project.');
      return;
    }

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

    sendProjectAssignment();

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
    setTimeout(() => {
      setShowAssignedPopup(false);
      setSelectedProjectForApproval({
        selectedProject,
        selectedEmployee: empList.find((emp) => emp.id === parseInt(selectedEmp))?.name || '',
        selectedDepartment,
        selectedSkills: selectedSkill,
      });
     
    }, 800);
  };

  const navigateToProjectApproval = () => {
    // Navigate to the Project Approval page when the button is clicked
    navigate('/project-approval', {
      state: {
        selectedProjectForApproval: {
          selectedProject,
          selectedEmployee: empList.find((emp) => emp.id === parseInt(selectedEmp))?.name || '',
          selectedDepartment,
          selectedSkills: selectedSkill,
        },
      },
    });
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" sx={{ my: 4 }}>
        <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
          
        </Link>
      </Typography>
      <div className="admin-dashboard">
        <h1 className="dashboard-title">
          <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}> Assign Project </Link>
        </h1>
        <label className="project-name-label">
          Project Name:
          <select
            className="project-name-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project</option>
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
            <option value="">Select Employee</option>
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


        <button className="assign-button" onClick={navigateToProjectApproval}style={{ marginLeft: '150px' }}>
          Project Approval
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