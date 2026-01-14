import os
from pathlib import Path

PORT = 9090

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_FOLDER = BASE_DIR / 'media'
os.makedirs(MEDIA_FOLDER, exist_ok = True)

SUPPORTED_EXTENSIONS = {
    'image': ('.jpg', '.jpeg', '.png', '.bmp', '.svg'),
    'animated_image': ('.gif', '.webp', '.apng', '.avif'),
    'video': ('.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.m3u8')
}
