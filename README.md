# Northcoders News API

You can access the hosted version of this project here: https://gemmas-news.onrender.com

Project Description: This project is a news site where articles can be posted and commented on. Comments and articles can also be voted on. It allows users to browse articles by topic,vote on comments and view user profiles. The project is built using Node.js, Express, and PostgreSQL.
Before getting started, ensure you have the following installed:

Node.js: Minimum version 22.7
PostgreSQL: Minimum version 9.4

To clone this project to your local machine, run the following command in your terminal:
git clone https://github.com/gemmabaker99/NC-News.git
cd NC-News
Install the dependancies:
npm install
Seed the Database:
npm run seed
You can run the tests using:
npm test

---

To create the environment variables, create a new .env.test file containing PGDATABASE=PGDATABASE=nc_news_test
Then create a new .env.development file containing
PGDATABASE=nc_news
Once these files are created, both databases can be accessed.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
