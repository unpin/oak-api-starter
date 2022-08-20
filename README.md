## Deno Template Project

This is a template project for Deno's Oak framework with basic CRUD
functionality, Authentication and Authorization.

Functionality

- [x] Basic CRUD functionality
- [x] Basic error handling (404, 500, etc.)
- [ ] Global error handler. See Deno documentation.

Security

- [x] Deny Access to JWT token after password change
- [ ] Options method for supported methods
- [ ] CORS
- [x] Rate Limiting middleware

Authentication

- [x] Basic JWT Authentication
- [x] isAuth middleware
- [ ] Authentication with OAuth

Authorization

- [x] restrictTo middleware
