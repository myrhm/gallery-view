from flask import Flask, render_template, send_from_directory
from pathlib import Path
import os
from datetime import datetime
from PIL import Image, UnidentifiedImageError

app = Flask(__name__)
PORT = 9090

MEDIA_FOLDER = os.path.join(os.getcwd(), 'media')
os.makedirs(MEDIA_FOLDER, exist_ok = True)

SUPPORTED_EXTENSIONS = {
    'image': ('.jpg', '.jpeg', '.png', '.bmp', '.svg'),
    'animated_image': ('.gif', '.webp', '.apng', '.avif'),
    'video': ('.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.m3u8')
}

def is_animated_image(filepath: str) -> bool:
    try:
        with Image.open(filepath) as img:
            return getattr(img, "is_animated", False)
    except (UnidentifiedImageError, OSError):
        return False

def determine_file_type(filepath: str, ext: str) -> str | None:
    if ext in SUPPORTED_EXTENSIONS['animated_image'] or ext in SUPPORTED_EXTENSIONS['image']:
        return 'animated_image' if is_animated_image(filepath) else 'image'

    if ext in SUPPORTED_EXTENSIONS['video']:
        return 'video'

    return None

def extract_first_frame(filepath: str, thumb_path: str) -> str:
    try:
        with Image.open(filepath) as img:
            if not getattr(img, 'is_animated', False):
                return False

            img.seek(0)
            img.convert('RGB').save(thumb_path, 'JPEG')
            return True
    except (UnidentifiedImageError, OSError):
        return False

def get_media_files():
    files = []

    try:
        for filename in os.listdir(MEDIA_FOLDER):
            filepath = os.path.join(MEDIA_FOLDER, filename)

            thumb_dir = os.path.join(MEDIA_FOLDER, "thumbnails")
            os.makedirs(thumb_dir, exist_ok=True)

            name, _ = os.path.splitext(filename)
            thumb_path = os.path.join(thumb_dir, f'{name}.jpg')

            if os.path.isdir(filepath):
                continue

            ext = os.path.splitext(filename)[1].lower()
            file_type = determine_file_type(filepath, ext)

            if file_type == 'animated_image':
                extract_first_frame(filepath, thumb_path)

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

def format_file_size(bytes_size):
    for unit in ['B', 'KB', 'MB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f}{unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f}GB"

@app.route('/')
def gallery():
    files = get_media_files()
    return render_template('gallery.html', files=files)

@app.route('/media/<filename>')
def serve_media(filename):
    if '..' in filename or filename.startswith('/'):
        return "Invalid filename", 400

    filepath = os.path.join(MEDIA_FOLDER, filename)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        return "File not found", 404

    if not os.path.abspath(filepath).startswith(os.path.abspath(MEDIA_FOLDER)):
        return "Access denied", 403

    return send_from_directory(MEDIA_FOLDER, filename)

@app.route('/media/thumbnails/<filename>')
def serve_thumbnail(filename):
    if '..' in filename or filename.startswith('/'):
        return "Invalid filename", 400

    thumb_dir = os.path.join(MEDIA_FOLDER, "thumbnails")
    filepath = os.path.join(thumb_dir, filename)

    if not os.path.exists(filepath) or not os.path.isfile(filepath):
        return "File not found", 404

    if not os.path.abspath(filepath).startswith(os.path.abspath(MEDIA_FOLDER)):
        return "Access denied", 403

    return send_from_directory(thumb_dir, filename)

@app.route('/api/stats')
def get_stats():
    files = get_media_files()
    images = [f for f in files if f['type'] == 'image' or f['type'] == 'animated_image']
    videos = [f for f in files if f['type'] == 'video']

    return {
        'total': len(files),
        'images': len(images),
        'videos': len(videos)
    }

if __name__ == '__main__':
    print(f"Media folder: {MEDIA_FOLDER}")
    print(f"Starting server at http://localhost:{PORT}")
    app.run(debug=True, host='0.0.0.0', port=PORT)
