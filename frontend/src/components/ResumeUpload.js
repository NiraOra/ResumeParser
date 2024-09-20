import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [error, setError] = useState('');

    // Handle file change
    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    };

    // Handle form submission (file upload)
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        setError('Please upload a file first.');
        return;
    }

    // Create FormData object to send file to backend
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Send the file to the Flask backend
        const response = await axios.post('http://localhost:5000/upload_resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
        setPrediction(response.data.predicted_category);  // Update the state with prediction
        setError('');
    } catch (err) {
        setError('Error while uploading file or processing the resume.');
    }
    };

    return (
    <div>
        <h2>Resume Upload and Category Prediction</h2>
        <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".txt,.pdf,.doc,.docx" />
        <button type="submit">Upload Resume</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {prediction && <p>Predicted Job Category: {prediction}</p>}
    </div>
    );
};

export default ResumeUpload;