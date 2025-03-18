import pytest
import requests
from django.urls import reverse
from rest_framework import status
from ..utils.dev_server import dev_server

@pytest.mark.dev_endpoint
def test_dev_health_check(dev_server):
    """Test health check endpoint in dev environment"""
    url = f"{dev_server}/api/health/"
    response = requests.get(url)
    
    # With a working database connection, we expect a 200 status
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify response structure
    assert data['status'] == 'healthy'
    assert data['database_connected'] is True
    assert 'API is connected to PostgreSQL RDS' in data['message']

@pytest.mark.dev_endpoint
def test_dev_config_check(dev_server):
    """Test configuration check in dev environment"""
    url = f"{dev_server}/api/health/"
    response = requests.get(url)
    
    # With a working database connection, we expect a 200 status
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Check database configuration
    assert data['database_configured'] is True
    
    # Additional checks for connected state
    assert data['status'] == 'healthy'
    assert data['database_connected'] is True

@pytest.mark.dev_endpoint
def test_dev_health_check_method_not_allowed(dev_server):
    """Test health check endpoint rejects invalid methods"""
    url = f"{dev_server}/api/health/"
    response = requests.post(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED 