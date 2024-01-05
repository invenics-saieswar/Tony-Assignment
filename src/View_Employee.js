import React, { useState, useEffect } from 'react';
import './View_Employee.css';

function View_Employee() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [nameError, setNameError] = useState('');
  const [allDepartments, setAllDepartments] = useState([]);

  const roles = ['Analyst', 'Manager', 'Director'];
  

 

    // State for managing success and error messages
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/empView')
      .then((response) => response.json())
      .then((data) => setEmployeeData(data.result))
      .catch((error) => console.error('Error fetching employee data:', error));

    fetch('http://localhost:3003/departmentView') // Fetch all departments
      .then((response) => response.json())
      .then((data) => setAllDepartments(data.result))
      .catch((error) => console.error('Error fetching department data:', error));
  }, []);

  const refreshEmployeeData = () => {
    fetch('http://localhost:3001/empView')
      .then((response) => response.json())
      .then((data) => setEmployeeData(data.result))
      .catch((error) => console.error('Error fetching employee data:', error));
  };

  // Function to handle employee deletion
  const handleDelete = async () => {
    // Collect selected employees for deletion
    const deletedEmployees = selectedRows.map((id) => employeeData[id]);

    try {
      const response = await fetch('http://localhost:3001/empDelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedRows }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Employee Data Deleted:', data);
        refreshEmployeeData();
        setSelectedRows([]);
      } else {
        console.error('Error deleting employee data:', data.message);
      }
    } catch (error) {
      console.error('Error deleting employee data:', error);
    }

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
 const handleEdit = (employeeId) => {
    setEditEmployee(employeeId);
  };

  // Function to save edited employee details
  const handleSaveEdit = async () => {
    const editedEmployee = employeeData[editEmployee];
    try {
      const response = await fetch(`http://localhost:3001/empUpdate/${editEmployee}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employeeData.find((emp) => emp.emp_id === editEmployee).emp_name,
          role: employeeData.find((emp) => emp.emp_id === editEmployee).emp_role,
          department: employeeData.find((emp) => emp.emp_id === editEmployee).dept_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Employee Data Updated:', data);
        refreshEmployeeData();
        setEditEmployee(null);
      } else {
        console.error('Error updating employee data:', data.message);
      }
    } catch (error) {
      console.error('Error updating employee data:', error);
    }

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
      const newData = [...prevData];
      const editedIndex = newData.findIndex((emp) => emp.emp_id === editEmployee);
      newData[editedIndex] = { ...newData[editedIndex], [field]: value };
      return newData;
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
            <button onClick={() => handleEdit(selectedRows[0])} disabled={selectedRows.length !== 1}>
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
              {employeeData.map((employee) => (
            <tr key={employee.emp_id}>
              <td>{employee.emp_id}</td>
              <td>
                {editEmployee === employee.emp_id ? (
                  <input
                    type="text"
                    value={employee.emp_name}
                    onChange={(e) => handleInputChange('emp_name', e.target.value)}
                  />
                ) : (
                  employee.emp_name
                )}
              </td>
              {/* Similar logic for 'Role' and 'Department' fields */}
              <td>
               {editEmployee === employee.emp_id ? (
                  <select
                    value={employee.emp_role}
                    onChange={(e) => handleInputChange('emp_role', e.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  employee.emp_role
                )}
              </td>
              <td>
                {editEmployee === employee.emp_id ? (
                  <select
                    value={employee.dept_name}
                    onChange={(e) => handleInputChange('dept_name', e.target.value)}
                  >
                    {allDepartments.map((dept) => (
                      <option key={dept.dept_id} value={dept.dept_name}>
                        {dept.dept_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  employee.dept_name
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
