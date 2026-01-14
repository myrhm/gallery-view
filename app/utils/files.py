
def format_file_size(bytes_size):
    for unit in ['B', 'KB', 'MB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f}{unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f}GB"
