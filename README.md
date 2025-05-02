# Nano Link - URL Shortener Service

A modern, scalable URL shortener service built with Node.js and NestJS, following Clean Architecture principles.

## 🚀 Features

- 🔐 User authentication with JWT
- 🔗 URL shortening with custom aliases
- 📊 Click tracking
- 👤 User-specific URL management
- 🛡️ Input validation and error handling
- 📝 API documentation with Swagger
- 🧪 Unit tests
- 🐳 Docker support

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
- **Testing**: Jest
- **Containerization**: Docker

## 🏗️ Architecture

The project follows Clean Architecture principles with the following structure:

```
src/
├── core/                  # Core business logic
│   ├── domain/            # Domain entities and interfaces
│   ├── use-cases/         # Application use cases
│   └── errors/            # Custom error handling
├── infrastructure/        # External concerns
│   ├── database/          # Database configuration
│   ├── auth/              # Authentication
│   └── config/            # Environment configuration
├── interface/             # Presentation layer
│   ├── controllers/       # Controllers
│   ├── dtos/              # DTOs
│   └── middlewares/       # Middlewares
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

4. Configure your environment variables in `.env`:
```env
API_PORT=3030                       #your api port
API_DOMAIN=http://localhost:3030    #your api domain, used to redirect short urls
JWT_SECRET=secretKey                #Secret key for JWT
DB_HOST=localhost                   #your database host
DB_PORT=5432                        #your database port
DB_USERNAME=admin                   #your database user
DB_PASSWORD=secret                  #your database password
DB_NAME=nano_link                   #your database name
DB_LOGGING=true                     #set to logging DB transactions
DB_TYPEORM_SYNC=true                #Set to synchronizing indicates whether the database schema should be automatically created on every application launch
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
| `API_DOMAIN` | Domain, used to redirect short urls | http://localhost:{API_PORT} |
| `DB_HOST` | Postgres DB host | localhost |
| `DB_PORT` | Postgres DB port | 5432 |
| `DB_USERNAME` | Postgres DB username | admin |
| `DB_PASSWORD` | Postgres DB password | secret |
| `DB_NAME` | Postgres DB name | nano_link |
| `DB_LOGGING` | Logger DB transactions (true/false) | true |
| `DB_TYPEORM_SYNC` | Set to synchronizing indicates whether the database schema should be automatically created on every application launch (true/false) | false |
| `NODE_ENV` | Environment (development/production) | development |

## 📈 Scaling Considerations

The system is designed for vertical scaling. Key considerations for horizontal scaling:

1. **Database**: Implement read replicas and connection pooling
2. **Caching**: Add Redis for caching frequently accessed URLs
3. **Load Balancing**: Use a load balancer for distributing traffic
4. **Monitoring**: Implement comprehensive monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any questions or suggestions, please open an issue in the repository.
