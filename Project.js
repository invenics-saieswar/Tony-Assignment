// Import React and useState hook
import React, { useState, useEffect } from "react";
import './Project.css';
import {useNotification } from './NotificationContext'

// Main Project component
function Project() {
    // Assume this code is part of your React component
    const [oldProjectId, setOldProjectId] = useState('');
    const [allDepartments, setAllDepartments] = useState([]);

       // State for managing success and error messages
       const [showSuccessMessage, setShowSuccessMessage] = useState(false);
       const [showErrorMessage, setShowErrorMessage] = useState(false);
     
       const{addNotification}=useNotification();

    const createProject = async () => {
        const newProjectData = {
            projectName: 'My Project', // Replace these values with actual project data
            projectId: '12345',
            department: 'IT',
            startDate: '2024-01-10',
            endDate: '2024-02-10',
            skillsRequired: ['React', 'Node.js']
        };

        try {
            const response = await fetch('http://localhost:3006/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProjectData)
            });

            if (response.ok) {
                console.log('Project created successfully!');
                // Perform any necessary actions after successful project creation
            } else {
                console.error('Failed to create project');
                // Handle the error scenario
            }
        } catch (error) {
            console.error('Error creating project:', error);
            // Handle any network-related errors
        }
    };

    const retrieveProjects = async () => {
        try {
            const response = await fetch('http://localhost:3006/projects');

            if (response.ok) {
                const projects = await response.json();
                console.log('Retrieved projects:', projects);
                setProjectsList(projects);
                // Use the retrieved projects data in your React component
            } else {
                console.error('Failed to retrieve projects');
                // Handle the error scenario
            }
        } catch (error) {
            console.error('Error retrieving projects:', error);
            // Handle any network-related errors
        }
    };

    // Call these functions as needed in your React component
    // createProject(); // To create a new project
    // retrieveProjects(); // To retrieve all projects
    useEffect(() => {
        // This will run once when the component mounts
        retrieveProjects(); // Retrieve projects when the component mounts

        fetch('http://localhost:3006/deptDropdown') // Fetch all departments
            .then((response) => response.json())
            .then((data) => setAllDepartments(data.result))
            .catch((error) => console.error('Error fetching department data:', error));



    }, []);

    // State variables using useState hook
    const [displayedComponent, setDisplayedComponent] = useState(null);
    const [projectsList, setProjectsList] = useState([]);
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectId: "",
        department: "",
        startDate: "",
        endDate: "",
        skillsRequired: [],
        newSkill: ""
    });
    const [errors, setErrors] = useState({
        projectNameError: "",
        projectIdError: "",
        departmentError: "",
        startDateError: "",
        endDateError: "",
        skillsError: ""
    });
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    // Function to handle checkbox change
    const handleCheckboxChange = (index) => {
        const newSelected = [...selectedProjects];
        if (newSelected.includes(index)) {
            const filtered = newSelected.filter((item) => item !== index);
            setSelectedProjects(filtered);
        } else {
            setSelectedProjects([...newSelected, index]);
        }
    };
    // Function to delete selected projects
    const handleDeleteSelected = async () => {
        const selectedProjectIds = projectsList
            .filter((project, index) => selectedProjects.includes(index))
            .map((selectedProject) => selectedProject.projectId); // Change this to 'projectId'
console.log(selectedProjectIds);
            const projectsData = selectedProjectIds
      .map(project => (
        `
         ProjectID: ${selectedProjectIds}
        `
      ))
      .join("\n");

            try {
                const response = await fetch('http://localhost:3001/sendDeleteProject', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ body: projectsData }),
                 
                });
           
                if (response.ok) {
                 
                  showSuccess();
                } else {
                 
                  showError();
                }
              } catch (error) {
                console.error('Error:', error);
               
                showError();
              }

        try {
            const response = await fetch('http://localhost:3006/deleteProjects', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedProjectIds }) // Send the list of selected project IDs to delete
            });

            if (response.ok) {
                // Assuming the deletion in the backend was successful
                const newList = projectsList.filter((project) => !selectedProjectIds.includes(project.projectId));
                setProjectsList(newList);
                setSelectedProjects([]);
                console.log('Projects deleted from the database successfully!');
                // Perform any necessary actions after successful deletion from the database
            } else {
                console.error('Failed to delete projects from the database');
                // Handle the error scenario for database deletion
            }
        } catch (error) {
            console.error('Error deleting projects from the database:', error);
            // Handle any network-related errors for deletion
        }
    };

    const handleStartEditing = (index) => {
        setEditingIndex(index);
        const projectToEdit = projectsList[index];
        setProjectData({
            ...projectData,
            ...projectToEdit // Update projectData with the project being edited
        });

        // Store the oldProjectId in state
        setOldProjectId(projectToEdit.projectId);
    };


    // Function to save edits when editing a project
    const handleSaveEditing = async (index, newProjectId) => {
        console.log(`Saving edits for project at index ${index}`);
        setEditingIndex(null);

        // Get the updated project
        const updatedProject = projectsList[index];

        // Assuming you have an 'oldProjectId' for the update
        // const oldProjectId = updatedProject.projectId; // Current project ID

        // Convert startDate and endDate to YYYY-MM-DD format
        updatedProject.startDate = updatedProject.startDate.split('T')[0];
        updatedProject.endDate = updatedProject.endDate.split('T')[0];

        const requestBody = {
            projectName: updatedProject.projectName,
            projectId: newProjectId, // Use the new project ID for the update
            department: updatedProject.department,
            startDate: updatedProject.startDate,
            endDate: updatedProject.endDate,
            skillsRequired: updatedProject.skillsRequired // Assuming this is an array of skills
            // Add other properties as needed
        };

        try {
            const editedProjectString = `
            projectName:${updatedProject.projectName},
            projectId: ${newProjectId}, 
            department: ${updatedProject.department},
            startDate: ${updatedProject.startDate},
            endDate: ${updatedProject.endDate},
            skillsRequired: ${updatedProject.skillsRequired}, 
            
          `;
 
          console.log('Edited Project String:', editedProjectString); // Log the edited project object
          const response = await fetch('http://localhost:3001/sendEditProject', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ editedProjectString }), // Send the stringified version
          });
     
          if (response.ok) {
            addNotification('Project Edited successfully. Mail Sent');
            showSuccess();
          } else {
            alert('Project updated successfully! Failed to send email.');
          }
        } catch (error) {
          console.error('Error:', error);
          addNotification('Project Edited successfully. Mail Failed to Sent');
          showError();
        }

        try {
            const response = await fetch(`http://localhost:3006/updateProject/${oldProjectId}/${newProjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody) // Send a properly formatted object

            });

            if (response.ok) {
                retrieveProjects(); // Refresh the projects list after successful update
                console.log('Project updated successfully!');
            } else {
                console.error('Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleEditInputChange = (e, index, fieldName) => {
        const updatedList = projectsList.map((project, i) => {
            if (i === index) {
                if (fieldName === "skillsRequired") {
                    const skills = e.target.value.split(",");
                    return {
                        ...project,
                        [fieldName]: skills.map((skill) => skill.trim())
                    };
                } else {
                    return {
                        ...project,
                        [fieldName]: e.target.value
                    };
                }
            }
            return project;
        });

        setProjectsList(updatedList);

        // Update projectData if the editingIndex matches the index being edited
        if (editingIndex === index) {
            if (fieldName === "skillsRequired") {
                const skills = e.target.value.split(",");
                setProjectData({
                    ...projectData,
                    [fieldName]: skills.map((skill) => skill.trim())
                });
            } else {
                setProjectData({
                    ...projectData,
                    [fieldName]: e.target.value
                });
            }
        }
    };

    // Function to display the Create Project component
    const showCreateProject = () => {
        setDisplayedComponent("CreateProject");
    };

    // Function to display the List of Projects component
    const showListOfProjects = () => {
        setDisplayedComponent("ListOfProjects");
    };

    // Function to handle input changes in projectData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        const selectedDepartment = e.target.value;
        setProjectData({
            ...projectData,
            department: selectedDepartment  // Update the department in projectData state
        });
        setProjectData({
            ...projectData,
            [name]: value
        });
        validateInput(name, value); // Validate the input on each change
    };

    // Function to validate input fields based on their names and values
    const validateInput = (name, value) => {
        switch (name) {
            case "projectName":
                const nameRegex = /^[a-zA-Z\s]+$/;
                if (!value.match(nameRegex)) {
                    setErrors({ ...errors, projectNameError: "Only alphabets are allowed." });
                } else {
                    setErrors({ ...errors, projectNameError: "" });
                }
                break;
            case "projectId":
                const idRegex = /^[0-9]+$/;
                if (!value.match(idRegex)) {
                    setErrors({ ...errors, projectIdError: "Only numbers are allowed." });
                } else {
                    setErrors({ ...errors, projectIdError: "" });
                }
                break;
            case "department":
                const departmentRegex = /^[a-zA-Z\s]+$/;
                if (!value.match(departmentRegex)) {
                    setErrors({ ...errors, departmentError: "Only alphabets are allowed." });
                } else {
                    setErrors({ ...errors, departmentError: "" });
                }
                break;
            case "startDate":
                const today = new Date();
                const selectedStartDate = new Date(value);
                // Subtract one day from the selected start date
                today.setDate(today.getDate() - 1);
                const isValidStartDate = selectedStartDate >= today;

                if (!isValidStartDate) {
                    setErrors({ ...errors, startDateError: "No past date allowed." });
                } else {
                    setErrors({ ...errors, startDateError: "" });
                }
                break;
            case "endDate":
                const selectedEndDate = new Date(value);
                const isValidEndDate = selectedEndDate >= new Date(projectData.startDate);

                if (!isValidEndDate) {
                    setErrors({ ...errors, endDateError: "End date should not be before start date." });
                } else {
                    setErrors({ ...errors, endDateError: "" });
                }
                break;
            case "newSkill":
                const skillRegex = /^[a-zA-Z\s]*$/;
                if (!value.match(skillRegex)) {
                    setErrors({ ...errors, skillsError: "Only alphabets and spaces are allowed." });
                } else {
                    setErrors({ ...errors, skillsError: "" });
                }
                break;
            default:
                break;
        }
    };

    const validateDate = (startDate, endDate) => {
        const today = new Date();
        const selectedStartDate = new Date(startDate);
        const selectedEndDate = new Date(endDate);

        const isStartDateValid = selectedStartDate >= today;
        const isEndDateValid = selectedEndDate >= selectedStartDate;

        return {
            isStartDateValid,
            isEndDateValid
        };
    };
    const sendEmail = async (newProject) => {
        const emailDetails = {
            subject: 'New Project Created',
            body: `Project has been created with the following details:
            Project Name: ${newProject.projectName}
            Project ID: ${newProject.projectId}
            Department: ${newProject.department}
            Start Date: ${newProject.startDate}
            End Date: ${newProject.endDate}
            Skills Required: ${newProject.skillsRequired.join(", ")}`
        };

        try {
            const response = await fetch('http://localhost:3001/sendCreateProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailDetails),
            });

            if (response.ok) {
               // alert('Project created successfully! Email sent.');
               showSuccess();
            } else {
              //  alert('Project created successfully! Failed to send email.');
            }
        } catch (error) {
            console.error('Error:', error);
           // alert('Project created successfully! Failed to send email.');
           showError();
        }
    };

    const handleSkillInputChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value) || value === "") { // Validate for alphabets and spaces or an empty string
            setProjectData({
                ...projectData,
                newSkill: value
            });
            setErrors({ ...errors, skillsError: "" }); // Clear skills error if the input is valid
        } else {
            setErrors({ ...errors, skillsError: "No special characters allowed" });
        }
    };

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

    const handleAddSkill = () => {
        const trimmedSkill = projectData.newSkill.trim();
        const isValidSkill = /^[a-zA-Z\s]*$/.test(trimmedSkill);

        if (trimmedSkill !== "" && isValidSkill) {
            setProjectData({
                ...projectData,
                skillsRequired: [...projectData.skillsRequired, trimmedSkill],
                newSkill: ""
            });
            setErrors({ ...errors, skillsError: "" }); // Clear skills error after successfully adding a valid skill
        } else {
            setErrors({ ...errors, skillsError: "Only alphabets and spaces are allowed" });
        }
    };


    const handleDeleteSkill = (skillToDelete) => () => {
        setProjectData({
            ...projectData,
            skillsRequired: projectData.skillsRequired.filter(
                (skill) => skill !== skillToDelete
            )
        });
    };

    const handleCreateProject = async () => {
        const isValid = validateForm();

        if (isValid) {
            let skillsArray = projectData.skillsRequired;

            if (!Array.isArray(skillsArray)) {
                skillsArray = skillsArray.split(",").map(skill => skill.trim());
            }

            const newProjectData = {
                projectName: projectData.projectName,
                projectId: projectData.projectId,
                department: projectData.department,
                startDate: projectData.startDate,
                endDate: projectData.endDate,
                skillsRequired: skillsArray // Ensure skillsRequired is an array
            };

            try {
                const response = await fetch('http://localhost:3006/createProject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProjectData),
                });

                if (response.ok) {
                    setProjectData({
                        projectName: "",
                        projectId: "",
                        department: "",
                        startDate: "",
                        endDate: "",
                        skillsRequired: [],
                        newSkill: ""
                    });

                    sendEmail(newProjectData);
                   alert("Project created successfully!");
                } else {
                   alert('Failed to create project');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error creating project');
            }
        } else {
           alert('Please check all the fields.');
        }
    };


    const validateForm = () => {
        const {
            projectName,
            projectId,
            department,
            startDate,
            endDate
        } = projectData;

        const isProjectNameValid = projectName.trim() !== "" && !errors.projectNameError;
        const isProjectIdValid = projectId.trim() !== "" && !errors.projectIdError;
        const isDepartmentValid = department.trim() !== "" && !errors.departmentError;
        const isStartDateValid = startDate.trim() !== "" && !errors.startDateError;
        const isEndDateValid = endDate.trim() !== "" && !errors.endDateError;
        const { isStartDateValid: isStartValid, isEndDateValid: isEndValid } = validateDate(startDate, endDate);
        return (
            isProjectNameValid &&
            isProjectIdValid &&
            isDepartmentValid &&
            isStartDateValid &&
            isEndDateValid &&
            isStartValid &&
            isEndValid
        );

    };



    // Function to render the appropriate component based on displayedComponent state
    const renderComponent = () => {
        switch (displayedComponent) {
            case "CreateProject":
                return (
                    <div className="create-project-container">

                        {/* Your code for Create Project component */}
                        {/* ... */}
                        <h1 className="create-project-title">Create Project</h1>
                        <label className="project-name-label">
                            Project Name:
                            <input
                                type="text"
                                name="projectName"
                                value={projectData.projectName}
                                onChange={handleChange} // Ensure 'handleChange' is properly bound and receives the event object
                                className="project-name-input unique-projectName-input"
                            />

                            {errors.projectNameError && <p className="error-message">{errors.projectNameError}</p>}
                        </label>
                        {/* Other input fields */}
                        <label className="project-id-label">
                            Project ID:
                            <input
                                type="text"
                                name="projectId"
                                value={projectData.projectId}
                                onChange={handleChange}
                                className="project-id-input unique-projectId-input"
                            />
                            {errors.projectIdError && <p className="error-message">{errors.projectIdError}</p>}
                        </label>
                        {/* Department, Start Date, End Date inputs */}
                        <label className="department-label">
                            Department:
                            <select
                                name="department"
                                value={projectData.department}
                                onChange={handleChange}
                                className="department-input unique-department-input"
                            >
                                <option value="">Select Department</option>
                                {allDepartments.map((dept) => (
                                    <option key={dept.dept_id} value={dept.dept_name}>
                                        {dept.dept_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {/* ... */}
                        <br />
                        {/* ... */}
                        <label className="start-date-label">
                            Start Date:
                            <input
                                type="date"
                                name="startDate"
                                value={projectData.startDate}
                                onChange={handleChange}
                                className="start-date-input unique-startDate-input"
                            />
                            {errors.startDateError && <p className="error-message">{errors.startDateError}</p>}
                        </label>
                        <br />
                        <label className="end-date-label">
                            End Date:
                            <input
                                type="date"
                                name="endDate"
                                value={projectData.endDate}
                                onChange={handleChange}
                                className="end-date-input unique-endDate-input"
                            />
                            {errors.endDateError && <p className="error-message">{errors.endDateError}</p>}
                        </label>
                        <br />
                        <label className="skills-required-label">
                            Skills Required:
                            <input
                                type="text"
                                value={projectData.newSkill}
                                onChange={handleSkillInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddSkill();
                                    }
                                }}
                                placeholder="Type and press Enter"
                                className="skills-required-input"
                            />

                            {errors.skillsError && <p className="error-message">{errors.skillsError}</p>}
                        </label>
                        {/* ... */}

                        <div className="chips-container">
                            {projectData.skillsRequired.map((skill, index) => (
                                <div key={index} className="chip">
                                    <span>{skill}</span>
                                    <button onClick={handleDeleteSkill(skill)} className="delete-chip-button">x</button>
                                </div>

                            ))}
                        </div>
                        <br />
                        <button onClick={handleCreateProject} className="create-button unique-create-button">Create Project</button>
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
                ); case "ListOfProjects":
                return (
                    <div className="list-of-projects-container">
                        <div className="button-container">
                            <button onClick={handleDeleteSelected} className="delete-selected-button unique-delete-selected-button">Delete Selected</button>
                        </div>
                        <table className="projects-table unique-projects-table">
                            <thead>
                                <tr>
                                    <th></th> {/* Empty header for checkbox */}
                                    <th>Project Name</th>
                                    <th>Project ID</th>
                                    <th>Department</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Skills Required</th>
                                    <th>Action</th> {/* Header for action column */}
                                </tr>
                            </thead>
                            <tbody>
                                {projectsList.map((project, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProjects.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editingIndex === index ? projectData.projectName : ''}
                                                    onChange={(e) => handleEditInputChange(e, index, "projectName")}
                                                />
                                            ) : (
                                                project.projectName
                                            )}
                                        </td>

                                        {/* Editable columns */}
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={project.projectId}
                                                    onChange={(e) => handleEditInputChange(e, index, "projectId")}
                                                />
                                            ) : (
                                                project.projectId
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={project.department}
                                                    onChange={(e) => handleEditInputChange(e, index, "department")}
                                                />
                                            ) : (
                                                project.department
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="date"
                                                    value={project.startDate.split('T')[0]} // Extracting date part only
                                                    onChange={(e) => handleEditInputChange(e, index, "startDate")}
                                                />
                                            ) : (
                                                project.startDate.split('T')[0] // Extracting date part only
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="date"
                                                    value={project.endDate.split('T')[0]} // Extracting date part only
                                                    onChange={(e) => handleEditInputChange(e, index, "endDate")}
                                                />
                                            ) : (
                                                project.endDate.split('T')[0] // Extracting date part only
                                            )}
                                        </td>

                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={projectData.skillsRequired}
                                                    onChange={(e) => handleEditInputChange(e, index, "skillsRequired")}
                                                />
                                            ) : (
                                                project.skillsRequired
                                            )}
                                        </td>

                                        {/* Edit button */}
                                        <td>
                                            {editingIndex === index ? (
                                                <button onClick={() => handleSaveEditing(index, project.projectId)} className="save-project-button unique-save-project-button">Save</button>
                                            ) : (
                                                <button onClick={() => handleStartEditing(index)} className="edit-project-button unique-edit-project-button">Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

            default: return null

        }
    };


    // Return JSX for the Project component
    return (
        <div className="project-wrapper">
            <div className="button-container">
                {/* Buttons to switch between components */}
                <button onClick={showCreateProject} className="create-project-button unique-create-project-button">Create Project</button>
                <button onClick={showListOfProjects} className="list-of-projects-button unique-list-of-projects-button">List of Projects</button>
            </div>
            {/* Component container to render the appropriate component */}


            <div className="component-container"> {renderComponent()}</div>
        </div>
    );
}

export default Project;