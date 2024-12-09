# Monos_Markets
# Payment System Backend

This project is a backend implementation for a payment system designed for a business directory mobile app. It allows vendors to register their businesses, manage subscriptions, and process payments.

## Features

- User authentication
- Subscription management (create, update, delete)
- Payment processing with Stripe integration
- PostgreSQL database integration
- Logging with Winston
- Rate limiting and security headers with Helmet
- Unit testing with Jest

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Stripe account (for payment processing)

## Installation

1. Clone the repository:

git clone [https://github.com/GordonGichini/Monos_Markets/payment-module.git]
cd payment-backend


2. Install dependencies:
npm install


3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payment_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=3000


4. Set up the database:
Create a PostgreSQL database and run the following SQL scripts to set up the necessary tables:

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  product_count INTEGER NOT NULL,
  branch_count INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP NOT NULL
);

## Running the Application

To start the server in development mode:

npm run dev

npm run build
npm start

## Running Tests

To run unit tests:
npm test
npm run test:coverage

## API Documentation

### Authentication

- POST /api/auth/login

- Request body: { "email": "[user@example.com](mailto:user@example.com)", "password": "password123" }
- Response: { "token": "JWT_TOKEN" }





### Subscriptions

- POST /api/payments/create-subscription

- Headers: { "Authorization": "Bearer JWT_TOKEN" }
- Request body: { "businessId": "123", "tier": "STARTER", "productCount": 5, "branchCount": 1 }
- Response: Subscription object



- PUT /api/payments/update-subscription/:id

- Headers: { "Authorization": "Bearer JWT_TOKEN" }
- Request body: { "tier": "PRO", "productCount": 15, "branchCount": 2 }
- Response: Updated Subscription object





### Payments

- POST /api/payments/process-payment

- Headers: { "Authorization": "Bearer JWT_TOKEN" }
- Request body: { "subscriptionId": "123", "amount": 10.00 }
- Response: Payment object





## Error Handling

The API uses the following error codes:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Express.js
- Stripe API
- PostgreSQL
- Jest