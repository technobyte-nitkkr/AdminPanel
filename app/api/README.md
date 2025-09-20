# API Documentation

This folder contains an API wrapper for the actions defined in `app/actions`.
It exposes endpoints that interact with the core business logic, enabling external access via HTTP requests.

- **Purpose:** Decouple API routes from internal logic.
- **Usage:** Import and use these endpoints in your application or with external clients.
- **Structure:** Each file corresponds to a specific action or group of actions.

Keep this folder in sync with updates to `app/actions`.

## Base URL

All API endpoints are available under the `/api` route of your deployed application.
Example: `https://your-app-domain.com/api/{endpoint_path}`

## Available Endpoints

Detailed descriptions of each endpoint, including request and response formats.

---

### Admin Endpoints

#### Category Management

**1. Get All Categories**
   - **Method:** `GET`
   - **Path:** `/api/admin/category`
   - **Description:** Retrieves a list of all administrative categories.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "id": "string",
           "name": "string"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "id": "cat_123",
           "name": "General"
         },
         {
           "id": "cat_456",
           "name": "Technical"
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch categories"
     }
     ```

**2. Add a New Category**
   - **Method:** `POST`
   - **Path:** `/api/admin/category`
   - **Description:** Adds a new administrative category.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "name": "string (required)"
       }
       ```
     - **Example:**
       ```json
       {
         "name": "New Category Name"
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "id": "string",
         "name": "string",
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "id": "cat_789",
         "name": "New Category Name",
         "message": "Category added successfully"
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Category name is required"
     }
     ```

#### Query Management

**1. Delete a Query**
   - **Method:** `PUT` (Note: Typically DELETE method is used for deletion)
   - **Path:** `/api/admin/query`
   - **Description:** Deletes a specific user query. The query ID is expected in the request body.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "id": "string (required, ID of the query to delete)"
       }
       ```
     - **Example:**
       ```json
       {
         "id": "query_abc"
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Query query_abc deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Query not found"
     }
     ```

#### Communication

**1. Send Mail to Multiple Users**
   - **Method:** `POST`
   - **Path:** `/api/admin/mail`
   - **Description:** Sends an email to a list of specified users.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "subject": "string (required)",
         "body": "string (required, HTML or plain text content of the email)",
         "recipients": "string[] (required, array of user emails or IDs)"
       }
       ```
     - **Example:**
       ```json
       {
         "subject": "Important Update",
         "body": "<p>Hello, this is an important update regarding your account.</p>",
         "recipients": ["user1@example.com", "user2@example.com"]
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Mail sent successfully to 2 recipients"
       }
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to send email"
     }
     ```

**2. Send Notification**
   - **Method:** `POST`
   - **Path:** `/api/admin/notification`
   - **Description:** Sends a notification (e.g., push notification, in-app message).
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "title": "string (required)",
         "message": "string (required)",
         "targetUsers": "string[] (optional, array of user IDs or segments; if omitted, might be broadcast)",
         "type": "string (optional, e.g., 'info', 'warning', 'event_update')"
       }
       ```
     - **Example:**
       ```json
       {
         "title": "New Event Scheduled!",
         "message": "Check out the new 'Tech Talk' event happening next week.",
         "targetUsers": ["all"],
         "type": "event_update"
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "notificationId": "string (optional)"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Notification sent successfully",
         "notificationId": "notif_xyz"
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Notification title and message are required"
     }
     ```

#### User Management (Admin)

**1. Update All Users**
   - **Method:** `POST`
   - **Path:** `/api/admin/update-users`
   - **Description:** Performs a bulk update operation on all users (e.g., recalculate points, assign roles). The specific operation depends on the backend implementation of the `updateAllUsers` action.
   - **Request Body:** `application/json` (The body might contain parameters for the update operation)
     - **Schema:** (This is highly dependent on the `updateAllUsers` action)
       ```json
       {
         "operation": "string (required, e.g., 'recalculate_scores')",
         "parameters": "object (optional, parameters for the operation)"
       }
       ```
     - **Example:**
       ```json
       {
         "operation": "archive_inactive_users",
         "parameters": {
           "inactive_days": 90
         }
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "details": "object (optional, details about the update)"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "All users updated successfully",
         "details": {
           "users_affected": 1500,
           "operation_performed": "archive_inactive_users"
         }
       }
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to update all users"
     }
     ```

**2. Update a Specific User**
   - **Method:** `POST` (Note: Typically PUT/PATCH method is used for updates)
   - **Path:** `/api/admin/user`
   - **Description:** Updates details for a specific user. User ID and fields to update are expected in the request body.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "userId": "string (required)",
         "updates": {
           "name": "string (optional)",
           "email": "string (optional)",
           "role": "string (optional)"
           // ... other updatable fields like isActive, etc.
         }
       }
       ```
     - **Example:**
       ```json
       {
         "userId": "user_pqr",
         "updates": {
           "role": "admin",
           "isActive": true
         }
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "user": {
           "id": "string",
           "name": "string",
           "email": "string",
           "role": "string"
           // ... other user fields
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "User user_pqr updated successfully",
         "user": {
           "id": "user_pqr",
           "name": "Updated Name",
           "email": "user.pqr@example.com",
           "role": "admin",
           "isActive": true
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "User not found"
     }
     ```

