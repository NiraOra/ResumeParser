from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import joblib  # To load your trained model
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Initialize Flask app
app = Flask(__name__)

# Define where to save uploaded files (optional)
UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Loading the trained models + vectorizer using joblib
model = joblib.load('resume_parser_model.pkl')  
vectorizer = joblib.load('vectorizer.pkl')  

# Preprocessing text
def preprocess_text(resume_text):
    tokens = word_tokenize(resume_text.lower())
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
    return ' '.join(lemmatized_tokens)

# Endpoint to handle resume uploads and predict job category
@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    # Check if a file is included in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    # get the files; make sure there is an appropriate one
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Save the uploaded file in the uploads folder
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Reading resume text, assuming it is in text format
    with open(filepath, 'r') as f:
        resume_text = f.read()

    # 1. Preprocess the resume text
    resume_preprocessed = preprocess_text(resume_text)

    # 2. Vectorize the preprocessed resume using the same vectorizer used for training
    resume_tfidf = vectorizer.transform([resume_preprocessed])

    # 3. Predict the job category
    predicted_category = model.predict(resume_tfidf)[0]

    # Return the predicted job category as a JSON response
    return jsonify({"predicted_category": predicted_category}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)