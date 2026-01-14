from app.main import create_app
from app.config import PORT, MEDIA_FOLDER

app = create_app()

if __name__ == '__main__':
    print("MEDIA_FOLDER =", MEDIA_FOLDER)
    app.run(debug=True, host='0.0.0.0', port=PORT)
