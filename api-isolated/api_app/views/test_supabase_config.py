from django.http import JsonResponse
from django.conf import settings
import os

def test_database_config(request):
    """Test view to check database configuration"""
    config = {
        'database_url': 'PostgreSQL RDS',
        'has_connection': settings.DATABASES['default']['NAME'] != 'db.sqlite3',
        'database_name': settings.DATABASES['default']['NAME'],
        'env_file_loaded': bool(os.getenv('DJANGO_SECRET_KEY')),
    }
    return JsonResponse(config) 