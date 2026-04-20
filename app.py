import argparse
from pathlib import Path

from app.main import create_app
import app.config as config

def resolve_media_folder(cli_value: str | None) -> Path:
    if cli_value:
        return (config.BASE_DIR / cli_value).resolve()
    return config.DEFAULT_MEDIA_FOLDER.resolve()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--media-folder",
        type=str,
    )

    args = parser.parse_args()
    media_folder = resolve_media_folder(args.media_folder)
    media_folder.mkdir(parents=True, exist_ok=True)

    app = create_app(media_folder)
    print("MEDIA_FOLDER =", media_folder)

    app.run(
        debug=True,
        host="0.0.0.0",
        port=config.PORT
    )

if __name__ == "__main__":
    main()
