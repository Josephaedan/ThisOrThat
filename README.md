# This Or That
Project for ThisOrThat application built on NextJS + Prisma with PostgreSQL database. Users will view a website with 2 images and select one of the two options (this or that). An ELO rating system will then be applied to the images so that we can view the ratings of the images.

## Requirements
Install the following programs on your computer:
- [NodeJS](https://nodejs.org/en/)
- [PostgreSQL](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)

## Set Up

### Clone the repo
Clone the repository here by running the following command in your terminal:
```bash
$ git clone https://github.com/DragonHackathon/hotornot.git
```

### Install dependencies
Open the repository in your preferred code editor. In the terminal, install the dependencies of the project by running the following command:
```bash
$ npm install
```

### Set up environment variables
- Rename the .env.example file to .env to set up your local environment variables.
- Based on your own installation of postgreSQL, change the DB_USER and DB_password values according to what you have set it as for your device.
- Ensure that the DATABASE_URL is formatted properly according to the following format: "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
- An example has been provided to you. You may modify the values according to your machine.

### Initialise postgreSQL database
You need to first ensure that postgreSQL is running on your computer. [This guide](https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html) may suffice.

We'll be using Prisma to initialise the database and create the database tables according to the schema provided in schema.prisma.
Run the following command in your terminal:
```bash
$ npx prisma db push
```

Whenever you make any changes to the schema in schema.prisma, you will have to re-generate the prisma client to use in React. 
Run the following command in your terminal whenever schema.prisma is changed:
```bash
$ npx prisma generate
```

## Run Program
Run the following command in your terminal:
```bash
$ npm run dev
```

The server should be running and is accessible on [http://localhost:3000](http://localhost:3000).


You can view the database records on Prisma by running 
```bash
$ npx prisma studio
```
on a separate terminal.
