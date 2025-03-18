from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging
import django.db

logger = logging.getLogger(__name__)

@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint that verifies database connection
    """
    response_data = {
        "status": "unhealthy",
        "message": "",
        "database_connected": False,
        "database_configured": bool(settings.DATABASES['default']['NAME'] != 'db.sqlite3')
    }
    
    try:
        # Checking if we can connect to the database
        with django.db.connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
            
        # If we got here, the connection is working
        response_data.update({
            "status": "healthy",
            "message": "API is connected to PostgreSQL RDS",
            "database_connected": True
        })
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error checking database health: {str(e)}")
        response_data["message"] = f"Error connecting to database: {str(e)}"
        return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 