---

### Techspardha Teams Endpoints

Manages Techspardha team information.

**1. Get All Teams**
   - **Method:** `GET`
   - **Path:** `/api/techspardha-teams`
   - **Description:** Retrieves a list of all Techspardha teams.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "teamName": "string",
           "description": "string",
           "members": [
             { "name": "string", "role": "string", "contact": "string (optional)" }
           ],
           "logoUrl": "string (optional)"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "teamName": "Web Dev Team",
           "description": "Responsible for website development.",
           "members": [
             { "name": "Alice", "role": "Lead Developer", "contact": "alice@example.com" },
             { "name": "Bob", "role": "Frontend Developer" }
           ],
           "logoUrl": "https://example.com/logos/web_dev.png"
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch teams"
     }
     ```

**2. Create a New Team**
   - **Method:** `POST`
   - **Path:** `/api/techspardha-teams`
   - **Description:** Creates a new Techspardha team. Assumes `teamName` is unique. Logo can be uploaded if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "teamName": "string (required)",
         "description": "string (required)",
         "members": [
           { "name": "string (required)", "role": "string (required)", "contact": "string (optional)" }
         ],
         "logoUrl": "string (optional, if providing URL directly instead of uploading file)",
         "logoFile": "file (optional, if uploading a new logo via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "teamName": "AI Mavericks",
         "description": "Exploring the frontiers of AI.",
         "members": [
           { "name": "Charlie", "role": "AI Researcher", "contact": "charlie@example.com" }
         ]
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "team": {
           "teamName": "string",
           "description": "string",
           "members": [
             { "name": "string", "role": "string", "contact": "string (optional)" }
           ],
           "logoUrl": "string (optional)"
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Team 'AI Mavericks' created successfully",
         "team": {
           "teamName": "AI Mavericks",
           "description": "Exploring the frontiers of AI.",
           "members": [
             { "name": "Charlie", "role": "AI Researcher", "contact": "charlie@example.com" }
           ],
           "logoUrl": "https://example.com/logos/ai_mavericks.png"
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Team name and description are required"
     }
     ```

**3. Update a Team**
   - **Method:** `PUT`
   - **Path:** `/api/techspardha-teams`
   - **Description:** Updates an existing Techspardha team. The team to update is identified by `teamName` in the request body. Logo can be updated if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "teamName": "string (required, identifier for the team to update)",
         "description": "string (optional)",
         "members": [
           { "name": "string (required)", "role": "string (required)", "contact": "string (optional)" }
         ],
         "logoUrl": "string (optional, if providing URL directly instead of uploading file)",
         "logoFile": "file (optional, if uploading a new logo via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "teamName": "Web Dev Team",
         "description": "Responsible for all web presence and development.",
         "members": [
            { "name": "Alice", "role": "Team Lead", "contact": "alice@example.com" },
            { "name": "Bob", "role": "Frontend Developer" },
            { "name": "Eve", "role": "Backend Developer" }
         ]
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Create Team response `team` object, plus a message)
     - **Example:**
       ```json
       {
         "message": "Team 'Web Dev Team' updated successfully",
         "team": {
           "teamName": "Web Dev Team",
           "description": "Responsible for all web presence and development.",
           "members": [
             { "name": "Alice", "role": "Team Lead", "contact": "alice@example.com" },
             { "name": "Bob", "role": "Frontend Developer" },
             { "name": "Eve", "role": "Backend Developer" }
           ],
           "logoUrl": "https://example.com/logos/web_dev_updated.png"
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Team 'Web Dev Team' not found"
     }
     ```

