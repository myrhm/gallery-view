from PIL import Image, UnidentifiedImageError

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
