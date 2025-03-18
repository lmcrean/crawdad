import pytest
from rest_framework import status
from ..utils.prod_visit import visit_prod_endpoint

@pytest.mark.django_db
@pytest.mark.prod_endpoint
def test_prod_health_check_database_connection():
    """Test health check endpoint in production environment.
    
    Expected behavior:
    - Should return 200 OK
    - Database should be connected
    - All configuration flags should be true
    """
    response = visit_prod_endpoint("/api/health/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data['status'] == 'healthy'
    assert data['database_connected'] is True
    assert data['database_configured'] is True
    assert 'message' in data
    assert 'API is connected to PostgreSQL RDS' in data['message']

@pytest.mark.django_db
@pytest.mark.prod_endpoint
def test_prod_health_check_response_structure():
    """Test health check endpoint response structure.
    
    Verify that the response maintains the correct structure and types
    for the database health check.
    """
    response = visit_prod_endpoint("/api/health/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Response should have all required fields
    required_fields = ['status', 'message', 'database_connected', 'database_configured']
    for field in required_fields:
        assert field in data 