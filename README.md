# Pro Schedule

## Project status: In Development

This api focus on schedule services from customers to our users

## How to run

### Create a database 

```bash
docker run --name pro-schedule-postgres \
    -p 5432:5432 \
    -e POSTGRES_DB=referer \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=123 \
    -d postgres:16.2-alpine
```

### Install dependencies

```bash
 npm installation
```

### Rnn migrations

```bash
npm run migration:run
```

### Run project

```bash
 npm run start:dev
```

### Run tests

```bash
 npm run tests
```

## What we have already done in this skeleton

- SWC (fast compiler)
- Fastify
- CORS and Helmet
- Vitest
- Docker Configuration
- Prettier and eslint rules
- Validations
- Exception Handler
- Base recorder (Winston)
- API versioning
- Debug mode in VSCode
- All routes are protected by default
- Health Check with terminus
- Using Passport
- Role validation (Role decorator) // like @Roles(ApplicationRole.ADMIN) in controller
- Github Actions Pipeline for validate tests

# Technologies

- [NodeJS](https://nodejs.org/en/docs)
- [NestJS](https://docs.nestjs.com/)
- [SWC](https://swc.rs/)
- [Vitest](https://vitest.dev/)

# Project Structure

## The project code is all inside src folder and we have three principal folders config, modules, shared

### Config

Here we have config files, like a swagger or a typeorm configs the base structure is like

```bash
    /config
        /env
            index.ts
        /typeorm
            /migrations
            datasource.ts
```

### Modules

Here we have our bussines logic and unit tests modules are contexts of or module and every module have the same structure like

```bash
  /modules
    /contexts
        /create
            /dtos
                request.dto.ts
                response.dto.ts
            /tests
                create.spec.ts
            create.controller.ts
            create.service.ts
    moduleName.module.ts
```

### Shared

We have the common logic of application and shared things like entities and repositories who we can use in any module and de structure is like

```bash
    /shared
        /constants
            apiTags.ts
            index.ts
        /decoratos
            public.decorator.ts
            roles.decorator.ts
            index.ts
        /dtos
            error.dto.ts
            index.ts
```
