from api_project.wsgi import application

# This is the handler function that Vercel will use
def handler(request):
    return application(request) 