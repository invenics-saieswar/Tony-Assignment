import React, { useState, useEffect } from 'react';
import './View_Employee.css';
import {useNotification } from './NotificationContext'

function View_Employee() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [nameError, setNameError] = useState('');
  const [allDepartments, setAllDepartments] = useState([]);

    // State for managing success and error messages
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
  
    const{addNotification}=useNotification();

  const roles = ['Analyst', 'Manager', 'Director'];

  useEffect(() => {
    fetch('http://localhost:3001/empView')
      .then((response) => response.json())
      .then((data) => setEmployeeData(data.result))
      .catch((error) => console.error('Error fetching employee data:', error));

    fetch('http://localhost:3001/departmentView') // Fetch all departments
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

  const handleDelete = async () => {
    try {
      // Collect selected employees for deletion
      const deletedEmployees = employeeData.filter((employee) => selectedRows.includes(employee.emp_id));
  
      console.log("Selected Employees for Deletion:", deletedEmployees);
  
      // Send delete email to server
      const emailResponse = await fetch('http://localhost:3001/sendDeleteEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: deletedEmployees }),
      });
  
      // Check response status for success/error handling
      if (emailResponse.ok) {
        console.log('Delete email sent successfully!');
        addNotification('Employee Deleted successfully Mail sent');
        showSuccess();
      } else {
        console.error('Failed to send delete email.');
        addNotification('Employee Deleted successfully Mail Failed to sent');
        showError();
      }
  
      // Send request to delete employees
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
  };
  

  const handleEdit = (employeeId) => {
    setEditEmployee(employeeId);
  };

  const handleSaveEdit = async () => {
    try {
      if (editEmployee !== null) {
        // Find the edited employee in the employeeData array
        const editedEmployee = employeeData.find((emp) => emp.emp_id === editEmployee);
  
        if (editedEmployee) {
          console.log("Checking edited emp", editedEmployee);
  
          // Send edited employee data to the server
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
            addNotification('Employee Edited Successfully Mail Sent');
            showSuccess();
          } else {
            console.error('Failed to send edit email.');
            addNotification('Employee Edited successfully Mail Failed to sent');
            showError();
          }
  
          // Continue with the update only if the email is sent successfully
          const updateResponse = await fetch(`http://localhost:3001/empUpdate/${editEmployee}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedEmployee.emp_name,
              role: editedEmployee.emp_role,
              department: editedEmployee.dept_name,
            }),
          });
  
          const updateData = await updateResponse.json();
  
          if (updateResponse.ok) {
            console.log('Employee Data Updated:', updateData);
            refreshEmployeeData();
            setEditEmployee(null);
          } else {
            console.error('Error updating employee data:', updateData.message);
          }
        } else {
          console.error('Edited employee not found.');
          showError();
        }
      } else {
        console.error('Edit employee ID is null or undefined.');
        // Handle this case, such as displaying an error message
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the overall error, such as displaying an error message
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

  const handleCancelEdit = () => {
    setEditEmployee(null);
  };

  const handleCheckboxChange = (employeeId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(employeeId)) {
        return prevSelectedRows.filter((id) => id !== employeeId);
      } else {
        return [...prevSelectedRows, employeeId];
      }
    });
  };

  const handleInputChange = (field, value) => {
    setEmployeeData((prevData) => {
      const newData = [...prevData];
      const editedIndex = newData.findIndex((emp) => emp.emp_id === editEmployee);
      newData[editedIndex] = { ...newData[editedIndex], [field]: value };
      return newData;
    });
  };

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
                  checked={selectedRows.includes(employee.emp_id)}
                  onChange={() => handleCheckboxChange(employee.emp_id)}
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