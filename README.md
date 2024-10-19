# Competitive SuperTux - CSTUX 

## Development

### Admin Dashboard

If you haven't already installed bun, go to [bun](https://bun.sh) and follow the instructions to install it.

To setup the admin dashboard, run the following commands:

```bash
git clone https://github.com/GLUA-UA/cstux
cd cstux/admin_dashboard
git checkout dev
bun install
```

Then create a .env file in the admin_dashboard directory with the following content:

```bash
URL=http://localhost:3000
```

To start the admin dashboard (available at `http://localhost:3000`) run the following command:

```bash
bun run dev
```

These are useful commands for the database:

```bash
bun prisma migrate dev # sync the database with the models / initialize the database
bun prisma seed # reset the database and seed it with the data in the seed file
bun prisma studio # open the prisma studio to see the database
```

## Dashboard API Documentation

The base URL for all endpoints in development mode is: `http://localhost:3000`

---

### **/api/users**
#### **GET**
- **Description**: Fetches a list of all users from the database.
- **Response**: Returns a JSON array containing user data.
- **Status Codes**:
  - 200: Success
  - 500: Internal Server Error

#### **POST**
- **Description**: Creates a new user with a unique access code.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: Returns the created user object.
- **Status Codes**:
  - 201: User created successfully
  - 500: Internal Server Error

#### **DELETE**
- **Description**: Deletes a user based on their ID.
- **Request Body**:
  ```json
  {
    "id": "user_id"
  }
  ```
- **Response**: A success message if the user is deleted.
- **Status Codes**:
  - 200: User deleted
  - 500: Internal Server Error

---

### **/api/users/sign-in**
#### **POST**
- **Description**: Signs in a user using their unique access code and increments their login count.
- **Request Body**:
  ```json
  {
    "accessCode": "ABCDEF"
  }
  ```
- **Response**: Returns the user data if the access code is valid.
- **Status Codes**:
  - 200: Success
  - 404: User not found
  - 500: Internal Server Error

---

### **/api/submit**
#### **POST**
- **Description**: Submits a user's level data (time and coins collected).
- **Request Body**:
  ```json
  {
    "accessCode": "ABCDEF",
    "levelInfo": {
      "levelId": "level_id.stl",
      "time": "3.14159",
      "coins": "420.0"
    }
  }
  ```
- **Response**: Returns the created level entry for the user.
- **Status Codes**:
  - 200: Success
  - 404: User not found
  - 500: Internal Server Error

---

### **/api/state/[state]**

List of avaliablle states:

- `tournamentStarted`, type `boolean`, default `false`

#### **GET**
- **Description**: Fetches the value of a specific state by its name.
- **URL Parameters**:
  - `state`: The name of the state to fetch.
- **Response**: Returns the state data.
- **Status Codes**:
  - 200: Success
  - 404: State not found
  - 500: Internal Server Error

#### **PATCH**
- **Description**: Updates the value of a specific state.
- **URL Parameters**:
  - `state`: The name of the state to update.
- **Request Body**:
  ```json
  {
    "state": "new_value"
  }
  ```
- **Response**: Returns the updated state data.
- **Status Codes**:
  - 200: Success
  - 400: Type mismatch
  - 404: State not found
  - 500: Internal Server Error

---

### **/api/levels**
#### **GET**
- **Description**: Retrieves a list of all levels.
- **Response**: Returns a JSON array containing level data.
- **Status Codes**:
  - 200: Success
  - 500: Internal Server Error

---