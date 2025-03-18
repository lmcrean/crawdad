import pytest
from django.urls import reverse
from rest_framework import status
from django.test import Client

@pytest.mark.unit
@pytest.mark.django_db
def test_health_check_endpoint(client):
    """Test database health check endpoint"""
    url = reverse('health_check')
    response = client.get(url)
    
    # With a working database connection, we expect a 200 status
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data['status'] == 'healthy'
    assert data['database_connected'] is True
    assert 'API is connected to PostgreSQL RDS' in data['message']

@pytest.mark.unit
@pytest.mark.django_db
def test_health_check_response_structure(client):
    """Test health check response structure"""
    url = reverse('health_check')
    response = client.get(url)
    
    # With a working database connection, we expect a 200 status
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Check that response contains all expected fields
    required_fields = {
        'status',
        'message',
        'database_connected',
        'database_configured'
    }
    
    # Verify all required fields are present
    assert all(field in data for field in required_fields), f"Missing fields: {required_fields - data.keys()}"
    
    # Verify field values in connected state
    assert data['status'] == 'healthy'
    assert isinstance(data['message'], str)
    assert data['database_connected'] is True
    assert isinstance(data['database_configured'], bool) 