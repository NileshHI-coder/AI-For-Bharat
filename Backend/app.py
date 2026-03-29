from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_AI_API_KEY'))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'careers.json')

def load_careers():
    try:
        with open(DATABASE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print("✅ JSON loaded successfully")
            return data
    except Exception as e:
        print("❌ JSON ERROR:", e)
        return []

# Load careers data


# Cache for careers data
careers_cache = None

def get_careers():
    global careers_cache
    if careers_cache is None:
        careers_cache = load_careers()
    return careers_cache

# ------------------ ROUTES ------------------

@app.route('/api/careers', methods=['GET'])
def get_all_careers():
    """Get all available careers for dropdown"""
    careers = get_careers()

    dropdown_careers = [
        {
            "id": career.get("id"),
            "name": career.get("career_name")
        }
        for career in careers
    ]

    return jsonify(dropdown_careers)


@app.route('/api/career/<int:career_id>', methods=['GET'])
def get_career(career_id):
    """Get detailed information for specific career"""
    careers = get_careers()

    career = next((c for c in careers if c.get("id") == career_id), None)

    if not career:
        return jsonify({"error": "Career not found"}), 404

    return jsonify(career)


@app.route('/api/career/search', methods=['GET'])
def search_careers():
    """Search careers by keyword"""
    query = request.args.get('q', '').lower()
    careers = get_careers()

    filtered_careers = [
        {
            "id": career.get("id"),
            "name": career.get("career_name")
        }
        for career in careers
        if query in career.get("career_name", "").lower()
    ]

    return jsonify(filtered_careers)


# ------------------ AI CHAT (REAL GEMINI) ------------------

@app.route('/api/chat', methods=['POST'])
def ai_chat():
    data = request.json

    user_message = data.get('message', '')
    career_name = data.get('career_name', 'career')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        model = genai.GenerativeModel("gemini-pro")

        prompt = f"""
        You are Smart Mentor AI, a helpful career guidance assistant.

        Career: {career_name}

        User Question: {user_message}

        Give a clear, short, and helpful answer.
        """

        response = model.generate_content(prompt)

        return jsonify({
            "response": response.text.strip()
        })

    except Exception as e:
        print("❌ AI Error:", e)
        return jsonify({
            "error": "AI service failed. Check API key or internet."
        }), 500


# ------------------ ERROR HANDLERS ------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# ------------------ MAIN ------------------

if __name__ == '__main__':
    print("🚀 Starting Smart Mentor AI Backend...")
    print("📊 Loading careers database...")

    careers = get_careers()
    print(f"✅ Loaded {len(careers)} careers successfully!")

    print("🌐 Server running on http://localhost:5000")

    app.run(debug=True, host='0.0.0.0', port=5000)
