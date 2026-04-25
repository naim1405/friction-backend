# API Documentation

## Overview
This is a Task Management System API built with Express.js, TypeScript, and MongoDB with Prisma ORM.

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Admin Management](#admin-management)
4. [Customer Management](#customer-management)
5. [Tasks](#tasks)
6. [Steps](#steps)
7. [Locations](#locations)
8. [Votes](#votes)
9. [Comments](#comments)
10. [Error Handling](#error-handling)

---

## Authentication

### Login User
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate user with email and password
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User logged in successfully!",
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "ADMIN",
      "accessToken": "jwt_token",
      "refreshToken": "jwt_token"
    }
  }
  ```

### Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Request password reset token
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Password reset link sent to your email"
  }
  ```

### Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Description:** Reset password using token
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "token": "reset_token",
    "newPassword": "newpassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Password reset successfully!"
  }
  ```

### Change Password
- **Endpoint:** `POST /auth/change-password`
- **Description:** Change password for authenticated user
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Request Body:**
  ```json
  {
    "oldPassword": "currentpassword123",
    "newPassword": "newpassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Password changed successfully!"
  }
  ```

### Get Current User
- **Endpoint:** `GET /auth/me`
- **Description:** Get logged-in user information
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User data retrieved successfully!",
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "phone": "+8801234567890",
      "role": "ADMIN"
    }
  }
  ```

### Logout User
- **Endpoint:** `POST /auth/logout`
- **Description:** Logout user and invalidate tokens
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "User logged out successfully!"
  }
  ```

### Get Test Token
- **Endpoint:** `POST /auth/test`
- **Description:** Get test token (SUPER_ADMIN only)
- **Authentication:** Required (SUPER_ADMIN)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Test token generated successfully!",
    "data": {
      "accessToken": "jwt_token"
    }
  }
  ```

---

## User Management

### Create Admin User
- **Endpoint:** `POST /user/admin`
- **Description:** Create a new admin user
- **Authentication:** Required (SUPER_ADMIN)
- **Request Body:**
  ```json
  {
    "password": "password123",
    "admin": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+8801234567890"
    }
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Admin created successfully!",
    "data": {
      "id": "user_id",
      "email": "john@example.com",
      "phone": "+8801234567890",
      "role": "ADMIN"
    }
  }
  ```
- **Validation Rules:**
  - Password: minimum 6 characters
  - Email: valid email format
  - Phone: minimum 11 digits
  - Name: required, non-empty string

### Create Customer User
- **Endpoint:** `POST /user/customer`
- **Description:** Create a new customer user
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "password": "password123",
    "customer": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+8801234567890"
    }
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Customer created successfully!",
    "data": {
      "id": "user_id",
      "email": "jane@example.com",
      "phone": "+8801234567890",
      "role": "ADMIN"
    }
  }
  ```
- **Validation Rules:**
  - Password: minimum 6 characters
  - Email: valid email format, must be unique
  - Phone: minimum 11 digits
  - Name: required, non-empty string

---

## Admin Management

### Get All Admins
- **Endpoint:** `GET /admin`
- **Description:** Get list of all admins with pagination
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Admins retrieved successfully!",
    "data": [
      {
        "id": "admin_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+8801234567890",
        "isDeleted": false,
        "createdAt": "2026-04-25T10:00:00Z",
        "updatedAt": "2026-04-25T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

### Get Admin by ID
- **Endpoint:** `GET /admin/:id`
- **Description:** Get details of a specific admin
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Admin ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Admin retrieved successfully!",
    "data": {
      "id": "admin_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+8801234567890",
      "isDeleted": false,
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```

### Update Admin
- **Endpoint:** `PATCH /admin/:id`
- **Description:** Update admin information
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Admin ID
- **Request Body:** (all fields optional, at least one required)
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "+8801987654321"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Admin updated successfully!",
    "data": {
      "id": "admin_id",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "phone": "+8801987654321",
      "isDeleted": false
    }
  }
  ```
- **Validation Rules:**
  - Email: valid email format (if provided)
  - Phone: minimum 11 digits (if provided)
  - Name: non-empty string (if provided)
  - At least one field must be provided

### Delete Admin
- **Endpoint:** `DELETE /admin/:id`
- **Description:** Soft delete an admin (marks as deleted)
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Admin ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Admin deleted successfully!",
    "data": {
      "id": "admin_id",
      "isDeleted": true
    }
  }
  ```

---

## Customer Management

### Get All Customers
- **Endpoint:** `GET /customer`
- **Description:** Get list of all customers
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Customers retrieved successfully!",
    "data": [
      {
        "id": "customer_id",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+8801234567890",
        "isDeleted": false,
        "createdAt": "2026-04-25T10:00:00Z",
        "updatedAt": "2026-04-25T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

### Get Customer by ID
- **Endpoint:** `GET /customer/:id`
- **Description:** Get details of a specific customer
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Customer ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Customer retrieved successfully!",
    "data": {
      "id": "customer_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+8801234567890",
      "isDeleted": false,
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```

### Update Customer
- **Endpoint:** `PATCH /customer/:id`
- **Description:** Update customer information
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Path Parameters:**
  - `id` (required): Customer ID
- **Request Body:** (all fields optional, at least one required)
  ```json
  {
    "name": "Jane Updated",
    "email": "jane.updated@example.com",
    "phone": "+8801987654321"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Customer updated successfully!",
    "data": {
      "id": "customer_id",
      "name": "Jane Updated",
      "email": "jane.updated@example.com",
      "phone": "+8801987654321",
      "isDeleted": false
    }
  }
  ```

### Delete Customer
- **Endpoint:** `DELETE /customer/:id`
- **Description:** Soft delete a customer (marks as deleted)
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Customer ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Customer deleted successfully!",
    "data": {
      "id": "customer_id",
      "isDeleted": true
    }
  }
  ```

---

## Tasks

### Get All Tasks
- **Endpoint:** `GET /tasks`
- **Description:** Get list of all tasks with optional search and pagination
- **Authentication:** None (Public)
- **Query Parameters:**
  - `searchTerm` (optional): Search in title, description, category
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Tasks retrieved successfully!",
    "data": [
      {
        "id": "task_id",
        "title": "Complete Project",
        "description": "Finish the ongoing project",
        "category": "Work",
        "slug": "complete-project",
        "isPublished": true,
        "createdAt": "2026-04-25T10:00:00Z",
        "updatedAt": "2026-04-25T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

### Get Task by ID
- **Endpoint:** `GET /tasks/:id`
- **Description:** Get details of a specific task with steps
- **Authentication:** None (Public)
- **Path Parameters:**
  - `id` (required): Task ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Task retrieved successfully!",
    "data": {
      "id": "task_id",
      "title": "Complete Project",
      "description": "Finish the ongoing project",
      "category": "Work",
      "slug": "complete-project",
      "isPublished": true,
      "steps": [
        {
          "id": "step_id",
          "title": "Step 1",
          "order": 1,
          "taskId": "task_id"
        }
      ],
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```

### Create Task
- **Endpoint:** `POST /tasks`
- **Description:** Create a new task
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Request Body:**
  ```json
  {
    "title": "Complete Project",
    "description": "Finish the ongoing project",
    "category": "Work",
    "isPublished": true
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Task created successfully!",
    "data": {
      "id": "task_id",
      "title": "Complete Project",
      "description": "Finish the ongoing project",
      "category": "Work",
      "slug": "complete-project",
      "isPublished": true,
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```
- **Validation Rules:**
  - Title: required, minimum 1 character
  - Description: optional
  - Category: optional
  - isPublished: optional (default: false)

### Update Task
- **Endpoint:** `PATCH /tasks/:id`
- **Description:** Update task information
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Task ID
- **Request Body:** (all fields optional, at least one required)
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "category": "Updated Category",
    "isPublished": false
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Task updated successfully!",
    "data": {
      "id": "task_id",
      "title": "Updated Title",
      "description": "Updated description",
      "category": "Updated Category",
      "isPublished": false
    }
  }
  ```

### Delete Task
- **Endpoint:** `DELETE /tasks/:id`
- **Description:** Soft delete a task (sets isPublished to false)
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Task ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Task deleted successfully!",
    "data": {
      "id": "task_id",
      "isPublished": false
    }
  }
  ```

---

## Steps

### Create Step
- **Endpoint:** `POST /steps`
- **Description:** Create a new step for a task
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Request Body:**
  ```json
  {
    "taskId": "task_id",
    "title": "Step 1",
    "description": "First step description",
    "order": 1,
    "estimatedTime": "2 hours",
    "estimatedCost": 100.00,
    "locationId": "location_id"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Step created successfully!",
    "data": {
      "id": "step_id",
      "taskId": "task_id",
      "title": "Step 1",
      "description": "First step description",
      "order": 1,
      "estimatedTime": "2 hours",
      "estimatedCost": 100.00,
      "locationId": "location_id",
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```
- **Validation Rules:**
  - taskId: required, must exist
  - title: required, minimum 1 character
  - order: required, non-negative integer
  - description: optional
  - estimatedTime: optional
  - estimatedCost: optional, non-negative number
  - locationId: optional, must exist if provided

### Get Step by ID
- **Endpoint:** `GET /steps/:id`
- **Description:** Get details of a specific step
- **Authentication:** None (Public)
- **Path Parameters:**
  - `id` (required): Step ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Step fetched successfully!",
    "data": {
      "id": "step_id",
      "taskId": "task_id",
      "title": "Step 1",
      "description": "First step description",
      "order": 1,
      "estimatedTime": "2 hours",
      "estimatedCost": 100.00,
      "locationId": "location_id",
      "task": {
        "id": "task_id",
        "title": "Task Title"
      },
      "location": {
        "id": "location_id",
        "name": "Location Name"
      },
      "comments": [],
      "votes": [],
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```

### Update Step
- **Endpoint:** `PATCH /steps/:id`
- **Description:** Update step information
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Step ID
- **Request Body:** (all fields optional, at least one required)
  ```json
  {
    "title": "Updated Step Title",
    "description": "Updated description",
    "order": 2,
    "estimatedTime": "3 hours",
    "estimatedCost": 150.00,
    "locationId": "new_location_id"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Step updated successfully!",
    "data": {
      "id": "step_id",
      "title": "Updated Step Title",
      "description": "Updated description",
      "order": 2,
      "estimatedTime": "3 hours",
      "estimatedCost": 150.00,
      "locationId": "new_location_id"
    }
  }
  ```

### Delete Step
- **Endpoint:** `DELETE /steps/:id`
- **Description:** Delete a step and its associated comments and votes
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Path Parameters:**
  - `id` (required): Step ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Step deleted successfully!",
    "data": {
      "id": "step_id",
      "message": "Step and associated data deleted"
    }
  }
  ```

---

## Locations

### Get All Locations
- **Endpoint:** `GET /locations`
- **Description:** Get list of all locations with search and pagination
- **Authentication:** None (Public)
- **Query Parameters:**
  - `searchTerm` (optional): Search by name, address, city, country, or type
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Locations retrieved successfully!",
    "data": [
      {
        "id": "location_id",
        "name": "Office Downtown",
        "address": "123 Main Street",
        "city": "New York",
        "country": "USA",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "type": "Office",
        "createdAt": "2026-04-25T10:00:00Z",
        "updatedAt": "2026-04-25T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

### Get Location by ID
- **Endpoint:** `GET /locations/:id`
- **Description:** Get details of a specific location
- **Authentication:** None (Public)
- **Path Parameters:**
  - `id` (required): Location ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Location retrieved successfully!",
    "data": {
      "id": "location_id",
      "name": "Office Downtown",
      "address": "123 Main Street",
      "city": "New York",
      "country": "USA",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "type": "Office",
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```

### Create Location
- **Endpoint:** `POST /locations`
- **Description:** Create a new location
- **Authentication:** Required (SUPER_ADMIN, ADMIN)
- **Request Body:**
  ```json
  {
    "name": "Office Downtown",
    "address": "123 Main Street",
    "city": "New York",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "type": "Office"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Location created successfully!",
    "data": {
      "id": "location_id",
      "name": "Office Downtown",
      "address": "123 Main Street",
      "city": "New York",
      "country": "USA",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "type": "Office",
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```
- **Validation Rules:**
  - name: required, minimum 1 character
  - latitude: required, number
  - longitude: required, number
  - address: optional
  - city: optional
  - country: optional
  - type: optional

---

## Votes

### Create/Update Vote
- **Endpoint:** `POST /votes`
- **Description:** Create a new vote or increment an existing vote for a step
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Request Body:**
  ```json
  {
    "stepId": "step_id",
    "value": 1
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Vote created successfully!",
    "data": {
      "id": "vote_id",
      "stepId": "step_id",
      "userId": "user_id",
      "value": 1,
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```
- **Notes:**
  - If a vote already exists for user on this step, the value is incremented
  - If no vote exists, a new vote is created
  - Value is bounded to >= 0

### Delete Vote
- **Endpoint:** `DELETE /votes`
- **Description:** Delete or decrement a vote for a step
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Request Body:**
  ```json
  {
    "stepId": "step_id"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Vote deleted successfully!",
    "data": {
      "message": "Vote deleted"
    }
  }
  ```
- **Notes:**
  - Decrements vote value by 1
  - If value becomes 0 or negative, vote is deleted from database
  - Only deletes vote for current authenticated user

---

## Comments

### Create Comment
- **Endpoint:** `POST /comments`
- **Description:** Create a new comment on a task
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Request Body:**
  ```json
  {
    "taskId": "task_id",
    "content": "This is a comment on the task"
  }
  ```
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Comment created successfully!",
    "data": {
      "id": "comment_id",
      "taskId": "task_id",
      "userId": "user_id",
      "content": "This is a comment on the task",
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  }
  ```
- **Validation Rules:**
  - taskId: required, must exist
  - content: required, minimum 1 character

### Get Comments
- **Endpoint:** `GET /comments`
- **Description:** Get comments for a specific task
- **Authentication:** None (Public)
- **Query Parameters:**
  - `taskId` (required): Task ID to fetch comments for
  - `tastId` (optional alias): Alternate key accepted for compatibility with clients sending `tastId`
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Example Requests:**
  - `GET /comments?taskId=task_id`
  - `GET /comments?tastId=task_id`
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Comments retrieved successfully!",
    "data": [
      {
        "id": "comment_id",
        "taskId": "task_id",
        "userId": "user_id",
        "content": "This is a comment",
        "user": {
          "id": "user_id",
          "email": "user@example.com",
          "phone": "+8801234567890"
        },
        "createdAt": "2026-04-25T10:00:00Z",
        "updatedAt": "2026-04-25T10:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

### Delete Comment
- **Endpoint:** `DELETE /comments/:id`
- **Description:** Delete a specific comment
- **Authentication:** Required (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Path Parameters:**
  - `id` (required): Comment ID
- **Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Comment deleted successfully!",
    "data": {
      "id": "comment_id",
      "message": "Comment deleted"
    }
  }
  ```

---

## Error Handling

### Error Response Format
All error responses follow this format:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error message",
  "errorDetails": {
    "field": "Field specific error"
  }
}
```