**4. Delete a Team**
   - **Method:** `DELETE`
   - **Path:** `/api/techspardha-teams`
   - **Description:** Deletes a Techspardha team.
   - **Request Body:** None
   - **Query Parameters:**
     - `team`: `string` (required) - The name of the team to delete.
     - **Example:** `/api/techspardha-teams?team=AI%20Mavericks`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Team 'AI Mavericks' deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Team 'AI Mavericks' not found"
     }
     ```

**5. Get a Specific Team**
   - **Method:** `GET`
   - **Path:** `/api/techspardha-teams/{team}`
   - **Description:** Retrieves details for a specific Techspardha team by its name (URL-encoded if it contains spaces or special characters).
   - **Request Body:** None
   - **Path Parameters:**
     - `team`: `string` (required) - The name of the team.
     - **Example:** `/api/techspardha-teams/Web%20Dev%20Team`
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Single team object, same structure as in Get All Teams)
     - **Example:**
       ```json
       {
         "teamName": "Web Dev Team",
         "description": "Responsible for website development.",
         "members": [
           { "name": "Alice", "role": "Lead Developer", "contact": "alice@example.com" },
           { "name": "Bob", "role": "Frontend Developer" }
         ],
         "logoUrl": "https://example.com/logos/web_dev.png"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Team 'Web Dev Team' not found"
     }
     ```

---

### Sponsors Endpoints

Manages sponsor information.

**1. Get All Sponsors**
   - **Method:** `GET`
   - **Path:** `/api/sponsors`
   - **Description:** Retrieves a list of all sponsors.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "id": "string",
           "name": "string",
           "category": "string",
           "logoUrl": "string",
           "websiteUrl": "string (optional)",
           "description": "string (optional)"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "id": "sponsor_001",
           "name": "Tech Solutions Inc.",
           "category": "Gold",
           "logoUrl": "https://example.com/logos/tech_solutions.png",
           "websiteUrl": "https://techsolutions.com"
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch sponsors"
     }
     ```

**2. Get Sponsors by Category**
   - **Method:** `GET`
   - **Path:** `/api/sponsors`
   - **Description:** Retrieves a list of sponsors filtered by category. (*Note: The underlying action `getSponsorsByCategory` might need implementation in `app/actions/sponsors.ts` and uncommenting in the API route.*)
   - **Request Body:** None
   - **Query Parameters:**
     - `category`: `string` (required) - The category of sponsors to retrieve.
     - **Example:** `/api/sponsors?category=Gold`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Get All Sponsors)
     - **Example:**
       ```json
       [
         {
           "id": "sponsor_001",
           "name": "Tech Solutions Inc.",
           "category": "Gold",
           "logoUrl": "https://example.com/logos/tech_solutions.png",
           "websiteUrl": "https://techsolutions.com"
         }
       ]
       ```
   - **Error Response (e.g., 404 Not Found if category has no sponsors or 500 if action not implemented):**
     ```json
     {
       "error": "No sponsors found for category 'Gold' or feature not available"
     }
     ```

