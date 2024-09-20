import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Optional: add styling

function App() {
    // States to handle file input and response
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle file selection
    const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setPrediction('');

    if (!selectedFile) {
        setErrorMessage('Please select a file to upload.');
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        // Send the file to the Flask backend
        const response = await axios.post('http://localhost:3300/upload_resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });

        // Set the predicted category
        setPrediction(response.data.predicted_category);
    } catch (error) {
        print(error)
        setErrorMessage('Error uploading file or fetching the prediction.');
    }
    };

    return (
    <div className="App">
        <h1>Resume Parser</h1>
        <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button type="submit">Upload Resume</button>
        </form>

        {/* Display prediction or error message */}
        {prediction && <h2>Predicted Job Category: {prediction}</h2>}
        {errorMessage && <h2 className="error">{errorMessage}</h2>}
    </div>
    );
}

export default App;