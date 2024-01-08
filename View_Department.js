import React, { useState, useEffect } from 'react';
import './ViewDepartment.css';

function ViewDepartment() {
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);

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
    try {
      const response = await fetch('http://localhost:3001/deptDelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: selectedRows }),
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
      const response = await fetch(`http://localhost:3001/deptUpdate/${editDepartment}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: departmentData.find((dept) => dept.dept_id === editDepartment).dept_name,
        }),
    });
    
      

      const data = await response.json();

      if (response.ok) {
        console.log('Department Data Updated:', data);
        // Refresh the department data after successful update
        refreshDepartmentData();
        setEditDepartment(null);
      } else {
        console.error('Error updating department data:', data.message);
      }
    } catch (error) {
      console.error('Error updating department data:', error);
    }
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
    </div>
  );
}

export default ViewDepartment;