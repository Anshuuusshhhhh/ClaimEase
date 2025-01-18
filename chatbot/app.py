import speech_recognition as sr
import openai
from flask import Flask, request, jsonify
import pdfplumber
import pytesseract
from PIL import Image
import os
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
# CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500"]}})
CORS(app)


# Set OpenAI API key (replace with your own key)
openai.api_key = os.getenv("OPENAI_API")
# client = openai.OpenAI(api_key=os.getenv("OPENAI_API"))

# print(os.getenv("OPENAI_API"))
# Function to extract text from PDFs
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        return text

# Function to extract text from images (X-ray, MRI, etc.)
def extract_text_from_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text

# Function to make a diagnosis request to OpenAI's GPT model
def diagnose_with_openai(context):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # or "gpt-3.5-turbo" gpt-4 
            messages=[
                    {"role": "developer", "content": "You are an AI medical assistant specializing in health insurance claims. Your role is to converse professionally with users and guide them on submitting necessary details for insurance claim evaluation. You can only answer medical and insurance-related questions. If users ask unrelated queries, politely redirect them to medical or claim-related topics."},
                    {"role": "user", "content": context}
                ]
        )

        bot_message = response['choices'][0]['message']['content']
        return bot_message
    except Exception as e:
        # Handle all other errors
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
# Route for uploading and processing documents
@app.route('/diagnosis', methods=['POST'])   
def diagnose():

    # Check if the post request has the files
    if 'file' not in request.files:
        return jsonify({"error": "No file provided!"}), 400

    file = request.files['file']
    file_ext = file.filename.split('.')[-1].lower()

    # If the file is a PDF
    if file_ext == 'pdf':
        file_path = os.path.join("", file.filename)
        file.save(file_path)
        context = extract_text_from_pdf(file_path)

    # If the file is an image (e.g., X-ray, MRI)
    elif file_ext in ['jpg', 'jpeg', 'png']:
        file_path = os.path.join("", file.filename)
        file.save(file_path)
        context = extract_text_from_image(file_path)

    # If the file type is unsupported
    else:
        return jsonify({"error": "Unsupported file format!"}), 400

    # Get diagnosis and claim verification
    diagnosis = diagnose_with_openai(context)
    # print(context)
    # print(diagnosis)
    return jsonify({"diagnosis": diagnosis})

@app.route("/")
def home():
    """
    Home page for Flask server. This serves as a test page to ensure the Flask app is running.
    """
    return """
    <h1>Welcome to the Flask Chatbot Server</h1>
    <p>This server is running on <strong>localhost:5000</strong>.</p>
    <p>To test the chatbot, send a POST request to <strong>/chat</strong>.</p>
    <p>Example:</p>
    <pre>
    curl -X POST http://127.0.0.1:5000/chat \
    -H "Content-Type: application/json" \
    -d '{"userMessage": "Hello, I need help with my insurance."}'
    </pre>
    """

# Endpoint for handling chatbot interaction
@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Get user message from the request
        data = request.get_json()
        user_message = data.get("userMessage")
        if not user_message:
            return jsonify({"error": "userMessage is required"}), 400

        # Validate the OpenAI API key
        if not openai.api_key:
            return jsonify({"error": "OpenAI API key is missing"}), 500

        # OpenAI ChatCompletion API request
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Use a valid model like "gpt-4" or "gpt-3.5-turbo"
            messages=[
                {"role": "developer", "content": "You are an AI medical assistant specializing in health insurance claims. Your role is to converse professionally with users and guide them on submitting necessary details for insurance claim evaluation. You can only answer medical and insurance-related questions. If users ask unrelated queries, politely redirect them to medical or claim-related topics."},
                {"role": "user", "content": user_message}
            ]
        )

        # Extract the AI's response
        bot_message = response['choices'][0]['message']['content']

        return jsonify({"botMessage": bot_message}) 

    except Exception as e:
        # Handle all other errors
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

    



@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
        return jsonify({"transcription": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results from Google Speech Recognition service; {e}"}), 500
# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
