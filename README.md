# Gallery-View

*Gallery-View* is a self-hosted media gallery for local network sharing. Built with TypeScript and Flask.

## Features
- Thumbnail generation with local disk caching
- Animated image support with hover preview
- Lightbox viewer with keyboard and swipe navigation
- Async gallery loading (non-blocking render)
- Configurable media folder via CLI

## Dependencies

* [Python >= 3.14](https://www.python.org/downloads/)
* [Node.js >= 20](https://nodejs.org/en/download)

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/myrhm/gallery-view.git
cd gallery-view
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install Python dependencies

**Option A — Poetry (recommended)**
```bash
poetry install --no-root
```

**Option B — pip**
```bash
pip install -r requirements.txt
```

## Usage

### Build frontend assets

```bash
npm run build
```

### Run the app

**With Poetry:**
```bash
npm start
```
> This runs `poetry run python app.py` under the hood.

**With pip/venv:**
```bash
python app.py
```

### Optional: custom media folder

By default, the app looks for a `media/` folder in the project root.  
You can override this via CLI using a **relative** or **absolute** path:

**With pip/venv:**
```
python app.py --media-folder photos
python app.py --media-folder "C:\Users\kamu\Pictures"
```
**With Poetry:**
```
poetry run python app.py --media-folder photos
poetry run python app.py --media-folder "C:\Users\kamu\Pictures"
```
