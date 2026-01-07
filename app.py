from flask import Flask, render_template, send_from_directory
from pathlib import Path
import os
from datetime import datetime

app = Flask(__name__)
PORT = 9090

MEDIA_FOLDER = os.path.join(os.getcwd(), 'media')
os.makedirs(MEDIA_FOLDER, exist_ok = True)

SUPPORTED_EXTENSIONS = {
    'image': ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'),
    'video': ('.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.m3u8')
}

def get_media_files():
    files = []

    try:
        for filename in os.listdir(MEDIA_FOLDER):
            filepath = os.path.join(MEDIA_FOLDER, filename)

            if os.path.isdir(filepath):
                continue

            ext = os.path.splitext(filename)[1].lower()
            file_type = None

            if ext in SUPPORTED_EXTENSIONS['image']:
                file_type = 'image'
            elif ext in SUPPORTED_EXTENSIONS['video']:
                file_type = 'video'
            else:
                continue

            stat = os.stat(filepath)
            file_size = stat.st_size
            file_date = datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
            files.append({
                'name': filename,
                'type': file_type,
                'url': f'/media/{filename}',
                'size': format_file_size(file_size),
                'date': file_date
            })
    except Exception as e:
        print(f"Error reading media folder: {e}")

    files.sort(key=lambda x: x['name'].lower())

    return files

def format_file_size(bytes_size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f}{unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f}TB"

@app.route('/')
def gallery():
    files = get_media_files()
    return render_template('gallery.html', files=files)

@app.route('/media/<filename>')
def serve_media(filename):
    if '..' in filename or filename.startswith('/'):
        return "Invalid filename", 400

    filepath = os.path.join(MEDIA_FOLDER, filename)

    if not os.path.exist(filepath) or not os.path.isfile(filepath):
        return "File not found", 404

    if not os.path.abspath(filepath).startswith(os.path.abspath(MEDIA_FOLDER)):
        return "Access denied", 403

    return send_from_directory(MEDIA_FOLDER, filename)

@app.route('/api/stats')
def get_stats():
    files = get_media_files()
    images = [f for f in files if f['type'] == 'image']
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