**3. Create a New Sponsor**
   - **Method:** `POST`
   - **Path:** `/api/sponsors`
   - **Description:** Adds a new sponsor. Logo can be uploaded if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "name": "string (required)",
         "category": "string (required)",
         "websiteUrl": "string (optional)",
         "description": "string (optional)",
         "logoUrl": "string (optional, if providing URL directly instead of uploading file)",
         "logoFile": "file (optional, if uploading a new logo via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "name": "Innovate Corp",
         "category": "Silver",
         "websiteUrl": "https://innovatecorp.com",
         "description": "Supporting innovation in tech."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "sponsor": {
           "id": "string",
           "name": "string",
           "category": "string",
           "logoUrl": "string",
           "websiteUrl": "string (optional)",
           "description": "string (optional)"
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Sponsor 'Innovate Corp' created successfully",
         "sponsor": {
           "id": "sponsor_002",
           "name": "Innovate Corp",
           "category": "Silver",
           "logoUrl": "https://example.com/logos/innovate_corp.png",
           "websiteUrl": "https://innovatecorp.com",
           "description": "Supporting innovation in tech."
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Sponsor name and category are required"
     }
     ```

**4. Update a Sponsor**
   - **Method:** `PUT`
   - **Path:** `/api/sponsors`
   - **Description:** Updates an existing sponsor. The sponsor to update is identified by `id` in the request body. Logo can be updated if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "id": "string (required, identifier for the sponsor to update)",
         "name": "string (optional)",
         "category": "string (optional)",
         "websiteUrl": "string (optional)",
         "description": "string (optional)",
         "logoUrl": "string (optional, if providing URL directly instead of uploading file)",
         "logoFile": "file (optional, if uploading a new logo via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "id": "sponsor_001",
         "category": "Platinum",
         "description": "Premier sponsor for Techspardha."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Create Sponsor response `sponsor` object, plus a message)
     - **Example:**
       ```json
       {
         "message": "Sponsor 'Tech Solutions Inc.' updated successfully",
         "sponsor": {
           "id": "sponsor_001",
           "name": "Tech Solutions Inc.",
           "category": "Platinum",
           "logoUrl": "https://example.com/logos/tech_solutions_updated.png",
           "websiteUrl": "https://techsolutions.com",
           "description": "Premier sponsor for Techspardha."
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Sponsor with id 'sponsor_001' not found"
     }
     ```

**5. Delete a Sponsor**
   - **Method:** `DELETE`
   - **Path:** `/api/sponsors`
   - **Description:** Deletes a sponsor.
   - **Request Body:** None
   - **Query Parameters:**
     - `id`: `string` (required) - The ID of the sponsor to delete.
     - `category`: `string` (required) - The category of the sponsor (used as part of the identifier in the backend action).
     - **Example:** `/api/sponsors?id=sponsor_002&category=Silver`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Sponsor 'sponsor_002' from category 'Silver' deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Sponsor with id 'sponsor_002' in category 'Silver' not found"
     }
     ```

---

### Events Endpoints

Manages event information for Techspardha.

**1. Get All Events**
   - **Method:** `GET`
   - **Path:** `/api/events`
   - **Description:** Retrieves a list of all events.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "eventName": "string",
           "category": "string",
           "description": "string",
           "date": "string (ISO 8601 Date, e.g., YYYY-MM-DD)",
           "time": "string (e.g., HH:MM AM/PM)",
           "venue": "string",
           "teamSizeMin": "number",
           "teamSizeMax": "number",
           "posterUrl": "string (optional)",
           "rulebookUrl": "string (optional)",
           "registrationOpen": "boolean"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "eventName": "CodeSprint",
           "category": "Coding",
           "description": "A competitive programming contest.",
           "date": "2025-10-15",
           "time": "10:00 AM",
           "venue": "Online",
           "teamSizeMin": 1,
           "teamSizeMax": 3,
           "posterUrl": "https://example.com/posters/codesprint.png",
           "registrationOpen": true
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch events"
     }
     ```

**2. Get Events by Category**
   - **Method:** `GET`
   - **Path:** `/api/events`
   - **Description:** Retrieves events filtered by category. (*Note: The underlying action `getEventsByCategory` might need implementation in `app/actions/events.ts` and uncommenting in the API route.*)
   - **Request Body:** None
   - **Query Parameters:**
     - `category`: `string` (required) - The category of events to retrieve.
     - **Example:** `/api/events?category=Coding`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Array of event objects, same structure as in Get All Events)
     - **Example:** (A list of events belonging to the "Coding" category)
   - **Error Response (e.g., 404 Not Found or 500 if action not implemented):**
     ```json
     {
       "error": "No events found for category 'Coding' or feature not available"
     }
     ```

**3. Get a Specific Event**
   - **Method:** `GET`
   - **Path:** `/api/events`
   - **Description:** Retrieves details for a specific event by its name and category. This endpoint uses the `getEventByName` action.
   - **Request Body:** None
   - **Query Parameters:**
     - `category`: `string` (required) - The category of the event.
     - `eventName`: `string` (required) - The name of the event.
     - **Example:** `/api/events?category=Coding&eventName=CodeSprint`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Single event object, same structure as in Get All Events)
     - **Example:**
       ```json
       {
         "eventName": "CodeSprint",
         "category": "Coding",
         "description": "A competitive programming contest.",
         "date": "2025-10-15",
         "time": "10:00 AM",
         "venue": "Online",
         "teamSizeMin": 1,
         "teamSizeMax": 3,
         "posterUrl": "https://example.com/posters/codesprint.png",
         "registrationOpen": true
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event 'CodeSprint' in category 'Coding' not found"
     }
     ```

**4. Create a New Event**
   - **Method:** `POST`
   - **Path:** `/api/events`
   - **Description:** Creates a new event. Poster and/or rulebook can be uploaded if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "eventName": "string (required)",
         "category": "string (required)",
         "description": "string (required)",
         "date": "string (required, ISO 8601 Date, e.g., YYYY-MM-DD)",
         "time": "string (required, e.g., HH:MM AM/PM)",
         "venue": "string (required)",
         "teamSizeMin": "number (required, default 1)",
         "teamSizeMax": "number (required, default 1)",
         "registrationOpen": "boolean (default false)",
         "posterUrl": "string (optional, if providing URL directly)",
         "rulebookUrl": "string (optional, if providing URL directly)",
         "posterFile": "file (optional, if uploading a new poster via multipart/form-data)",
         "rulebookFile": "file (optional, if uploading a new rulebook via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "eventName": "RoboWars",
         "category": "Robotics",
         "description": "Battle of the bots!",
         "date": "2025-10-20",
         "time": "02:00 PM",
         "venue": "Main Auditorium",
         "teamSizeMin": 2,
         "teamSizeMax": 4,
         "registrationOpen": true
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "event": { /* Event object, same structure as in Get All Events */ }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Event 'RoboWars' created successfully",
         "event": {
           "eventName": "RoboWars",
           "category": "Robotics",
           "description": "Battle of the bots!",
           "date": "2025-10-20",
           "time": "02:00 PM",
           "venue": "Main Auditorium",
           "teamSizeMin": 2,
           "teamSizeMax": 4,
           "posterUrl": "https://example.com/posters/robowars.png",
           "registrationOpen": true
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Event name, category, and date are required"
     }
     ```

**5. Update an Event**
   - **Method:** `PUT`
   - **Path:** `/api/events`
   - **Description:** Updates an existing event. The event is identified by `eventName` and `category` in the request body. This endpoint uses the `updateEventByName` action. Poster/rulebook can be updated if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):** (Includes identifier fields and updatable fields)
       ```json
       {
         "eventName": "string (required, identifier)",
         "category": "string (required, identifier)",
         "description": "string (optional)",
         "date": "string (optional, ISO 8601 Date)",
         "time": "string (optional)",
         "venue": "string (optional)",
         "teamSizeMin": "number (optional)",
         "teamSizeMax": "number (optional)",
         "registrationOpen": "boolean (optional)",
         "posterUrl": "string (optional, if providing URL directly)",
         "rulebookUrl": "string (optional, if providing URL directly)",
         "posterFile": "file (optional, if uploading/updating poster via multipart/form-data)",
         "rulebookFile": "file (optional, if uploading/updating rulebook via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "eventName": "CodeSprint",
         "category": "Coding",
         "venue": "CSE Department Lab 1",
         "registrationOpen": false
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Create Event response)
     - **Example:**
       ```json
       {
         "message": "Event 'CodeSprint' updated successfully",
         "event": {
           "eventName": "CodeSprint",
           "category": "Coding",
           "venue": "CSE Department Lab 1",
           "registrationOpen": false
           /* ... other fields ... */
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event 'CodeSprint' in category 'Coding' not found for update"
     }
     ```

**6. Delete an Event**
   - **Method:** `DELETE`
   - **Path:** `/api/events`
   - **Description:** Deletes an event.
   - **Request Body:** None
   - **Query Parameters:**
     - `category`: `string` (required) - The category of the event.
     - `eventName`: `string` (required) - The name of the event.
     - **Example:** `/api/events?category=Robotics&eventName=RoboWars`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Event 'RoboWars' from category 'Robotics' deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event 'RoboWars' in category 'Robotics' not found"
     }
     ```

---

### Event Categories Endpoints

Manages categories for events.

**1. Get All Event Categories**
   - **Method:** `GET`
   - **Path:** `/api/event-categories`
   - **Description:** Retrieves a list of all event categories.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "id": "string",
           "name": "string",
           "description": "string (optional)",
           "iconUrl": "string (optional)"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "id": "evcat_01",
           "name": "Coding",
           "description": "Events related to programming and algorithms."
         },
         {
           "id": "evcat_02",
           "name": "Robotics",
           "iconUrl": "https://example.com/icons/robotics.svg"
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch event categories"
     }
     ```

**2. Get a Specific Event Category**
   - **Method:** `GET`
   - **Path:** `/api/event-categories`
   - **Description:** Retrieves details for a specific event category by its ID.
   - **Request Body:** None
   - **Query Parameters:**
     - `id`: `string` (required) - The ID of the event category.
     - **Example:** `/api/event-categories?id=evcat_01`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Single event category object)
     - **Example:**
       ```json
       {
         "id": "evcat_01",
         "name": "Coding",
         "description": "Events related to programming and algorithms."
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event category with id 'evcat_01' not found"
     }
     ```

**3. Create a New Event Category**
   - **Method:** `POST`
   - **Path:** `/api/event-categories`
   - **Description:** Creates a new event category. Icon can be uploaded if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "name": "string (required)",
         "description": "string (optional)",
         "iconUrl": "string (optional, if providing URL directly)",
         "iconFile": "file (optional, if uploading a new icon via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "name": "Gaming",
         "description": "E-sports and casual gaming events."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "category": {
           "id": "string",
           "name": "string",
           "description": "string (optional)",
           "iconUrl": "string (optional)"
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Event category 'Gaming' created successfully",
         "category": {
           "id": "evcat_03",
           "name": "Gaming",
           "description": "E-sports and casual gaming events.",
           "iconUrl": "https://example.com/icons/gaming.png"
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Event category name is required"
     }
     ```

