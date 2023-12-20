import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Skill_Mapping.css';

const API_URL = 'http://localhost:3001/skills';

const Skill_Mapping = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    yearsOfExperience: '',
    proficiency: 'Beginner',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setSkills(response.data))
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchQuery') {
      setSearchQuery(value);
    } else if (name === 'employeeName') {
      setEmployeeName(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddSkill = () => {
    if (!employeeName || !/^[a-zA-Z ]+$/.test(employeeName)) {
      alert("Employee name is required and should only contain letters.");
      return;
    }

    if (!formData.name || !formData.yearsOfExperience) {
      alert("Skill name and Years of Experience are required.");
      return;
    }

    const newSkill = {
      ...formData,
      employeeName,
      id: Date.now(),
    };
    setSkills([...skills, newSkill]);
    resetForm();
  };

  const handleEditSkill = (employeeName) => {
    const skillToEdit = skills.find(skill => skill.employeeName === employeeName);
    setFormData({
      employeeName: skillToEdit.employeeName,
      name: skillToEdit.name,
      yearsOfExperience: skillToEdit.yearsOfExperience.toString(),
      proficiency: skillToEdit.proficiency,
      description: skillToEdit.description,
    });
    setEditingSkill(employeeName);
  };

  const handleUpdateSkill = () => {
    if (!employeeName || !/^[a-zA-Z ]+$/.test(employeeName)) {
      alert("Employee name is required and should only contain letters.");
      return;
    }

    if (!formData.name || !formData.yearsOfExperience) {
      alert("Skill name and Years of Experience are required.");
      return;
    }

    const updatedSkill = { ...formData, employeeName };
    const updatedSkills = skills.map(skill => {
      if (skill.employeeName.toLowerCase() === employeeName.toLowerCase()) {
        return updatedSkill;
      } else {
        return skill;
      }
    });

    setSkills(updatedSkills);
    resetForm();
  };

  const handleDeleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleSaveSkills = () => {
    axios.post(API_URL, skills)
      .then(response => {
        console.log('Skills saved successfully:', response.data);
        setSkills([]);
      })
      .catch(error => console.error('Error saving skills:', error));
  };

  const handleSearch = () => {
    const filteredSkillsByName = skills.filter(
      (skill) => skill.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSkills(filteredSkillsByName);
    console.log('Search:', searchQuery);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      yearsOfExperience: '',
      proficiency: 'Choose',
      description: '',
    });
    setEmployeeName('');
    setEditingSkill(null);
  };

  const yearsOfExperienceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'];

  const calculateProficiency = (experience) => {
    if (experience <= 3) {
      return 'Beginner';
    } else if (experience <= 8) {
      return 'Intermediate';
    } else if (experience === "10+") {
      return 'Advanced';
    } else {
      return 'Advanced';
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      skill.employeeName.toLowerCase().includes(employeeName.toLowerCase())
  );

  return (
    <div className='skill-mapping-container'>
      <h2 className="skill-mapping-title">Skill Mapping</h2>

      <form className="skill-form">
        <label>Search:</label>
        <input
          type="text"
          placeholder="Enter employee name"
          name="searchQuery"
          value={searchQuery}
          onChange={handleInputChange}
        />

        <label>Employee Name:</label>
        <input
          type="text"
          placeholder="Enter employee name"
          name="employeeName"
          value={employeeName}
          onChange={handleInputChange}
          required
        />

        <label>Skill:</label>
        <input
          type="text"
          placeholder="Enter skill"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label>Years of Experience:</label>
        <select
          value={formData.yearsOfExperience}
          onChange={(e) => {
            const experience = e.target.value;
            setFormData({
              ...formData,
              yearsOfExperience: experience,
              proficiency: calculateProficiency(experience),
            });
          }}
          name="yearsOfExperience"
          required
        >
          <option value="">Choose</option>
          {yearsOfExperienceOptions.map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? 'year' : 'years'}
            </option>
          ))}
        </select>

        <label>Proficiency:</label>
        <select
          value={formData.proficiency}
          onChange={handleInputChange}
          name="proficiency"
          required
        >
          <option value="">Choose</option>
          <option value="Beginner">Beginner (up to 3 years)</option>
          <option value="Intermediate">Intermediate (between 3 and 8 years)</option>
          <option value="Advanced">Advanced (more than 8 years)</option>
        </select>

        <label>Description:</label>
        <textarea
          placeholder="Enter description"
          value={formData.description}
          onChange={handleInputChange}
          name="description"
          rows="2"
        ></textarea>

        {editingSkill ? (
          <button type="button" onClick={handleUpdateSkill}>Update Skill</button>
        ) : (
          <button type="button" onClick={handleAddSkill}>Add Skill</button>
        )}
        <br />
        <button type="button" onClick={handleSearch}>Search</button>
        <br />

      </form>
      <ul>
        {filteredSkills.map((skill) => (
          <li key={skill.id} className={`skill-item-${skill.id}`}>
            <span className={`employee-name-${skill.id}`}>{skill.employeeName}</span> -
            <span className={`skill-name-${skill.id}`}>{skill.name}</span> -
            <span className={`experience-${skill.id}`}>{skill.yearsOfExperience} years</span> -
            <span className={`proficiency-${skill.id}`}>{skill.proficiency}</span>
            <br />
            <br />
            <button onClick={() => handleEditSkill(skill.employeeName)}>Edit</button>
            <br />
            <br />
            <button onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {skills.length > 0 && (
        <button type="button" onClick={handleSaveSkills}>Save Skills</button>
      )}
    </div>
  );
};

export default Skill_Mapping;
