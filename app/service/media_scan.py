import os
import threading
from datetime import datetime
from app.config import MEDIA_FOLDER, SUPPORTED_EXTENSIONS
from app.service.thumbnails import extract_first_frame
from app.utils.files import format_file_size
from PIL import Image, UnidentifiedImageError

THUMBNAILS_GENERATING = set()

def determine_file_type(filepath: str, ext: str) -> str | None:
    if ext in SUPPORTED_EXTENSIONS['animated_image'] or ext in SUPPORTED_EXTENSIONS['image']:
        return 'animated_image' if is_animated_image(filepath) else 'image'

    if ext in SUPPORTED_EXTENSIONS['video']:
        return 'video'

    return None

def is_animated_image(filepath: str) -> bool:
    try:
        with Image.open(filepath) as img:
            return getattr(img, "is_animated", False)
    except (UnidentifiedImageError, OSError):
        return False

def get_media_files():
    files = []

    try:
        thumb_dir = os.path.join(MEDIA_FOLDER, "thumbnails")
        os.makedirs(thumb_dir, exist_ok=True)

        for filename in os.listdir(MEDIA_FOLDER):
            filepath = os.path.join(MEDIA_FOLDER, filename)

            name, _ = os.path.splitext(filename)
            thumb_path = os.path.join(thumb_dir, f'{name}.jpg')

            if os.path.isdir(filepath):
                continue

            ext = os.path.splitext(filename)[1].lower()
            file_type = determine_file_type(filepath, ext)

            if file_type == 'animated_image':
                THUMBNAILS_GENERATING.add(filepath)
                thread = threading.Thread(
                    target=extract_first_frame,
                    args=(filepath, thumb_path),
                    daemon=True
                )
                thread.start()

            if file_type is None:
                continue

            stat = os.stat(filepath)
            file_size = stat.st_size
            file_date = datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
            files.append({
                'name': filename,
                'type': file_type,
                'url': f'/media/{filename}',
                'thumbnail_url': f'/media/thumbnails/{name}.jpg',
                'size': format_file_size(file_size),
                'date': file_date
            })
    except Exception as e:
        print(f"Error reading media folder: {e}")

    files.sort(key=lambda x: x['name'].lower())

    return files
