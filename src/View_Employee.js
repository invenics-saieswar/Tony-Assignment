import React, { useState } from 'react';
import './View_Employee.css';

function View_Employee() {
  // State declarations
  const [employeeData, setEmployeeData] = useState({
    1: { id: 1, name: 'Akshara', role: 'Manager', department: 'Automation' },
    2: { id: 2, name: 'Karthi', role: 'Analyst', department: 'App Dev' },
    3: { id: 3, name: 'Abdul', role: 'Director', department: 'SAP' },
    4: { id: 4, name: 'Preethi', role: 'CEO', department: 'Google' },
    // Add more employees as needed
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

    // State for managing success and error messages
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Function to handle employee deletion
  const handleDelete = async () => {
    // Collect selected employees for deletion
    const deletedEmployees = selectedRows.map((id) => employeeData[id]);

    try {
      // Send delete email to server
      const response = await fetch('http://localhost:3001/sendDeleteEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deletedEmployees }),
      });

      // Check response status for success/error handling
      if (response.ok) {
        console.log('Delete email sent successfully!');
        showSuccess();
// Display success message  inside try
      } else {
        console.error('Failed to send delete email.');
      }
    } catch (error) {
      console.error('Error sending delete email:', error);
      showError();
      // Display error message inside catch
    }

    // Update state to remove deleted employees
    const updatedData = { ...employeeData };
    selectedRows.forEach((id) => {
      delete updatedData[id];
    });

    setEmployeeData(updatedData);
    setSelectedRows([]);
  };

  // Function to handle editing an employee
  const handleEdit = () => {
    setEditEmployee(selectedRows[0]);
  };

  // Function to save edited employee details
  const handleSaveEdit = async () => {
    const editedEmployee = employeeData[editEmployee];

    try {
      // Send edited employee data to server
      const response = await fetch('http://localhost:3001/sendEditEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEmployee),
      });

      // Check response status for success/error handling
      if (response.ok) {
        console.log('Edit email sent successfully!');
        showSuccess();
// Display success message  inside try
      } else {
        console.error('Failed to send edit email.');
      }
    } catch (error) {
      console.error('Error sending edit email:', error);
      showError();
      // Display error message inside catch
    }

    setEditEmployee(null);
  };

  // Function to cancel the edit mode
  const handleCancelEdit = () => {
    setEditEmployee(null);
  };

  // Function to handle checkbox change for selecting employees
  const handleCheckboxChange = (employeeId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(employeeId)) {
        return prevSelectedRows.filter((id) => id !== employeeId);
      } else {
        return [...prevSelectedRows, employeeId];
      }
    });
  };

  // Function to handle input changes in edit mode
  const handleInputChange = (field, value) => {
    setEmployeeData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[editEmployee] = {
        ...updatedData[editEmployee],
        [field]: value,
      };
      return updatedData;
    });
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

  // Render the component
  return (
    <div className="emp-management-container">
      <h2 className="emp-management-title">Employee Management</h2>
      <div className="emp-management-buttons">
        {editEmployee ? (
          <>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} disabled={selectedRows.length !== 1}>
              Edit
            </button>
            <button onClick={handleDelete} disabled={selectedRows.length === 0}>
              Delete
            </button>
          </>
        )}
      </div>

      <table className="emp-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through employee data to render table rows */}
          {Object.values(employeeData).map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {/* Render input in edit mode, otherwise show employee name */}
                {editEmployee === employee.id ? (
                  <input
                    type="text"
                    value={employeeData[employee.id].name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  employee.name
                )}
              </td>
              {/* Similar logic for 'Role' and 'Department' fields */}
              <td>
                {editEmployee === employee.id ? (
                  <input
                    type="text"
                    value={employeeData[employee.id].role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                ) : (
                  employee.role
                )}
              </td>
              <td>
                {editEmployee === employee.id ? (
                  <input
                    type="text"
                    value={employeeData[employee.id].department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                ) : (
                  employee.department
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(employee.id)}
                  onChange={() => handleCheckboxChange(employee.id)}
                />
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
}

export default View_Employee;