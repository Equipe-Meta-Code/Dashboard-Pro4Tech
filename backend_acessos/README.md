SEQUÊNCIA PARA RODAR O PROJETO

```
cd backend_acessos
```

```
npm install
```

Alterar as credencias do banco de dados no arquivo backend_acessos/src/database/migrations/data-source.ts

```
npm run typeorm -- -d ./src/database/data-source.ts migration:run
```

Vá no arquivo banco em backend_acessos e execute aqueles inserts no banco de dados

```
npm run dev:server
```5t


SEQUÊNCIA PARA CRIAR O PROJETO

Criar o projeto
```
npx typeorm init --name backend_acessos --database mysql
```

Remover essa versão do mysql
```
npm remove mysql
```

Instalar express, cors e mysql2
```
npm install express cors express-async-errors mysql2
```

Instalar as especificações do express e cors
```
npm install @types/express @types/cors ts-node-dev -D
```

Criar a migration Users
```
npm run typeorm migration:create src/database/migrations/CreateUsers
```

Rodar migrations (Se a migration estiver registrada no banco ela não irá ler um novo envio da mesma)
```
npm run typeorm -- -d ./src/database/data-source.ts migration:run
```

Instalar biblioteca para criptografar senha
```
npm install bcryptjs
```

Instalar os tipos da bcryptjs
```
npm install @types/bcryptjs -D
```

Instalar Token
```
npm install jsonwebtoken
```

Instalar os tipos do jsonwebtoken
```
npm install @types/jsonwebtoken -D
```

Site para gerar chave secreta
```
https://www.md5.cz/
niveis_acessos_dashboard
```

Criar a migration Permissions
```
npm run typeorm migration:create src/database/migrations/CreatePermissions
```

Criar a migration Roles
```
npm run typeorm migration:create src/database/migrations/CreateRoles
```

Criar a migration PermissionsRoles
```
npm run typeorm migration:create src/database/migrations/CreatePermissionsRoles
```

Criar a migration UsersRoles
```
npm run typeorm migration:create src/database/migrations/CreateUsersRoles
```

Criar a migration Products
```
npm run typeorm migration:create src/database/migrations/CreateProducts
```

