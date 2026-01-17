from app.config import SUPPORTED_EXTENSIONS
from PIL import Image, UnidentifiedImageError

def is_animated_image(filepath: str) -> bool:
    try:
        with Image.open(filepath) as img:
            return getattr(img, "is_animated", False)
    except (UnidentifiedImageError, OSError):
        return False

def format_file_size(bytes_size):
    for unit in ['B', 'KB', 'MB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f}{unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f}GB"

def determine_file_type(filepath: str, ext: str) -> str | None:
    if ext in SUPPORTED_EXTENSIONS['animated_image'] or ext in SUPPORTED_EXTENSIONS['image']:
        return 'animated_image' if is_animated_image(filepath) else 'image'

    if ext in SUPPORTED_EXTENSIONS['video']:
        return 'video'

    return None
