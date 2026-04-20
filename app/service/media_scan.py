import os
import time
import math
import threading
from datetime import datetime
from typing import List, Dict, Any
from app.config import SUPPORTED_EXTENSIONS, get_media_folder
from app.utils.files import format_file_size, determine_file_type
from app.service.thumbnails import extract_first_frame

THUMBNAILS_GENERATING = set()

class MediaService:
    def __init__(self):
        self._indexed_files: List[Dict[str, any]] = None
        self._images_count_cache: int = None
        self._videos_count_cache: int = None

    def get_page_metadata(self, page: int, limit: int) -> Dict[str, Any]:
        indexed = self._get_indexed_files()

        total = len(indexed)
        total_pages = math.ceil(total/limit) if limit > 0 else 1

        if page < 1:
            page = 1
        if page > total_pages:
            page = total_pages

        offset = (page - 1) * limit
        page_items = indexed[offset:offset + limit]

        self._generate_thumbnails_async_for_items(page_items)

        if (self._images_count_cache is None):
            images_count = len([
                f for f in indexed
                if f['type'] in ('image', 'animated_image')
            ])
        else:
            images_count = self._images_count_cache

        if (self._videos_count_cache is None):
            videos_count = len([
                f for f in indexed
                if f['type'] in ('video')
            ])
        else:
            videos_count = self._videos_count_cache

        return {
            'items': page_items,
            'page': page,
            'limit': limit,
            'total_pages': total_pages,
            'stats': {
                'total': total,
                'images': images_count,
                'videos': videos_count
            }
        }

    def _get_indexed_files(self) -> List[Dict[str, Any]]:
        now = time.time()

        if (self._indexed_files is not None):
            return self._indexed_files

        print(f'[Index] Building Index...')
        indexed = self._scan_and_index_files()

        self._indexed_files = indexed

        return indexed

    def _scan_and_index_files(self):
        folder = get_media_folder()
        files = []

        try:
            thumb_dir = os.path.join(folder, "thumbnails")
            os.makedirs(thumb_dir, exist_ok=True)

            for filename in sorted(os.listdir(folder)):
                filepath = os.path.join(folder, filename)

                if os.path.isdir(filepath):
                    continue

                ext = os.path.splitext(filename)[1].lower()
                file_type = determine_file_type(filepath, ext)

                if file_type is None:
                    continue

                try:
                    stat = os.stat(filepath)
                    file_size = stat.st_size
                    file_date = datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
                except (OSError, ValueError):
                    continue

                # create thumbnail path
                name, _ = os.path.splitext(filename)
                thumb_filename = f'{name}.jpg'
                thumb_path = os.path.join(
                    folder, 'thumbnails', thumb_filename
                )

                files.append({
                    'name': filename,
                    'type': file_type,
                    'url': f'/media/{filename}',
                    'thumbnail_url': f'/media/thumbnails/{thumb_filename}',
                    'size': format_file_size(file_size),
                    'date': file_date,
                    'has_thumbnail': os.path.exists(thumb_path),
                })

        except Exception as e:
            print(f'[Index] Error Scanning: {e}')

        return files

    def _generate_thumbnails_async_for_items(self, items: List[Dict]):
        folder = get_media_folder()

        for item in items:
            # create thumbnail path
            name, _ = os.path.splitext(item['name'])
            thumb_filename = f'{name}.jpg'
            thumb_path = os.path.join(
                folder, 'thumbnails', thumb_filename
            )
            filepath = os.path.join(folder, item['name'])

            if item['type'] == 'animated_image' and not os.path.exists(thumb_path):
                THUMBNAILS_GENERATING.add(os.path.join(filepath))
                thread = threading.Thread(
                    target=extract_first_frame,
                    args=(filepath, thumb_path)
                )
                thread.start()
