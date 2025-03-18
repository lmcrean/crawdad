import os
import sys

# Add the project directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api_project.wsgi import application

# Handler for Vercel serverless function
def handler(request, *args, **kwargs):
    return application(request, *args, **kwargs) 