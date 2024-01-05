import React, { useState } from 'react';
import './deptAdd.css';

function DeptAdd() {
  const [departmentData, setDepartmentData] = useState({
    id: '',
    name: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [idError, setIdError] = useState('');
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // Check if any required fields are empty
    if (!departmentData.id || !departmentData.name) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Check if there are validation errors
    if (idError || nameError) {
      setFormError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      // Make a POST request to your Node.js server
      const response = await fetch('http://localhost:3001/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      if (response.ok) {
        console.log('Department Data Submitted:', departmentData);
        setShowSuccessMessage(true);

        // Reset form fields and errors
        setDepartmentData({
          id: '',
          name: '',
        });

        setIdError('');
        setNameError('');
        setFormError('');
      } else {
        // Handle server error
        console.error('Error submitting department data:', response.statusText);
        setFormError('Error submitting department data. Please try again later.');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      setFormError('Network error. Please try again later.');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validation for the ID field
    if (name === 'id') {
      const idRegex = /^[0-9]+$/; // Allow only numbers
      if (!idRegex.test(value)) {
        setIdError('ID should only contain numbers');
      } else {
        setIdError('');
      }
    }

    // Validation for the name field
    if (name === 'name') {
      const nameRegex = /^[a-zA-Z ]*$/; // Allow only letters and spaces
      if (!nameRegex.test(value)) {
        setNameError('Invalid');
      } else {
        setNameError('');
      }
    }
  }

  return (
    <div className="dept-add-container">
      <h2 className="dept-add-title">Add Department Details</h2>
      <form onSubmit={handleSubmit} className="dept-add-form">
        {formError && <p className="error-message">{formError}</p>}
        <div className="dept-add-input-group">
          <label className="dept-add-label">Department ID:</label>
          <input
            type="text"
            name="id"
            value={departmentData.id}
            onChange={handleChange}
            className={`dept-add-input dept-add-input-id ${idError && 'error'}`}
            required
          />
          {idError && <p className="error-message">{idError}</p>}
        </div>
        <div className="dept-add-input-group">
          <label className="dept-add-label">Department Name:</label>
          <input
            type="text"
            name="name"
            value={departmentData.name}
            onChange={handleChange}
            className={`dept-add-input dept-add-input-name ${nameError && 'error'}`}
            required
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>

        <br />
        <button type="submit" className="dept-add-button-submit">
          Add Department
        </button>
      </form>

      {/* Success message */}
      {showSuccessMessage && (
        <div className="dept-add-success-message">Department details added successfully!</div>
      )}
    </div>
  );
}

export default DeptAdd;