**4. Update an Event Category**
   - **Method:** `PUT`
   - **Path:** `/api/event-categories`
   - **Description:** Updates an existing event category. The category is identified by `id` in the request body. Icon can be updated if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "id": "string (required, identifier)",
         "name": "string (optional)",
         "description": "string (optional)",
         "iconUrl": "string (optional, if providing URL directly)",
         "iconFile": "file (optional, if uploading a new icon via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "id": "evcat_01",
         "description": "All competitive programming and hackathon events."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Create Event Category response `category` object, plus a message)
     - **Example:**
       ```json
       {
         "message": "Event category 'Coding' updated successfully",
         "category": {
           "id": "evcat_01",
           "name": "Coding",
           "description": "All competitive programming and hackathon events.",
           "iconUrl": "https://example.com/icons/coding_updated.png"
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event category with id 'evcat_01' not found for update"
     }
     ```

**5. Delete an Event Category**
   - **Method:** `DELETE`
   - **Path:** `/api/event-categories`
   - **Description:** Deletes an event category.
   - **Request Body:** None
   - **Query Parameters:**
     - `id`: `string` (required) - The ID of the event category to delete.
     - **Example:** `/api/event-categories?id=evcat_03`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Event category 'evcat_03' deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Event category with id 'evcat_03' not found"
     }
     ```

---

### Lectures Endpoints

Manages guest lectures and talks.

**1. Get All Lectures**
   - **Method:** `GET`
   - **Path:** `/api/lectures`
   - **Description:** Retrieves a list of all scheduled lectures.
   - **Request Body:** None
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       [
         {
           "id": "string",
           "title": "string",
           "speakerName": "string",
           "description": "string",
           "dateTime": "string (ISO 8601 DateTime, e.g., YYYY-MM-DDTHH:mm:ssZ)",
           "venue": "string",
           "imageUrl": "string (optional)"
         }
       ]
       ```
     - **Example:**
       ```json
       [
         {
           "id": "lec_001",
           "title": "The Future of AI",
           "speakerName": "Dr. Eva Core",
           "description": "An insightful talk on upcoming AI trends.",
           "dateTime": "2025-11-05T14:00:00Z",
           "venue": "Seminar Hall A",
           "imageUrl": "https://example.com/images/eva_core_lecture.jpg"
         }
       ]
       ```
   - **Error Response (e.g., 500 Internal Server Error):**
     ```json
     {
       "error": "Failed to fetch lectures"
     }
     ```

