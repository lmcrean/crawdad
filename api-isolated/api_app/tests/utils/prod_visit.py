import requests
from requests.exceptions import ConnectionError, Timeout

# Old Heroku URL - testing if this still works
# PROD_URL = "https://antelope-api-isolate-8beb50b26a2a.herokuapp.com"

# New Vercel URL
PROD_URL = "https://crawdad-dt442vy7v-lmcreans-projects.vercel.app"

def visit_prod_endpoint(endpoint: str = "/", auth_cookie: str = None) -> requests.Response:
    """
    Visit a production endpoint and return the response.
    
    Args:
        endpoint (str): The endpoint to visit, defaults to root "/"
        auth_cookie (str): Optional auth cookie for Vercel protection
    
    Returns:
        requests.Response: The response from the production server
    """
    # Ensure endpoint starts with /
    if not endpoint.startswith("/"):
        endpoint = f"/{endpoint}"
        
    url = f"{PROD_URL}{endpoint}"
    
    try:
        headers = {}
        if auth_cookie:
            headers['Cookie'] = f'_vercel_jwt={auth_cookie}'
            
        response = requests.get(url, timeout=10, headers=headers)
        return response
    except (ConnectionError, Timeout) as e:
        # If the API is not yet deployed or is unreachable, return a mock response
        # This is helpful during the deployment transition
        class MockResponse:
            def __init__(self):
                self.status_code = 503
                self.content = b'{"error": "API not available"}'
                
            def json(self):
                return {"error": "API not available"}
                
        return MockResponse()

