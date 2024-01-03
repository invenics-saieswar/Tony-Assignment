import React, { useState } from 'react';
import './Department.css';
import { useNotification } from './NotificationContext';
 
 
function DeptManagement() {
  const [departmentData, setDepartmentData] = useState({
    1: { id: 1, name: 'App Dev' },
    2: { id: 2, name: 'Automation' },
    3: { id: 3, name: 'SAP' },
    4: { id: 4, name: 'Product' },
  });
 
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
 
  // State for managing success and error messages
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { addNotification } = useNotification();
 
  const handleDelete = async () => {
    const deletedDepartments = selectedRows.map((id) => departmentData[id]);
 
    try {
      const response = await fetch('http://localhost:3001/sendDeleteDepartmentEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deletedDepartments }),
      });
 
      if (response.ok) {
        console.log('Delete email sent successfully!');
        showSuccess();
        addNotification('Department Deleted successfully');
        // Display success message  inside try
      } else {
        console.error('Failed to send delete email.');
      }
    } catch (error) {
      console.error('Error sending delete email:', error);
      addNotification('Failed to send the mail');
      showError();
      // Display error message inside catch
    }
 
   setDepartmentData((prevData) => {
      const newData = { ...prevData };
      selectedRows.forEach((id) => {
        delete newData[id];
      });
      return newData;
    });
    setSelectedRows([]);
  };
 
  const handleEdit = () => {
    setEditDepartment(selectedRows[0]);
  };
 
  const handleSaveEdit = async () => {
    try {
      const editedDepartment = departmentData[editDepartment]; // Accessing the department object using editDepartment ID
 
      if (editedDepartment) {
        const { name } = editedDepartment; // Destructure the 'name' property
 
        const response = await fetch('http://localhost:3001/sendEditDepartmentEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }), // Send only the 'name' property
        });
 
        if (response.ok) {
          console.log('Edit email sent successfully!');
          addNotification('Dept Edit email sent successfully!');
          showSuccess();
          // Display success message  inside try
        } else {
          console.error('Failed to send edit email.');
        }
      } else {
        console.error('Edited department not found.');
      }
    } catch (error) {
      console.error('Error sending edit email:', error);
      showError();
      addNotification('Failed to sent the mail');
      // Display error message inside catch
    }
 
    setEditDepartment(null);
  };
 
 
 
  const handleCancelEdit = () => {
    setEditDepartment(null);
  };
 
  const handleCheckboxChange = (departmentId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(departmentId)) {
        return prevSelectedRows.filter((id) => id !== departmentId);
      } else {
        return [...prevSelectedRows, departmentId];
      }
    });
  };
 
  const handleInputChange = (field, value) => {
    setDepartmentData((prevData) => {
      const newData = { ...prevData };
      newData[editDepartment][field] = value;
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
 
  return (
    <div className="dept-management-container">
 
      <h2 className="dept-management-title">Department Management</h2>
      <div className="dept-management-buttons">
        {editDepartment ? (
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
 
      <table className="dept-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(departmentData).map((department) => (
            <tr key={department.id}>
              <td>{department.id}</td>
              <td>
                {editDepartment === department.id ? (
                  <input
                    type="text"
                    value={departmentData[department.id].name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  department.name
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(department.id)}
                  onChange={() => handleCheckboxChange(department.id)}
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
 
export default DeptManagement;
 