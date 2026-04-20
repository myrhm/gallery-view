from flask import current_app, send_from_directory, render_template, jsonify, request, abort
# from app.config import MEDIA_FOLDER
from app.service.media_scan import MediaService
import os
from pathlib import Path

media_service = MediaService()

def register_routes(app):
    @app.route('/')
    def gallery():
        return render_template('gallery.html')

    @app.route('/api/files')
    def get_files():
        try:
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 100, type=int)

            response = media_service.get_page_metadata(page, limit)
            return jsonify(response)
        except Exception as e:
            print(f"Error in /api/files: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/media/<filename>')
    def serve_media(filename):
        base: Path = current_app.config["MEDIA_FOLDER"]
        target = (base / filename).resolve()

        if not str(target).startswith(str(base.resolve())):
            abort(403, description="Access denied")

        if not target.exists() or not target.is_file():
            abort(404, description="File not found")

        return send_from_directory(base, filename)

    @app.route('/media/thumbnails/<filename>')
    def serve_thumbnail(filename):
        base: Path = current_app.config["MEDIA_FOLDER"]
        thumb_dir = (base / "thumbnails").resolve()
        target = (thumb_dir / filename).resolve()

        if not str(target).startswith(str(thumb_dir)):
            abort(403, description="Access denied")
        if not target.exists() or not target.is_file():
            abort(404, description="File not found")

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
