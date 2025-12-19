"""
LearnHub Flask Backend
======================
A Python Flask backend for the LearnHub learning platform.
Provides user authentication, progress tracking, and API endpoints.
Now integrated with SQLite database via SQLAlchemy.
"""

from flask import Flask, request, jsonify, session, send_from_directory, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'learnhub-secret-key-change-in-production'

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'learnhub.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)

# ============= Database Models =============

class User(db.Model):
    id = db.Column(db.String(120), primary_key=True) # Using email as ID for simplicity as per original design
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(200), nullable=False)
    avatar = db.Column(db.String(200))
    verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='user', lazy=True)
    completed_lessons = db.relationship('LessonCompletion', backref='user', lazy=True)
    completed_exercises = db.relationship('ExerciseCompletion', backref='user', lazy=True)
    exam_scores = db.relationship('ExamScore', backref='user', lazy=True)
    certificates = db.relationship('Certificate', backref='user', lazy=True)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(120), db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.String(50), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

class LessonCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(120), db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.String(50), nullable=False)
    lesson_id = db.Column(db.String(50), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'course_id', 'lesson_id', name='_user_lesson_uc'),)

class ExerciseCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(120), db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class ExamScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(120), db.ForeignKey('user.id'), nullable=False)
    exam_id = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Certificate(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(120), db.ForeignKey('user.id'), nullable=False)
    exam_id = db.Column(db.String(50), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============= Helpers =============

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ============= Routes =============

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    # API routes are handled by specific decorators above/below.
    # Static files are handled by Flask automatically at /static.
    # This catch-all returns index.html for SPA client-side routing.
    return render_template('index.html')

# ============= Authentication API =============

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    email = data['email']
    
    # Check if email already exists
    if User.query.get(email):
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    new_user = User(
        id=email,
        name=data['name'],
        email=email,
        phone=data.get('phone', ''),
        password_hash=generate_password_hash(data['password']),
        avatar=f"https://ui-avatars.com/api/?name={data['name']}&background=2563eb&color=fff",
        verified=False
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Auto-login after registration
    session['user_id'] = email
    
    return jsonify({
        'message': 'Registration successful',
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email,
            'avatar': new_user.avatar,
            'verified': new_user.verified
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.get(data['email'])
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    session['user_id'] = user.email
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'avatar': user.avatar,
            'verified': user.verified,
             'phone': user.phone
        }
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user"""
    user = User.query.get(session['user_id'])
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'avatar': user.avatar,
        'verified': user.verified,
        'created_at': user.created_at.isoformat()
    }})

@app.route('/api/auth/verify-email', methods=['POST'])
@login_required
def verify_email():
    """Verify email (simulated)"""
    data = request.json
    code = data.get('code', '')
    
    if len(code) == 6 and code.isdigit():
        user = User.query.get(session['user_id'])
        user.verified = True
        db.session.commit()
        return jsonify({'message': 'Email verified successfully'})
    
    return jsonify({'error': 'Invalid verification code'}), 400

# ============= User Profile API =============

@app.route('/api/user/profile', methods=['GET', 'PUT'])
@login_required
def user_profile():
    """Get or update user profile"""
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    if request.method == 'GET':
        return jsonify({'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'avatar': user.avatar,
            'verified': user.verified
        }})
    
    elif request.method == 'PUT':
        data = request.json
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'avatar' in data:
            user.avatar = data['avatar']
            
        db.session.commit()
        
        return jsonify({'message': 'Profile updated', 'user': {
            'id': user.id,
            'name': user.name,
            'phone': user.phone,
            'avatar': user.avatar
        }})

# ============= Progress API =============

@app.route('/api/progress', methods=['GET'])
@login_required
def get_progress():
    """Get user's learning progress"""
    user_id = session['user_id']
    
    # Fetch all data separately
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    completed_lessons = LessonCompletion.query.filter_by(user_id=user_id).all()
    completed_exercises = ExerciseCompletion.query.filter_by(user_id=user_id).all()
    exam_scores_list = ExamScore.query.filter_by(user_id=user_id).all()
    certificates_list = Certificate.query.filter_by(user_id=user_id).all()
    
    # Construct response
    progress = {
        'courses_enrolled': [e.course_id for e in enrollments],
        'lessons_completed': [f"{l.course_id}:{l.lesson_id}" for l in completed_lessons],
        'exercises_completed': [{
            'exercise_id': e.exercise_id,
            'score': e.score,
            'completed_at': e.completed_at.isoformat()
        } for e in completed_exercises],
        'exam_scores': {e.exam_id: {
            'score': e.score,
            'completed_at': e.completed_at.isoformat()
        } for e in exam_scores_list},
        'certificates': [{
            'id': c.id,
            'exam_id': c.exam_id,
            'student_name': c.student_name,
            'score': c.score,
            'issued_at': c.issued_at.isoformat()
        } for c in certificates_list],
        # Streak calculation could be more complex, keeping it simple for now or adding a field to User
        'streak_days': 1 
    }
    
    return jsonify({'progress': progress})

@app.route('/api/progress/lesson', methods=['POST'])
@login_required
def complete_lesson():
    """Mark a lesson as completed"""
    data = request.json
    lesson_id = data.get('lesson_id')
    course_id = data.get('course_id')
    
    if not lesson_id or not course_id:
        return jsonify({'error': 'lesson_id and course_id required'}), 400
    
    user_id = session['user_id']
    
    # Ensure enrollment
    if not Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first():
        new_enrollment = Enrollment(user_id=user_id, course_id=course_id)
        db.session.add(new_enrollment)
    
    # Mark lesson complete if not already
    existing_completion = LessonCompletion.query.filter_by(
        user_id=user_id, course_id=course_id, lesson_id=lesson_id
    ).first()
    
    if not existing_completion:
        completion = LessonCompletion(user_id=user_id, course_id=course_id, lesson_id=lesson_id)
        db.session.add(completion)
        db.session.commit()
    
    count = LessonCompletion.query.filter_by(user_id=user_id).count()
    
    return jsonify({
        'message': 'Lesson completed',
        'lessons_completed': count
    })

@app.route('/api/progress/exercise', methods=['POST'])
@login_required
def complete_exercise():
    """Save exercise results"""
    data = request.json
    exercise_id = data.get('exercise_id')
    score = data.get('score', 0)
    
    if not exercise_id:
        return jsonify({'error': 'exercise_id required'}), 400
    
    user_id = session['user_id']
    
    completion = ExerciseCompletion(user_id=user_id, exercise_id=exercise_id, score=score)
    db.session.add(completion)
    db.session.commit()
    
    return jsonify({'message': 'Exercise completed', 'score': score})

@app.route('/api/progress/exam', methods=['POST'])
@login_required
def submit_exam():
    """Submit exam and generate certificate if passed"""
    data = request.json
    exam_id = data.get('exam_id')
    score = data.get('score', 0)
    
    if not exam_id:
        return jsonify({'error': 'exam_id required'}), 400
    
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    # Save exam score
    exam_score = ExamScore(user_id=user_id, exam_id=exam_id, score=score)
    db.session.add(exam_score)
    
    # Generate certificate if passed (70%+)
    certificate_data = None
    if score >= 70:
        cert_id = f"CERT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        certificate = Certificate(
            id=cert_id,
            user_id=user_id,
            exam_id=exam_id,
            student_name=user.name,
            score=score
        )
        db.session.add(certificate)
        
        certificate_data = {
            'id': cert_id,
            'exam_id': exam_id,
            'student_name': user.name,
            'score': score,
            'issued_at': datetime.now().isoformat()
        }
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exam submitted',
        'score': score,
        'passed': score >= 70,
        'certificate': certificate_data
    })