**2. Get a Specific Lecture**
   - **Method:** `GET`
   - **Path:** `/api/lectures`
   - **Description:** Retrieves details for a specific lecture by its ID.
   - **Request Body:** None
   - **Query Parameters:**
     - `id`: `string` (required) - The ID of the lecture.
     - **Example:** `/api/lectures?id=lec_001`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Single lecture object)
     - **Example:**
       ```json
       {
         "id": "lec_001",
         "title": "The Future of AI",
         "speakerName": "Dr. Eva Core",
         "description": "An insightful talk on upcoming AI trends.",
         "dateTime": "2025-11-05T14:00:00Z",
         "venue": "Seminar Hall A",
         "imageUrl": "https://example.com/images/eva_core_lecture.jpg"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Lecture with id 'lec_001' not found"
     }
     ```

**3. Create a New Lecture**
   - **Method:** `POST`
   - **Path:** `/api/lectures`
   - **Description:** Schedules a new lecture. Image can be uploaded if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "title": "string (required)",
         "speakerName": "string (required)",
         "description": "string (required)",
         "dateTime": "string (required, ISO 8601 DateTime)",
         "venue": "string (required)",
         "imageUrl": "string (optional, if providing URL directly)",
         "imageFile": "file (optional, if uploading a new image via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "title": "Blockchain Revolution",
         "speakerName": "Mr. Satoshi Nakamoto Jr.",
         "description": "Exploring the impact of blockchain technology.",
         "dateTime": "2025-11-10T11:00:00Z",
         "venue": "Auditorium B"
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "lecture": {
           "id": "string",
           "title": "string",
           "speakerName": "string",
           "description": "string",
           "dateTime": "string",
           "venue": "string",
           "imageUrl": "string (optional)"
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Lecture 'Blockchain Revolution' created successfully",
         "lecture": {
           "id": "lec_002",
           "title": "Blockchain Revolution",
           "speakerName": "Mr. Satoshi Nakamoto Jr.",
           "description": "Exploring the impact of blockchain technology.",
           "dateTime": "2025-11-10T11:00:00Z",
           "venue": "Auditorium B",
           "imageUrl": "https://example.com/images/blockchain_lecture.jpg"
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Lecture title, speaker name, description, dateTime, and venue are required"
     }
     ```

**4. Update a Lecture**
   - **Method:** `PUT`
   - **Path:** `/api/lectures`
   - **Description:** Updates an existing lecture. The lecture is identified by `id` in the request body. Image can be updated if `multipart/form-data` is used.
   - **Request Body:** `application/json` or `multipart/form-data`
     - **Schema (JSON):**
       ```json
       {
         "id": "string (required, identifier for the lecture to update)",
         "title": "string (optional)",
         "speakerName": "string (optional)",
         "description": "string (optional)",
         "dateTime": "string (optional, ISO 8601 DateTime)",
         "venue": "string (optional)",
         "imageUrl": "string (optional, if providing URL directly)",
         "imageFile": "file (optional, if uploading a new image via multipart/form-data)"
       }
       ```
     - **Example (JSON):**
       ```json
       {
         "id": "lec_001",
         "venue": "Main Auditorium (Capacity: 500)",
         "description": "An insightful talk on upcoming AI trends and their ethical implications."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Same as Create Lecture response `lecture` object, plus a message)
     - **Example:**
       ```json
       {
         "message": "Lecture 'The Future of AI' updated successfully",
         "lecture": {
           "id": "lec_001",
           "title": "The Future of AI",
           "speakerName": "Dr. Eva Core",
           "description": "An insightful talk on upcoming AI trends and their ethical implications.",
           "dateTime": "2025-11-05T14:00:00Z",
           "venue": "Main Auditorium (Capacity: 500)",
           "imageUrl": "https://example.com/images/eva_core_lecture_updated.jpg"
         }
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Lecture with id 'lec_001' not found for update"
     }
     ```

**5. Delete a Lecture**
   - **Method:** `DELETE`
   - **Path:** `/api/lectures`
   - **Description:** Deletes a lecture.
   - **Request Body:** None
   - **Query Parameters:**
     - `id`: `string` (required) - The ID of the lecture to delete.
     - **Example:** `/api/lectures?id=lec_002`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Lecture 'lec_002' deleted successfully"
       }
       ```
   - **Error Response (e.g., 404 Not Found):**
     ```json
     {
       "error": "Lecture with id 'lec_002' not found"
     }
     ```

---

### Users Endpoints

Manages user-specific actions like event registration and queries. These endpoints typically operate in the context of the authenticated user, unless specified otherwise (e.g., for admin actions).

**1. Get User's Registered Events**
   - **Method:** `GET`
   - **Path:** `/api/users`
   - **Description:** Retrieves a list of events the authenticated user is registered for. If an admin makes the request with a `userId` query parameter, it can fetch events for that specific user.
   - **Request Body:** None
   - **Query Parameters:**
     - `userId`: `string` (optional) - ID of the user to fetch events for. Typically used by an admin. If omitted, defaults to the authenticated user.
     - **Example:** `/api/users` (for current user) or `/api/users?userId=user_abc` (for a specific user by admin)
   - **Successful Response (200 OK):**
     - **Schema:** `application/json` (Array of Event objects, see Events section for the detailed Event object schema)
       ```json
       [
         {
           "eventName": "CodeSprint",
           "category": "Coding",
           "description": "A competitive programming contest.",
           "date": "2025-10-15",
           "time": "10:00 AM",
           "venue": "Online",
           "teamSizeMin": 1,
           "teamSizeMax": 3,
           "posterUrl": "https://example.com/posters/codesprint.png",
           "registrationOpen": true
         }
         // ... more registered events
       ]
       ```
   - **Error Response (e.g., 401 Unauthorized or 500 Internal Server Error):**
     ```json
     {
       "error": "User not authenticated or failed to fetch user events"
     }
     ```

**2. Register User for an Event**
   - **Method:** `PUT`
   - **Path:** `/api/users`
   - **Description:** Registers the authenticated user for a specified event. An admin might be able to specify a `userId` in the body to register another user.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "eventId": "string (required, ID of the event to register for)",
         "userId": "string (optional, defaults to authenticated user; admin can specify to register another user)"
       }
       ```
     - **Example:**
       ```json
       {
         "eventId": "event_abc123"
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "registrationDetails": {
           "userId": "string",
           "eventId": "string",
           "status": "string (e.g., 'registered', 'waitlisted')"
         }
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Successfully registered for event 'CodeSprint'",
         "registrationDetails": {
           "userId": "user_xyz789",
           "eventId": "event_abc123",
           "status": "registered"
         }
       }
       ```
   - **Error Response (e.g., 400 Bad Request, 404 Event Not Found, 409 Already Registered):**
     ```json
     {
       "error": "Event ID is required, or Event not found/registration closed, or User already registered"
     }
     ```

