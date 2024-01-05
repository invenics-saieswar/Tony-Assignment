const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pre@2001',
  database: 'project',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/assignProject', (req, res) => {
  const { projectName, department, skill, empId } = req.body;

  const sql = `
    INSERT INTO assigned_projects (project_name, department, skill, emp_id, approval_status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [projectName, department, skill, empId], (err, result) => {
    if (err) {
      console.error('Error executing SQL:', err.sqlMessage);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Project assigned successfully. Result:', result);
      res.status(200).send('Project assigned successfully');
    }
  });
});

app.post('/update-approval-status', (req, res) => {
    const { selectedProjectForApproval } = req.body;
  console.log("aaaaaaaaaaaaaa"+selectedProjectForApproval)
    const sql = `
      UPDATE assigned_projects
      SET approval_status = 'Approved'
      WHERE project_name = ? AND approval_status = 'Pending'
    `;
  
    db.query(sql, [selectedProjectForApproval], (err, result) => {
      if (err) {
        console.error('Error executing SQL:', err.sqlMessage);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows === 0) {
          // No rows were updated, project might already be approved
          console.log('No rows updated. Project might already be approved.');
          res.status(200).send('No rows updated. Project might already be approved.');
        } else {
          console.log('Approval status updated successfully. Result:', result);
          res.status(200).send('Approval status updated successfully');
        }
      }
    });
  });
  
  
  

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
