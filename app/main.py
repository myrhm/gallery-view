from flask import Flask
from app.routes import register_routes
from app.config import DEFAULT_MEDIA_FOLDER
import os

# def create_app():
#     app = Flask(__name__)

#     os.makedirs(MEDIA_FOLDER, exist_ok=True)

#     register_routes(app)
#     return app

def create_app(media_folder):
    app = Flask(__name__)

    app.config["MEDIA_FOLDER"] = media_folder
    register_routes(app)
    return app