**3. Unregister User from an Event**
   - **Method:** `PUT`
   - **Path:** `/api/users`
   - **Description:** Unregisters the authenticated user from a specified event. An admin might be able to specify a `userId` in the body.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "eventId": "string (required, ID of the event to unregister from)",
         "userId": "string (optional, defaults to authenticated user; admin can specify for another user)"
       }
       ```
     - **Example:**
       ```json
       {
         "eventId": "event_abc123"
       }
       ```
   - **Query Parameters:**
     - `action`: `string` (required, must be `unregister`)
     - **Example:** `/api/users?action=unregister`
   - **Successful Response (200 OK):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Successfully unregistered from event 'CodeSprint'"
       }
       ```
   - **Error Response (e.g., 400 Bad Request, 404 Event Not Found):**
     ```json
     {
       "error": "Event ID is required, or user not registered for this event"
     }
     ```

**4. Add a Query (Contact/Feedback)**
   - **Method:** `POST`
   - **Path:** `/api/users`
   - **Description:** Allows the authenticated user to submit a query, feedback, or contact message.
   - **Request Body:** `application/json`
     - **Schema:**
       ```json
       {
         "subject": "string (required)",
         "message": "string (required)",
         "userId": "string (optional, defaults to authenticated user; can also be inferred from auth session)",
         "email": "string (optional, if user is not authenticated or for record keeping)"
       }
       ```
     - **Example:**
       ```json
       {
         "subject": "Feedback on RoboWars Event",
         "message": "The event was great, but the live stream had some issues."
       }
       ```
   - **Query Parameters:** None
   - **Successful Response (201 Created):**
     - **Schema:** `application/json`
       ```json
       {
         "message": "string",
         "queryId": "string (ID of the created query)"
       }
       ```
     - **Example:**
       ```json
       {
         "message": "Query submitted successfully. We will get back to you soon.",
         "queryId": "query_def456"
       }
       ```
   - **Error Response (e.g., 400 Bad Request):**
     ```json
     {
       "error": "Subject and message are required for the query"
     }
     ```

