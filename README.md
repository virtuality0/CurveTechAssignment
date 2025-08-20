# Project setup
1. Clone the repository

2. Create a .env file which is basically a copy of .env.example file 

# Mac or Linux users
```
docker compose up --build
```

# Windows
3. Install dependencies

```
pnpm install
```

# 4. DB Setup 

a. Make sure docker desktop is running : 
```
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=curvetech -p 5432:5432 -d

```

OR 

b. Get a db url from neon.tech or avion and paste it in DATABASE_URL field in .env file 

Then : 

```
npx prisma migrate dev 
npx prisma generate 

```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Documentation 

I have used swagger for API documentation so, when the app is running, just visit http://localhost:3000/api to get api documentation 

## File the postman collection in the root folder 

