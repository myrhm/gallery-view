import os
from pathlib import Path
from flask import current_app

PORT = 9090

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_MEDIA_FOLDER = BASE_DIR / 'media-test'

SUPPORTED_EXTENSIONS = {
    'image': ('.jpg', '.jpeg', '.png', '.bmp', '.svg'),
    'animated_image': ('.gif', '.webp', '.apng', '.avif'),
    'video': ('.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.m3u8')
}

def get_media_folder() -> Path:
    return current_app.config["MEDIA_FOLDER"]
