const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({ "message": "check" })
});
// Create a connection pool
const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Abdul@6131',
    database: 'projects' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Endpoint to handle creating a new project
app.post('/createProject', (req, res) => {
    const newProject = req.body;

    db.query('INSERT INTO projects_list SET ?', newProject, (error, results) => {
        if (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Failed to create project' });
            return;
        }
        console.log('New project created:', results);
        res.status(200).json({ message: 'Project created successfully' });
    });
});

app.post('/projects_list', (req, res) => {
    const { projectName, projectId, department, startDate, endDate, skillsRequired } = req.body;
    const sql = "INSERT INTO projects_list (projectName, projectId, department, startDate, endDate, skillsRequired) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [projectName, projectId, department, startDate, endDate, skillsRequired], (err) => {
        if (err) {
            console.log("error");
            console.error('Error adding skills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Project added successfully' });
    });
});

//Endpoint to retrieve all projects
app.get('/projects', (req, res) => {
    // From pool.query to db.query
    db.query('SELECT * FROM projects_list', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving projects:', error);
            res.status(500).json({ message: 'Failed to retrieve projects' });
            return;
        }
        console.log('Projects retrieved:', results);
        res.status(200).json(results);
    });

});
app.get('/projects_list/search', (req, res) => {
    const { q } = req.query;
    const sql = "SELECT * FROM projects_list WHERE projectName LIKE ?";
    db.query(sql, [`%${q}%`], (err, results) => {
        if (err) {
            console.error('Error searching skills:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// Assuming this is your backend code for updating the project
app.put('/updateProject/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const updatedProject = req.body;

    db.query('UPDATE projects_list SET ? WHERE projectId = ?', [updatedProject, projectId], (error, results) => {
        if (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Failed to update project', error: error.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        console.log('Project updated:', results);
        res.status(200).json({ message: 'Project updated successfully' });
    });
});

// Express route to handle project deletion
app.delete('/deleteProjects', (req, res) => {
    const { selectedProjectIds } = req.body;

    // if (!selectedProjects || !Array.isArray(selectedProjects)) {
    //     return res.status(400).json({ error: 'Invalid data format' });
    // }
    console.log(selectedProjectIds);

    // Assuming selectedProjects contains project IDs to delete from the database
    const deleteQuery = 'DELETE FROM projects_list WHERE  projectId IN (?)'; // Assuming 'id' is the primary key

    db.query(deleteQuery, [selectedProjectIds], (err, results) => {
        if (err) {
            console.error('Error deleting projects:', err);
            return res.status(500).json({ error: 'Error deleting projects' });
        }

        console.log('Projects deleted from the database successfully!');
        res.sendStatus(200); // Send a success status code (e.g., 200) on successful deletion
    });
});


const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = router;

