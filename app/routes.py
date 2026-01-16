from flask import send_from_directory, render_template
from app.config import MEDIA_FOLDER
from app.service.media_scan import get_media_files
import os

def register_routes(app):
    @app.route('/')
    def gallery():
        return render_template('gallery.html')

    @app.route('/api/files')
    def get_files():
        try:
            response = get_media_files()
            return jsonify(response)
        except Exception as e:
            print(f"Error in /api/files: {e}")
            return jsonify({'error': str(e)}), 500

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
