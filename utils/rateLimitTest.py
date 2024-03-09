import requests
import time

# Define the API endpoint
url = 'http://localhost:3000/api/users/login'

# Define the login credentials
email = 'test@example.com'
password = 'your_password'

# Create the request body
count = 0
payload = {
    'email': email,
    'password': password
}

# Send multiple POST requests within a short period
for _ in range(110):
    response = requests.post(url, json=payload)
    print(count,': Response Status Code:', response.status_code)
    print('Response Content:', response.json())
    count += 1
    time.sleep(0.2)  # Sleep for 0.2 seconds between each request
