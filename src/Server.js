const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'akshara',
    database: 'project'
});

app.get('/', (req, res) => {
    return res.json({ "message": "check" });
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'karthi.blogger.avatar@gmail.com',
    pass: 'cxnu pxno dlhm zlkh', // Use the app-specific password here
  },
});
//ak
app.get('/', (req, res) => {
    return res.json({ "message": "check" });
});

app.post('/department', (req, res) => { //adding department
    const { id, name } = req.body;
    const sql='INSERT INTO department (dept_id, dept_name) VALUES (?, ?)';

    db.query(sql, [id,name], (err) => {
        if (err) {
            console.error('Error adding department details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Department details added successfully' });
    });
});

app.get('/departmentView', (req, res) => {
    const sql = "SELECT * FROM department";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving department details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({result });
    });
});

app.put('/deptUpdate/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Invalid department name provided' });
    }

    const sql = "UPDATE department SET dept_name=? WHERE dept_id=?";

    db.query(sql, [name, id], (err) => {
        if (err) {
            console.error('Error updating department detail:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Department details updated successfully' });
    });
});


app.delete('/deptDelete', (req, res) => {
    const { id } = req.body;
    
    if (!id || !Array.isArray(id) || id.length === 0) {
      return res.status(400).json({ message: 'Invalid department IDs provided' });
    }
  
    const sql = "DELETE FROM department WHERE dept_id IN (?)";
  
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting department details:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json({ message: 'Department details deleted successfully' });
    });
  });

  

//////////employee
app.post('/empadd', (req, res) => { //adding
    const { id, name,role, department } = req.body;
    const sql='INSERT INTO employee (emp_id, emp_name, emp_role, dept_id) VALUES (?, ?, ?, (SELECT dept_id FROM department WHERE dept_name = ?))';

    db.query(sql, [id,name, role, department], (err) => {
        if (err) {
            console.error('Error adding employee details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Employee details added successfully' });
    });
});


app.get('/employeeDropdown', (req, res) => { //joining dept and emp table
    const sql = "SELECT emp.emp_id, emp.emp_name, emp.emp_role, dept.dept_id, dept.dept_name FROM employee emp LEFT JOIN department dept ON emp.dept_id = dept.dept_id UNION SELECT emp.emp_id, emp.emp_name, emp.emp_role, dept.dept_id, dept.dept_name FROM employee emp RIGHT JOIN department dept ON emp.dept_id = dept.dept_id WHERE emp.emp_id IS NULL;";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving employee dropdown data:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ result });
    });
});



app.get('/empView', (req, res) => {
    const sql = "SELECT * FROM employee JOIN department ON employee.dept_id = department.dept_id";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving employee details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({result });
    });
});

