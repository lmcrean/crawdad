# Crawdad API

This is the API component of the Crawdad project, providing RESTful endpoints for the frontend application.

## Deployment Status

The API is currently deployed on Heroku at:
`https://antelope-api-isolate-8beb50b26a2a.herokuapp.com`

This deployment includes:
- Basic API endpoints (`/api/test/`, `/api/health/`)
- PostgreSQL database integration
- CORS configuration for frontend access

### Production Tests

To run production endpoint tests against the deployed API:

```bash
# Run all production tests
python -m pytest api_app/tests/ -m prod_endpoint

# Run specific production tests
python -m pytest api_app/tests/get_api_message/test_prod_endpoint.py
python -m pytest api_app/tests/get_supabase_health/test_prod_endpoint.py
```

## Local Development

1. Clone the repository
2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (copy `.env.local.layout` to `.env.local` and fill in values)
5. Run the development server:
   ```bash
   python manage.py runserver
   ```

## Future Deployment Options

Future deployments might include:
- AWS RDS for the database
- AWS Elastic Beanstalk for the API
- Vercel serverless functions

These options are being explored but are not yet fully implemented. 