# ============= Dashboard API =============

@app.route('/api/dashboard', methods=['GET'])
@login_required
def get_dashboard():
    """Get dashboard data"""
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Simple stats
    courses_count = Enrollment.query.filter_by(user_id=user_id).count()
    lessons_count = LessonCompletion.query.filter_by(user_id=user_id).count()
    certs_count = Certificate.query.filter_by(user_id=user_id).count()
    
    # Avg score
    scores = [s.score for s in ExamScore.query.filter_by(user_id=user_id).all()]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    stats = {
        'courses_enrolled': courses_count,
        'lessons_completed': lessons_count,
        'certificates_earned': certs_count,
        'streak_days': 1, # Placeholder
        'average_score': avg_score
    }
    
    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'avatar': user.avatar
        },
        'stats': stats
    })

# ============= Courses API (Static Data) =============

COURSES = {
    'python': {
        'id': 'python',
        'title': 'Python Programming',
        'description': 'Master Python programming from fundamentals to advanced concepts',
        'icon': '🐍',
        'lessons': ['intro', 'syntax', 'variables', 'control', 'functions', 'oop', 'modules']
    },
    'javascript': {
        'id': 'javascript',
        'title': 'JavaScript',
        'description': 'Build dynamic web applications with JavaScript',
        'icon': '⚡',
        'lessons': ['intro', 'syntax', 'dom', 'events', 'async', 'es6', 'frameworks']
    },
    'english': {
        'id': 'english',
        'title': 'English Language',
        'description': 'Learn English from basics to advanced conversation skills',
        'icon': '🇬🇧',
        'lessons': ['alphabet', 'greetings', 'grammar', 'vocabulary', 'conversation', 'writing']
    },
    'spanish': {
        'id': 'spanish',
        'title': 'Spanish Language',
        'description': 'Discover the beauty of Spanish language and culture',
        'icon': '🇪🇸',
        'lessons': ['alfabeto', 'saludos', 'gramatica', 'vocabulario', 'conversacion']
    },
    'french': {
        'id': 'french',
        'title': 'French Language',
        'description': 'Master French pronunciation and grammar with ease',
        'icon': '🇫🇷',
        'lessons': ['alphabet', 'salutations', 'grammaire', 'vocabulaire', 'conversation']
    }
}

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all available courses"""
    return jsonify({'courses': list(COURSES.values())})

@app.route('/api/courses/<course_id>', methods=['GET'])
def get_course(course_id):
    """Get specific course"""
    course = COURSES.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify({'course': course})

# ============= Run Server =============

if __name__ == '__main__':
    # Create DB table if not exist
    with app.app_context():
        db.create_all()
        print("Database initialized.")

    print("=" * 50)
    print("LearnHub Backend Server (SQLite)")
    print("=" * 50)
    print(f"Server running at: http://localhost:5000")
    print(f"Serving static files from: {os.getcwd()}")
    print("=" * 50)
    app.run(debug=True, port=5000)
