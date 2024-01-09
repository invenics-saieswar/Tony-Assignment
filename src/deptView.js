import React, { useState, useEffect } from 'react';
import './deptView.css';
import {useNotification} from './NotificationContext';

function DeptManagement() {
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);

  // State for managing success and error messages
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetch('http://localhost:3001/departmentView')  // Corrected endpoint
      .then((response) => response.json())
      .then((data) => setDepartmentData(data.result))  // Corrected data extraction
      .catch((error) => console.error('Error fetching department data:', error));
  }, []);
  
  const refreshDepartmentData = () => {
    fetch('http://localhost:3001/departmentView')
      .then((response) => response.json())
      .then((data) => setDepartmentData(data.result))
      .catch((error) => console.error('Error fetching department data:', error));
  };

  const handleDelete = async () => {
    const deletedDepartments = selectedRows.map((id) => departmentData.find((dept) => dept.dept_id === id));
   
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
      } else {
        console.error('Failed to send delete email.');
        showError();
      }
    } catch (error) {
      console.error('Error sending delete email:', error);
      addNotification('Failed to send the mail');
    }
  
    try {
      const response = await fetch('http://localhost:3001/deptDelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedRows }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Department Data Deleted:', data);
        // Refresh the department data after successful deletion
        refreshDepartmentData();
        setSelectedRows([]);
      } else {
        console.error('Error deleting department data:', data.message);
      }
    } catch (error) {
      console.error('Error deleting department data:', error);
    }
  };
  
  const handleEdit = () => {
    setEditDepartment(selectedRows[0]);
  };

  const handleSaveEdit = async () => {
    try {
      // Assuming 'editDepartment' is a valid ID
      const editedDepartment = departmentData.find((dept) => dept.dept_id === editDepartment);
  
      if (editedDepartment) {
        const { dept_name: name } = editedDepartment; // Updated destructuring
        console.log("checking the variable" + name);
  
        // Send edit email
        const emailResponse = await fetch('http://localhost:3001/sendEditDepartmentEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
  
        if (emailResponse.ok) {
          console.log('Edit email sent successfully!');
          //  addNotification('Dept Edit email sent successfully!');
          showSuccess();
        } else {
          console.error('Failed to send edit email.');
        }
  
        // Continue with the update only if the email is sent successfully
        const updateResponse = await fetch(`http://localhost:3001/deptUpdate/${editDepartment}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: departmentData.find((dept) => dept.dept_id === editDepartment).dept_name,
          }),
        });
  
        const updateData = await updateResponse.json();
  
        if (updateResponse.ok) {
          console.log('Department Data Updated:', updateData);
          refreshDepartmentData();
          setEditDepartment(null);
        } else {
          console.error('Error updating department data:', updateData.message);
        }
      } else {
        console.error('Edited department not found.');
        showError();
      }
    } catch (error) {
      console.error('Error:', error);
  
      //  addNotification('Failed to send the mail or update department data');
    }
  };
  

  const handleCancelEdit = () => {
    setEditDepartment(null);
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
      const newData = [...prevData];
      const editedIndex = newData.findIndex((dept) => dept.dept_id === editDepartment);
      newData[editedIndex] = { ...newData[editedIndex], [field]: value };
      return newData;
    });
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
          {departmentData.map((department) => (
            <tr key={department.dept_id}>
              <td>{department.dept_id}</td>
              <td>
                {editDepartment === department.dept_id ? (
                  <input
                    type="text"
                    value={department.dept_name}
                    onChange={(e) => handleInputChange('dept_name', e.target.value)}
                  />
                ) : (
                  department.dept_name
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(department.dept_id)}
                  onChange={() => handleCheckboxChange(department.dept_id)}
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
