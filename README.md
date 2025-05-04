# Nano Link - URL Shortener Service

A modern and scalable URL shortening API built with Node.js and NestJS, following Clean Architecture and SOLID principles.

**🌐 Live Demo:** [https://nanolink-abxk.onrender.com](https://nanolink-abxk.onrender.com)

## 🚀 Features

- 🔐 User authentication with JWT (email and password)
- 🔗 URL shortening (maximum 6 characters)
- 📊 Click counting for each shortened URL
- 👤 URL management by user:
  - Listing URLs with click count
  - Updating destination URL
  - Logical deletion of URLs
- 🛡️ Strict input validation on all endpoints
- 📝 Complete documentation with Swagger/OpenAPI
- 🧪 Unit tests with Jest
- 🐳 Docker support with docker-compose
- 📅 Tracking creation, update, and deletion dates

## 📋 Requirements

- Node.js (v22.15.0 or higher)
- PostgreSQL
- Docker (optional)

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: Zod
- **Testing**: Jest
- **Containerization**: Docker
- **Logging**: Winston
- **Observability**: [Better Stack](https://betterstack.com)

## 🏗️ Architecture

The project follows Clean Architecture and SOLID principles with the following structure:

```
src/
├── core/                  # Core business logic
│   ├── domain/            # Domain entities and interfaces
│   │   ├── entities/      # Domain entities
│   │   ├── repositories/  # Repository interfaces
│   │   └── use-cases/     # Use case interfaces
│   ├── use-cases/         # Use case implementations
│   └── errors/            # Custom error handling
├── infrastructure/        # External concerns
│   ├── database/          # Database configuration
│   ├── auth/              # Authentication
│   ├── config/            # Environment configuration
│   └── documentation/     # Swagger documentation
├── interface/             # Presentation layer
│   ├── controllers/       # Controllers
│   ├── dtos/              # DTOs and validation
│   ├── guards/            # Authentication guards
│   └── error-handling/    # HTTP exception handling
│
└── main.ts                # Application entry point
```

## 🚀 Getting Started

### Prerequisites

1. Install Node.js (v22.15.0 or higher)
2. Install PostgreSQL
3. Install Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/C4BRALL/NanoLink.git
cd nano-link
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in the `.env` file:
```env
API_PORT=3030                                       #your api port
API_DOMAIN=http://localhost:3030                    #your api domain, used to redirect short urls
JWT_SECRET=secretKey                                #Secret key for JWT
JWT_EXPIRES_IN=15m                                  #Expiration time for JWT
DB_HOST=localhost                                   #your database host
DB_PORT=5432                                        #your database port
DB_USERNAME=admin                                   #your database user
DB_PASSWORD=secret                                  #your database password
DB_NAME=nano_link                                   #your database name
DB_LOGGING=true                                     #set to logging DB transactions
DB_TYPEORM_SYNC=true                                #Set to synchronizing indicates whether the database schema should be automatically created on every application launch.
NODE_ENV=development                                #Environment (development/production)	
LOGTAIL_ENDPOINT='https://betterstackdata.com'      #Endpoint provided by the Logtail instance for connection
LOGTAIL_TOKEN='token'                               #Token for authentication with the Logtail instance
```

### Running the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

#### Using Docker
```bash
docker-compose up -d
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:{API_PORT}/api/docs
```

You can also access the live API documentation at:
```
https://nanolink-abxk.onrender.com/api/docs
```

### Main Endpoints

#### 1. Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in and obtain JWT token

#### 2. URLs (Shortening)
- `POST /url/create` - Create a shortened URL (with or without authentication)
- `GET /:shortCode` - Redirect to the original URL and count click

#### 3. URL Management (Requires Authentication)
- `GET /url/all` - List all user's URLs with click count
- `PUT /url/:shortCode` - Update the original URL of a shortened link
- `DELETE /url/:shortCode` - Logically delete a shortened URL

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | Application port | 3030 |
| `JWT_SECRET` | Secret key for JWT | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | 15m |
| `API_DOMAIN` | Domain, used to redirect short URLs | http://localhost:{API_PORT} |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | PostgreSQL user | admin |
| `DB_PASSWORD` | PostgreSQL password | secret |
| `DB_NAME` | Database name | nano_link |
| `DB_LOGGING` | Log DB transactions (true/false) | true |
| `DB_TYPEORM_SYNC` | Automatic schema synchronization (true/false) | false |
| `NODE_ENV` | Environment (development/production) | development |
| `LOGTAIL_TOKEN` | Logtail service token for logging | - |
| `LOGTAIL_ENDPOINT` | Logtail service endpoint | - |

## 📈 Scalability Considerations

The system was initially designed for vertical scaling. Key points for horizontal scaling:

1. **Database**:
   - Implement read replicas to distribute query load
   - Use table partitioning to optimize queries with large volumes of data
   - Implement connection pooling for efficient resource management

2. **Caching**:
   - Add Redis for caching frequently accessed URLs
   - Implement distributed caching to improve latency and reduce database load

3. **Architecture**:
   - Separate services: authentication/IAM and URL shortening
   - Implement asynchronous communication between services with queues (RabbitMQ/Kafka)

4. **Infrastructure**:
   - Load balancing to distribute traffic across instances
   - Auto-scaling to adjust resources according to demand
   - CDN to improve redirection performance

5. **Observability**:
   - Implement comprehensive monitoring (metrics, logs, and tracing)
   - Add health checks to verify service health

## 🔒 Security and Validation

- Strict input validation on all endpoints using Zod
- JWT tokens with expiration for secure authentication
- Protection against unauthorized URL access attempts
- Principle of least privilege: users can only modify their own resources

## 📞 Contact

For questions or suggestions, please open an issue in the repository.
