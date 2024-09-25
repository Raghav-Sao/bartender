# Bartender Service API

This is a simple Node.js and Express application that simulates a bartender service. The API accepts drink orders, limits preparation based on bartender capacity, and provides idempotent responses for repeated requests.

## Features

- Accepts drink orders from customers.
- Supports two types of drinks: **BEER** and **DRINK**.
- The bartender can prepare:
  - Up to **2 BEERS** at the same time.
  - **1 DRINK** at a time.
- Configurable drink preparation time (default is 5 seconds).
- Idempotent behaviour ensures each customer's order is processed exactly once.
- Logs audit all drink orders.

## Tech Stack

- **Node.js**
- **Express.js**
- **JavaScript**
- No database (in-memory storage)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Raghav-Sao/bartender.git
    ```

2. Navigate into the project directory:

    ```bash
    cd bartender
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. The API will be available at `http://localhost:3000`.

### API Endpoints

#### POST `/order`
Place a drink order for a customer.

- **Request Body**:
  ```json
  {
    "customer": "customer_id",
    "type": "BEER"
  }
  ```
- **Response**::

200 OK: When the order is accepted.

```json
{
  "message": "Order accepted, your drink is being prepared!"
}
```

400 Bad Request: For invalid requests (e.g., missing fields).

```
json
{
  "message": "Invalid customerId."
}
```

429 Too Many Requests: When the bartender is busy.

```json
{
  "message": "Bartender is busy, please try again later."
}
```

Example curl request:

```bash
curl -X POST http://localhost:3000/order -H "Content-Type: application/json" -d '{"customerId": "1", "type": "BEER"}'
```
#### GET `/served`
Retrieve a list of all served drink orders.

- **Response**::

200 OK: Returns the list of served orders.
```json
[
  {
    "customerId": "1",
    "type": "BEER",
    "timestamp": "2024-09-25T12:00:00.000Z"
  }
]
```

Example curl request:

```bash
curl -X GET http://localhost:3000/served
```
#### POST `/config/prepTime` 
Set the drink preparation time.

-**Request Body**::

```json
{
  "prepTime": 10
}
```
- **Response**::

200 OK: When the preparation time is successfully set.
```json
{
  "message": "Preparation time set to 10 seconds"
}
```

400 Bad Request: For invalid preparation time.
```json
{
  "message": "Invalid preparation time"
}
```
- **Example curl request**::


```bash
curl -X POST http://localhost:3000/config/prepTime -H "Content-Type: application/json" -d '{"prepTime": 10}'
```
#### Logging
All actions and errors are logged using Winston, and logs can be found in the logs/app.log file.

#### Assumptions
The application runs in-memory, and there is no persistent storage.
The application runs on a single node.
The bartender prepares drinks in the configured time without further notifications after order acceptance.

## Important Notes

- **Log File**: Currently, the log file is not included in the `.gitignore`. Please be aware that the logs will be tracked in the repository until you decide to add it to the `.gitignore` file.

