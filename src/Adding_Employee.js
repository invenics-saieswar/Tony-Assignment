//-----------------------------------
import React, { useState } from 'react';
import './Adding_Employee.css';

function EmpAdd() {
  const [employeeData, setEmployeeData] = useState({
    id: '',
    name: '',
    role: '',
    department: '',
  });

  const [showSuccessMessages, setShowSuccessMessages] = useState(false);
  const [nameError, setNameError] = useState('');
  const [idError, setIdError] = useState('');
  const [formError, setFormError] = useState('');

   // State for managing success and error messages
   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
   const [showErrorMessage, setShowErrorMessage] = useState(false);
  

  const roles = ['Director', 'Manager', 'Analyst'];
  const departments = ['Automation', 'SAP', 'App Dev', 'Product'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validation for the name field
    if (name === 'name') {
      const nameRegex = /^[a-zA-Z ]*$/;
      if (!nameRegex.test(value)) {
        setNameError('Name should only contain letters and spaces');
      } else {
        setNameError('');
      }
    }

    // Validation for the id field
    if (name === 'id') {
      const idRegex = /^[0-9]+$/;
      if (!idRegex.test(value)) {
        setIdError('ID should only contain numbers');
      } else {
        setIdError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeData.id || !employeeData.name || !employeeData.role || !employeeData.department) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (nameError || idError) {
      setFormError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/sendaddEmp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employeeData.name,
          id: employeeData.id,
          role: employeeData.role,
          department: employeeData.department,
          email: 'karthi.blogger.avatar@gmail.com',
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully!');
        showSuccess();
        // Display success message  inside try
       // addNotification(`Employee added: ${employeeData.name}. Mail sent successfully!`, 'success');
      } else {
        console.error('Failed to send email.');
       // addNotification('Failed to send mail', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
     // addNotification('Failed to send mail', 'error');
     showError();
     // Display error message inside catch
    }

    setShowSuccessMessages(true);

    setEmployeeData({
      id: '',
      name: '',
      role: '',
      department: '',
    });

    setNameError('');
    setIdError('');
    setFormError('');
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

  return (
    <div className="emp-add-container">
      <h2 className="emp-add-title">Add Employee Details</h2>
      <form onSubmit={handleSubmit} className="emp-add-form">
        {/* Existing form elements and JSX */}
        {formError && <p className="error-message">{formError}</p>}
        <div className="emp-add-input-group">
          <label className="emp-add-label">Employee ID:</label>
          <input
            type="text"
            name="id"
            value={employeeData.id}
            onChange={handleChange}
            className={`emp-add-input emp-add-input-id ${idError && 'error'}`}
            required
          />
          {idError && <p className="error-message">{idError}</p>}
        </div>
        <div className="emp-add-input-group">
          <label className="emp-add-label">Name:</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
            className={`emp-add-input emp-add-input-name ${nameError && 'error'}`}
            required
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>
        <div className="emp-add-input-group">
          <label className="emp-add-label">Role:</label>
          <select
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            className="emp-add-input emp-add-input-role"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="emp-add-input-group">
          <label className="emp-add-label">Department:</label>
          <select
            name="department"
            value={employeeData.department}
            onChange={handleChange}
            className="emp-add-input emp-add-input-department"
            required
          >
            <option value="">Select Department</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
 
        <br />

        <button type="submit" className="emp-add-button-submit">
          Add Employee
        </button>
      </form>
      {/* Success and error messages */}
      {showSuccessMessages && (
        <div className="emp-add-success-message">Employee details added successfully!</div>
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
}

export default EmpAdd;

