# Books API

## Description

**It is build to perform basic CRUD operations using REST API**

## Usage

To test the api routes in Postman, use can use this endpoints

```sh
Base Url: https://books-api-chi.vercel.app/api/books
```

**For all requests set the Content-Type in header as application/json and send data in json format**

## CRUD Operations

 - **To Get All Books**

 Method: **GET**

 Route:  https://books-api-chi.vercel.app/api/books

It will fetches all the books.

- **To Create a New Book**

Method: **POST**

 Route: https://books-api-chi.vercel.app/api/books

It will add new book to existing books.

example data {
"title":"Wings of fire",
"author": "APJ Abdul Kalam",
"publishYear": "2009"}

- **Update Book**

Method: **PUT**

 Route:  https://books-api-chi.vercel.app/api/books/:id

It will update the whole book and return updated book.

- **Delete Book**

Method: **DELETE**

 Route:  https://books-api-chi.vercel.app/api/books/:id

It will delete the whole book.


## SetUp/Installation
 Clone the repository using `git clone https://github.com/sridhar-geek/booksAPI ` 
 and install dependencies using `npm install` command

Create .env file and updates this varaibles with your own connection string.

- MongoDBConnection Url (MONGOURI)
- PORT