---

## Request and Response Format

Most endpoints accept and return JSON data (`application/json`).
File uploads (e.g., logos, posters, icons for teams, sponsors, events, categories, lectures) should generally be sent as `multipart/form-data`. When using `multipart/form-data`, any accompanying JSON-like data (e.g., name, description) should be sent as regular form fields alongside the file(s). The API route handlers are responsible for parsing `FormData` accordingly.

## Authentication

These endpoints typically inherit authentication mechanisms from the Next.js server (e.g., session cookies, JWT tokens in headers). Ensure your application has appropriate authentication and authorization middleware set up to protect these endpoints as needed. Some endpoints may operate on the authenticated user's context by default (e.g., fetching user-specific data, registering for events). For administrative actions, proper role checks should be in place.

## Error Handling

All endpoints aim to return appropriate HTTP status codes to indicate the outcome of the request:

- `200 OK`: The request was successful.
- `201 Created`: The request was successful, and a new resource was created.
- `400 Bad Request`: The server could not understand the request due to invalid syntax or missing parameters (e.g., a required field in the JSON body is missing). The response body should contain details about the error.
- `401 Unauthorized`: Authentication is required and has failed, or it has not yet been provided. The client should authenticate and try again.
- `403 Forbidden`: The authenticated user does not have the necessary permissions to perform the requested action on the resource.
- `404 Not Found`: The requested resource (e.g., a specific event, user, or category) could not be found on the server.
- `409 Conflict`: The request could not be completed due to a conflict with the current state of the resource (e.g., trying to create a resource that already exists with a unique identifier).
- `500 Internal Server Error`: An unexpected condition was encountered on the server that prevented it from fulfilling the request.

Error responses are in JSON format and include an `error` field with a descriptive message.

**Example Error Response (e.g., 400 Bad Request):**
```json
{
  "error": "A descriptive error message explaining what went wrong, e.g., 'eventName is required'."
}
```