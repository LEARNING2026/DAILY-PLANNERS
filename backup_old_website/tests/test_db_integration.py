import requests
import json

BASE_URL = 'http://localhost:5000/api'
SESSION = requests.Session()

def print_result(name, response, expected_status=200):
    if response.status_code == expected_status:
        print(f"[SUCCESS] {name}")
    else:
        print(f"[FAILED] {name} ({response.status_code})")
        print(response.text)

def test_flow():
    # 1. Register
    print("\n--- Testing Registration ---")
    data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    }
    r = SESSION.post(f'{BASE_URL}/auth/register', json=data)
    # Registration might fail if user exists from previous run, which is fine for re-runs but we handle it
    if r.status_code == 409:
        print("User already exists, proceeding to login...")
    else:
        print_result("Registration", r, 201)

    # 2. Login
    print("\n--- Testing Login ---")
    login_data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    r = SESSION.post(f'{BASE_URL}/auth/login', json=login_data)
    print_result("Login", r)

    # 3. Get Profile
    print("\n--- Testing Get Profile ---")
    r = SESSION.get(f'{BASE_URL}/auth/me')
    print_result("Get Profile", r)

    # 4. Update Profile
    print("\n--- Testing Update Profile ---")
    update_data = {'phone': '1234567890'}
    r = SESSION.put(f'{BASE_URL}/user/profile', json=update_data)
    print_result("Update Profile", r)

    # 5. Complete Lesson
    print("\n--- Testing Complete Lesson ---")
    lesson_data = {'course_id': 'python', 'lesson_id': 'intro'}
    r = SESSION.post(f'{BASE_URL}/progress/lesson', json=lesson_data)
    print_result("Complete Lesson", r)

    # 6. Complete Exercise
    print("\n--- Testing Complete Exercise ---")
    exercise_data = {'exercise_id': 'py-ex-1', 'score': 100}
    r = SESSION.post(f'{BASE_URL}/progress/exercise', json=exercise_data)
    print_result("Complete Exercise", r)

    # 7. Submit Exam
    print("\n--- Testing Submit Exam ---")
    exam_data = {'exam_id': 'python-final', 'score': 85}
    r = SESSION.post(f'{BASE_URL}/progress/exam', json=exam_data)
    print_result("Submit Exam", r)

    # 8. Get Dashboard
    print("\n--- Testing Dashboard ---")
    r = SESSION.get(f'{BASE_URL}/dashboard')
    print_result("Get Dashboard", r)
    if r.status_code == 200:
        stats = r.json().get('stats', {})
        print("Stats:", json.dumps(stats, indent=2))

if __name__ == '__main__':
    try:
        test_flow()
    except Exception as e:
        print(f"Test failed with error: {e}")
        print("Make sure the server is running!")
