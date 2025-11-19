# SeenFlix API - Bruno Collection

This Bruno collection contains all the API endpoint tests for the SeenFlix backend.

## Prerequisites

- [Bruno](https://www.usebruno.com/) API client installed
- SeenFlix backend server running on `http://localhost:5000`

## Collection Structure

```
bruno/
├── bruno.json              # Collection configuration
├── environments/
│   └── Local.bru          # Local environment variables
├── Health/
│   ├── Get Root.bru       # Test root endpoint
│   └── Get Health.bru     # Test health check endpoint
└── Auth/
    ├── Register.bru       # User registration
    ├── Login.bru          # User login
    ├── Refresh Token.bru  # Token refresh
    └── Logout.bru         # User logout
```

## How to Use

1. Open Bruno and import this collection by selecting the `bruno` folder
2. Select the "Local" environment
3. Run the requests in the following order for testing:

### Health Checks
- **Get Root**: Verify API is running
- **Get Health**: Check API health status

### Authentication Flow
1. **Register**: Create a new user account
2. **Login**: Authenticate and receive a JWT token (automatically saved to environment)
3. **Refresh Token**: Get a new token using the existing one
4. **Logout**: End the user session

## Environment Variables

The collection uses the following environment variables (defined in `environments/Local.bru`):

- `baseUrl`: The base URL of the API (default: `http://localhost:5000`)
- `authToken`: JWT token from login (automatically set after successful login)

## Tests

Each request includes automated tests that verify:
- Correct HTTP status codes
- Response body structure
- Expected data values
- Error handling

## Notes

- The Login request automatically saves the JWT token to the environment
- The Refresh Token request uses the saved token and updates it with the new one
- All tests are designed to handle both success and error scenarios
