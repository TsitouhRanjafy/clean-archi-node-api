# Clean Architecture with Node 

```
├── core/
│   ├── entities/
│   ├── usecases/
│   └── repositories/
├── presentation/
│   ├── controllers/
│   ├── presenters/
│   ├── routers/
│   └── helpers/
├── frameworks/
│   ├── database/
│   ├── web/
│   └── ui/
└── main.ts
```

# docs

- [Medium](https://swoodpartners.medium.com/introduction-aux-principes-de-la-clean-architecture-dans-une-api-nodejs-express-efed8d9d2d03)

# Différence principale entre infrastructure et framework :

- **Infrastructure** : Se concentre sur l'implémentation des dépendances externes (ex. : base de données, services tiers) et sur l'accès aux données, en suivant les interfaces définies dans les use cases ou le core de l'application.
    ```
    infrastructure/
    ├── database/
    │    ├── postgres/
    │    ├── mongodb/
    ├── services/
    │    ├── emailService/
    │    ├── authService/
    ├── repositories/
    │    ├── userRepository/
    ├── messaging/
    │    ├── eventBus/
    ```

- **Framework** : Contient les outils et les technologies qui aident à interagir avec ou mettre en place les services externes, comme les frameworks web, les ORM, et autres bibliothèques.

    ```
    frameworks/
    ├── web/
    │    ├── express/
    │    ├── koa/
    ├── ui/
    │    ├── react/
    ├── database/
    │    ├── typeorm/
    │    ├── mongoose/
    ```