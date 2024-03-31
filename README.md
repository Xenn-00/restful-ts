# Simple RESTful API
This project provides a basic RESTful API built with TypeScript. It demonstrates essential concepts for building secure, well-structured APIs.

# Prerequisites
### install dependencies
```
npm install
```
or ```yarn install``` instead, if you're using yarn
### Compile the project
```
npx tsc
```
### Run
```
npm start
```

# API Endpoints
The API offers two types of endpoints:
### Public endpoints:
These endpoints are accessible without any authentication:
- ```POST /api/v1/users``` Registers a new user (implemented by ```UserController.register```)
- ```POST /api/v1/users/login``` Logs in a user (implemented by ```UserController.login```)
### Private endpoints:
These endpoints require authentication and are protected by a middleware function (authMiddleware). Make sure to implement the logic for generating and validating authentication tokens in your middleware.

- ```GET /api/v1/users/current``` Retrieves information about the currently logged-in user (implemented by ```UserController.get```)
- ```GET /api/v1/users/refresh``` Refreshes an expired authentication token (implemented by ```UserController.refresh```)
- ```PATCH /api/v1/users/current``` Updates the currently logged-in user's information (implemented by ```UserController.update```)
- ```DELETE /api/v1/users/logout``` Logs out the user (implemented by ```UserController.logout```)

#### Contact Management (Private Endpoints):

- ```POST /api/v1/contacts``` Creates a new contact (implemented by ```ContactController.create```)
- ```GET /api/v1/contacts/:contactId``` Retrieves a specific contact by ID (implemented by ```ContactController.get```)
- ```PATCH /api/v1/contacts/:contactId``` Updates a specific contact (implemented by ```ContactController.update```)
- ```DELETE /api/v1/contacts/:contactId``` Deletes a specific contact (implemented by ```ContactController.remove```)
- ```GET /api/v1/contacts``` Searches for all contacts (implemented by ```ContactController.search```)

#### Address Management (Private Endpoints - Nested Routes):

These endpoints manage addresses associated with specific contacts:

- ```POST /api/v1/contacts/:contactId/addresses``` Creates a new address for a contact (implemented by ```AddressController.create```)
- ```GET /api/v1/contacts/:contactId/addresses/:addressId``` Retrieves a specific address for a contact (implemented by ```AddressController.get```)
- ```PATCH /api/v1/contacts/:contactId/addresses/:addressId``` Updates a specific address (implemented by ```AddressController.update```)
- ```DELETE /api/v1/contacts/:contactId/addresses/:addressId``` Deletes a specific address (implemented by ```AddressController.remove```)
- ```GET /api/v1/contacts/:contactId/addresses``` Lists all addresses for a specific contact (implemented by ```AddressController.list```)
  
Note: The :contactId and :addressId parts in some URLs represent path parameters that capture specific IDs for resources.
