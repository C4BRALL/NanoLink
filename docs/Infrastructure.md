```
src/
├── core/                  # Domínio central da aplicação
│   ├── domain/            # Entidades e regras de negócio
│   │   ├── entities/      # Entidades da aplicação
│   │   └── interfaces/    # Interfaces e contratos do domínio
│   └── use-cases/         # Casos de uso da aplicação
│
├── infrastructure/        # Implementações externas
│   ├── database/          # Implementações de banco de dados
│   │   ├── models/        # Modelos de dados para ORM
│   │   ├── repositories/  # Implementações de repositórios
│   │   └── migrations/    # Migrações de banco de dados
│   ├── config/            # Configurações de ambiente
│   └── auth/              # Implementações de autenticação
│
├── interface/             # Camada de apresentação 
│   ├── controllers/       # Controllers da API
│   ├── dtos/              # Objetos de transferência de dados
│   └── middlewares/       # Middlewares da API
│
└── main.ts                # Ponto de entrada da aplicação

```bash