app.delete('/empDelete', (req, res) => {
    const { id } = req.body;
    
    if (!id || !Array.isArray(id) || id.length === 0) {
      return res.status(400).json({ message: 'Invalid employee IDs provided' });
    }
  
    const sql = "DELETE FROM employee WHERE emp_id IN (?)";
  
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting employee details:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json({ message: 'employee details deleted successfully' });
    });
  });

  app.put('/empUpdate/:id', (req, res) => {
    const { id } = req.params;
    const { name, role, department } = req.body;

    // Check if at least one field is provided
    if (!name && !role && !department) {
        return res.status(400).json({ message: 'Invalid employee details provided' });
    }

    const updateFields = [];
    const values = [];

    if (name) {
        updateFields.push('emp_name=?');
        values.push(name);
    }

    if (role) {
        updateFields.push('emp_role=?');
        values.push(role);
    }

    if (department) {
        // Assuming department is the name of the department
        updateFields.push('dept_id=(SELECT dept_id FROM department WHERE dept_name=?)');
        values.push(department);
    }

    const sql = `UPDATE employee SET ${updateFields.join(', ')} WHERE emp_id=?`;

    db.query(sql, [...values, id], (err) => {
        if (err) {
            console.error('Error updating employee details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Employee details updated successfully' });
    });
});
//
app.post('/sendEmail', async (req, res) => {
  const { name, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com',
    to: email,
    subject: 'Welcome to the Project',
    text: `Hi ${name}, you have been assigned to the project.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/sendaddEmp', async (req, res) => {
  const { name, id, role, department, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com',
    to: email,
    subject: 'Welcome to the Invenics',
    html: `<p>Hi ${name},</p><p>You have been onboarded with the following details:</p>
          <ul>
            <li>Employee ID: ${id}</li>
            <li>Role: ${role}</li>
            <li>Department: ${department}</li>
          </ul>
          <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});
//-------------------------------------------------------------------------------------
app.post('/sendUpdateEmail', async (req, res) => {
  const { id, name, role, department, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com', // Replace with your email
    to: email,
    subject: 'Employee Data Updated',
    html: `
      <p>Your data has been updated:</p>
      <ul>
        <li>ID: ${id}</li>
        <li>Name: ${name}</li>
        <li>Role: ${role}</li>
        <li>Department: ${department}</li>
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});
//-------------------------------------------------------------------------------------
app.post('/sendDeleteEmaill', async (req, res) => {
  const { id, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com', // Replace with your email
    to: email,
    subject: 'Last Mail from the Company',
    html: `
      <p>This is your last email from the company.</p>
      <p>Employee ID: ${id}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Delete email sent successfully!');
  } catch (error) {
    console.error('Error sending delete email:', error);
    res.status(500).send('Failed to send delete email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/sendDeptAddEmail', async (req, res) => {
  const { id, name, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com', // Replace with your email
    to: email,
    subject: 'New Department Added',
    html: `
      <p>FYI: This department has been added to our company:</p>
      <p>Department ID: ${id}</p>
      <p>Department Name: ${name}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Department add email sent successfully!');
  } catch (error) {
    console.error('Error sending department add email:', error);
    res.status(500).send('Failed to send department add email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/sendDeptUpdateEmail', async (req, res) => {
  const { id, name, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com', // Replace with your email
    to: email,
    subject: 'Department Details Update',
    html: `
      <p>FYI: The department details have been updated in our company:</p>
      <p>Department ID: ${id}</p>
      <p>Department Name: ${name}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Department update email sent successfully!');
  } catch (error) {
    console.error('Error sending department update email:', error);
    res.status(500).send('Failed to send department update email.');
  }
});
//-------------------------------------------------------------------------------------
app.post('/sendDeptDeleteEmail', async (req, res) => {
  const { id, email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com', // Replace with your email
    to: email,
    subject: 'Department Details Deletion',
    html: `
      <p>FYI: The department details with ID ${id} have been deleted in our company.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Department delete email sent successfully!');
  } catch (error) {
    console.error('Error sending department delete email:', error);
    res.status(500).send('Failed to send department delete email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/sendCreateProject', async (req, res) => {
  const { subject, body } = req.body;

      const mailOptions = {
          from: 'karthi.blogger.avatar@gmail.com',
          to: 'karthi.blogger.avatar@gmail.com',
          subject: subject,
          text: body
      };
      try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email');
  }
});
//-------------------------------------------------------------------------------------
app.post('/senddeleteProject', async (req, res) => {
  const { projectId } = req.body;

      const mailOptions = {
          from: 'karthi.blogger.avatar@gmail.com',
          to: 'karthi.blogger.avatar@gmail.com',
          subject: `Project with ID: ${projectId} had been deleted`,
          text:'The project has been deleted from the database.'
      };
      try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email');
  }
});
//-------------------------------------------------------------------------------------
app.post('/sendDeleteEmail', async (req, res) => {
  const deletedEmployees = req.body.deletedEmployees;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com',
    to: 'karthi.blogger.avatar@gmail.com', // Replace with the recipient's email
    subject: 'Employees Deleted',
    html: `
      <p>The following employees have been deleted:</p>
      <ul>
        ${deletedEmployees.map(employee => `<li>${employee.id} - ${employee.name}</li>`).join('')}
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Delete email sent successfully!');
  } catch (error) {
    console.error('Error sending delete email:', error);
    res.status(500).send('Failed to send delete email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/sendEditEmail', async (req, res) => {
  try {
    const editedEmployeeDetails = req.body;

    const mailOptions = {
      from: 'karthi.blogger.avatar@gmail.com',
      to: 'karthi.blogger.avatar@gmail.com', // Replace with the recipient's email
      subject: 'Employee Edited',
      html: `
        <p>The employee details have been edited:</p>
        <ul>
          <li>ID: ${editedEmployeeDetails.id}</li>
          <li>Name: ${editedEmployeeDetails.name}</li>
          <li>Role: ${editedEmployeeDetails.role}</li>
          <li>Department: ${editedEmployeeDetails.department}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Edit email sent successfully!');
  } catch (error) {
    console.error('Error sending edit email:', error);
    res.status(500).send('Failed to send edit email.');
  }
});

//-------------------------------------------------------------------------------------
app.post('/project-approval', async (req, res) => {
  const {  selectedProjectApproval,email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com',
    to: email,
    subject: 'Project Approved',
    html: `<p>The  ${selectedProjectApproval} have been approved :</p>
          <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

//--------------------------------------------------------------------------------------
app.post('/sendProjectAssign', async (req, res) => {
  const { projectName,Department,Skill,EmpName,Approval,email } = req.body;

  const mailOptions = {
    from: 'karthi.blogger.avatar@gmail.com',
    to: email,
    subject: 'Project Assinged',
    html: `<p>The ${projectName} has been assigned to the ${Department}</p>
          <p>The employee Name : ${EmpName}</p>
          <p>Skill: ${Skill}</p>
          <p>Approval Status: ${Approval}</p> 
          <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});
//--------------------------------------------------------------------------------------
app.post('/sendDeleteDepartmentEmail', async (req, res) => {
  const deletedDepartments = req.body.deletedDepartments;
  try {
    deletedDepartments.forEach((department) => {
      const mailOptions = {
        from: 'karthi.blogger.avatar@gmail.com',
        to: 'karthi.blogger.avatar@gmail.com', // Replace with recipient's email
        subject: 'Department Deleted',
        text: `The department "${department.name}" has been deleted.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Delete department email sent:', info.response);
        }
      });
    });

    res.status(200).send('Delete department email sent successfully!');
  } catch (error) {
    console.error('Error sending delete department email:', error);
    res.status(500).send('Failed to send delete department email.');
  }
});

//--------------------------------------------------------------------------------------
app.post('/sendEditDepartmentEmail', async (req, res) => {
  const { name } = req.body; // Extract 'name' from the request body

  try {
    const mailOptions = {
      from: 'karthi.blogger.avatar@gmail.com',
      to: 'karthi.blogger.avatar@gmail.com', // Replace with recipient's email
      subject: 'Department Edited',
      text: `The department "${name}" has been edited.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send edit department email.');
      } else {
        console.log('Edit department email sent:', info.response);
        res.status(200).send('Edit department email sent successfully!');
      }
    });
  } catch (error) {
    console.error('Error sending edit department email:', error);
    res.status(500).send('Failed to send edit department email.');
  }
});

//--------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
