### **Routes**

- #### `POST /users` - Create an user
**Requires a body** like: 
```json
{
  "email": "teste@teste.com",
  "password": "senhaSuperSecreta"
}
```
Response is the data of the created user. Response example:
```json
{
  "email": "teste@teste.com",
  "password": "$2b$12$5/NLktLnnai3BV/eMuZzAOl34hSh2VzCRTTlQPNfD7463lMH1P702",
  "id": 1,
  "createdAt": "2022-01-26T09:42:14.507Z"
}
```

- #### `POST /auth/sign-in` - Create a session
**Requires a body** like: 
```json
{
  "email": "teste@teste.com",
  "password": "senhaSuperSecreta"
}
```
Response is the data of the created session. Response example:
```json
{
  "user": {
    "id": 1,
    "email": "teste@teste.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0MzE5MDU2MX0.Zi2cU6NlaKML1xvCkZAfgUJKxXYGnWG4o7R1vVow4bk"
}
```

- #### `POST /enrollments` - Create or Update user information
**Requires a body** like: 
```json
{
  "name": "Zezinho Da Silva",
  "cpf": "424.474.010-43",
  "birthday": "20-02-1991",
  "address": {
    "cep": "04648-285",
    "street": "Rua Xapanã",
    "city": "São Paulo",
    "number": "101",
    "state": "SP",
    "neighborhood": "Jardim Los Angeles",
    "addressDetail": "Casa amarela" // nullable
  },
  "phone": "(11) 3322-1100" // Also accepts (XX) 9XXXX-XXXX
}
```
and a **Bearer token** on Authorization header. <br>
Response is a status code 200.

- #### `GET /enrollments` - Read user information
**Requires a Bearer token** on Authorization header. <br>
Response is the user data of the current session. Response example:
```json
{
  "id": 1,
  "name": "Zezinho Da Silva",
  "cpf": "424.474.010-43",
  "birthday": "20-02-1991",
  "phone": "(11) 3322-1100",
  "userId": 1,
  "address": {
    "id": 1,
    "cep": "04648-285",
    "street": "Rua Xapanã",
    "city": "São Paulo",
    "number": "101",
    "state": "SP",
    "neighborhood": "Jardim Los Angeles",
    "addressDetail": "Casa amarela",
    "enrollmentId": 1
  }
}
```

- #### `POST /accounts` - Create an account
**Requires a body** like: 
```json
{
  "number": "21184-4",
  "agency": "5706"
}
```
, a **Bearer token** on Authorization header and the user must have created a enrollment. <br>
Response is the user data of the current session. Response example:
```json
{
  "id": 1,
  "number": "21184-4",
  "agency": "5706",
  "balance": "0.00",
  "createdAt": "2022-01-26T13:08:26.443Z",
  "userId": 1
}
```

- #### `GET /accounts` - List user accounts
**Requires a Bearer token** on Authorization header. <br>
Response the list of accounts of the current session. Response example:
```json
[
  {
    "id": 2,
    "number": "21184-4",
    "agency": "5706",
    "balance": 0,
    "createdAt": "2022-01-26T13:08:26.443Z",
    "userId": 2
  },
  {
    "id": 3,
    "number": "98344-6",
    "agency": "5706",
    "balance": 0,
    "createdAt": "2022-01-26T13:44:35.746Z",
    "userId": 2
  }
]
```

- #### `GET /accounts/:accountId` - Read user account
**Requires a Bearer token** on Authorization header. <br>
Response the account data if it pertences the current session. Response example:
```json
{
  "id": 2,
  "number": "21184-4",
  "agency": "5706",
  "balance": 0,
  "createdAt": "2022-01-26T13:08:26.443Z",
  "userId": 2
}
```

- #### `DELETE /accounts/:accountId` - Delete an account
**Requires a Bearer token** on Authorization header and the account must have null balance. <br>
Response is a status code 200.

- #### `POST /transactions/deposit` - Deposit on an account
**Requires a body** like: 
```json
{
  "value": 0.01,
  "targetAccount": {
    "number": "21184-4",
    "agency": "5706"
  }
}
```
Response is the transaction record generated. Response example:
```json
{
  "description": "Deposit",
  "value": 0.01,
  "accountId": 2,
  "id": 5,
  "createdAt": "2022-01-27T09:07:45.214Z"
}
```

- #### `POST /transactions/withdraw` - Withdraw from an account
**Requires a body** like: 
```json
{
  "value": 2.01,
  "targetAccount": {
    "number": "21184-4",
    "agency": "5706"
  }
}
```
, a **Bearer token** on Authorization header and the account must have enough balance.
Response is the transaction record generated. Response example:
```json
{
  "description": "Withdraw",
  "value": -2.01,
  "accountId": 2,
  "id": 7,
  "createdAt": "2022-01-27T09:46:33.448Z"
}
```

- #### `POST /transactions/transfer/:userAccountId` - Transfer from user account to another account
**Requires a body** like: 
```json
{
  "value": 5.50,
  "targetAccount": {
    "number": "98344-6",
    "agency": "5706"
  }
}
```
, a **Bearer token** on Authorization header and the user account must have enough balance.
Response is the transaction record generated. Response example:
```json
{
  "description": "Transfer to 5706 98344-6",
  "value": -5.5,
  "accountId": 2,
  "id": 8,
  "createdAt": "2022-01-28T05:25:11.659Z"
}
```

## How to run
1. Clone this repository
2. Install all dependencies
```bash
npm i
```
3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env` file using the `.env.example` file
5. Run all migrations
```bash
npm run migration:run
```
6. Run the back-end in a development environment:
```bash
npm run dev
```
7. Or build it and run it in production environment:
```bash
npm run build
npm start
```

## npm scripts to make life easier
- `dev`: runs the back-end in development mode, watching file changes (with `npm run dev`). ESLint errors will stop the back-end from running
- `build`: generates the JavaScript version for this project (with `npm run build`). ESLint errors will stop the bundle from being created
- `migration:generate`: generates new migrations from typescript in a single step (with `npm run migration:generate -- -n MigrationName`)
- `migration:run`: runs all pending migrations (with `npm run migration:run`)
- `eslint:fix`: runs eslint fixing everything eslint can automatically fix
- `seed`: runs database seed files in `src/seeders` to populate database automatically (with `npm run seed`). Will prompt which seed files should run
