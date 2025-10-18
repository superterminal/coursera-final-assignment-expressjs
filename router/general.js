const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Add new user to the users array
  users.push({username: username, password: password});
  
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const book = Object.values(books).filter(book => book.author === author);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book = Object.values(books).filter(book => book.title === title);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get the list of books available in the shop using async-await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    // Simulate an async operation with Axios (could be an external API call)
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // Return the books data along with the external API response
    const result = {
      books: books,
      externalData: response.data,
      message: "Books retrieved successfully using async-await with Axios"
    };
    
    return res.status(200).json(result);
  } catch (error) {
    // If external API fails, still return the books data
    console.error('External API error:', error.message);
    return res.status(200).json({
      books: books,
      message: "Books retrieved successfully (external API unavailable)"
    });
  }
});

// Alternative implementation using Promise callbacks
public_users.get('/promise-books', function (req, res) {
  // Using Promise-based approach with Axios
  axios.get('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => {
      const result = {
        books: books,
        externalData: response.data,
        message: "Books retrieved successfully using Promise callbacks with Axios"
      };
      return res.status(200).json(result);
    })
    .catch(error => {
      console.error('External API error:', error.message);
      return res.status(200).json({
        books: books,
        message: "Books retrieved successfully (external API unavailable)"
      });
    });
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/async-books/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
    
    // Simulate an async operation with Axios (could be an external API call for additional book info)
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${isbn}`);
    
    // Return the book data along with the external API response
    const result = {
      book: book,
      externalData: response.data,
      message: "Book details retrieved successfully using async-await with Axios"
    };
    
    return res.status(200).json(result);
  } catch (error) {
    // If external API fails, still return the book data
    console.error('External API error:', error.message);
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
    
    return res.status(200).json({
      book: book,
      message: "Book details retrieved successfully (external API unavailable)"
    });
  }
});

// Alternative implementation using Promise callbacks for ISBN lookup
public_users.get('/promise-books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Using Promise-based approach with Axios
  axios.get(`https://jsonplaceholder.typicode.com/posts/${isbn}`)
    .then(response => {
      const result = {
        book: book,
        externalData: response.data,
        message: "Book details retrieved successfully using Promise callbacks with Axios"
      };
      return res.status(200).json(result);
    })
    .catch(error => {
      console.error('External API error:', error.message);
      return res.status(200).json({
        book: book,
        message: "Book details retrieved successfully (external API unavailable)"
      });
    });
});

// Get book details based on Author using async-await with Axios
public_users.get('/async-books/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length === 0) {
      return res.status(404).json({message: "No books found by this author"});
    }
    
    // Simulate an async operation with Axios (could be an external API call for additional author info)
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${author.length}`);
    
    // Return the books data along with the external API response
    const result = {
      books: booksByAuthor,
      externalData: response.data,
      message: "Books by author retrieved successfully using async-await with Axios"
    };
    
    return res.status(200).json(result);
  } catch (error) {
    // If external API fails, still return the books data
    console.error('External API error:', error.message);
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length === 0) {
      return res.status(404).json({message: "No books found by this author"});
    }
    
    return res.status(200).json({
      books: booksByAuthor,
      message: "Books by author retrieved successfully (external API unavailable)"
    });
  }
});

// Alternative implementation using Promise callbacks for Author lookup
public_users.get('/promise-books/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({message: "No books found by this author"});
  }
  
  // Using Promise-based approach with Axios
  axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${author.length}`)
    .then(response => {
      const result = {
        books: booksByAuthor,
        externalData: response.data,
        message: "Books by author retrieved successfully using Promise callbacks with Axios"
      };
      return res.status(200).json(result);
    })
    .catch(error => {
      console.error('External API error:', error.message);
      return res.status(200).json({
        books: booksByAuthor,
        message: "Books by author retrieved successfully (external API unavailable)"
      });
    });
});

// Get book details based on Title using async-await with Axios
public_users.get('/async-books/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length === 0) {
      return res.status(404).json({message: "No books found with this title"});
    }
    
    // Simulate an async operation with Axios (could be an external API call for additional title info)
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?title=${title.length}`);
    
    // Return the books data along with the external API response
    const result = {
      books: booksByTitle,
      externalData: response.data,
      message: "Books by title retrieved successfully using async-await with Axios"
    };
    
    return res.status(200).json(result);
  } catch (error) {
    // If external API fails, still return the books data
    console.error('External API error:', error.message);
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length === 0) {
      return res.status(404).json({message: "No books found with this title"});
    }
    
    return res.status(200).json({
      books: booksByTitle,
      message: "Books by title retrieved successfully (external API unavailable)"
    });
  }
});

// Alternative implementation using Promise callbacks for Title lookup
public_users.get('/promise-books/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  
  if (booksByTitle.length === 0) {
    return res.status(404).json({message: "No books found with this title"});
  }
  
  // Using Promise-based approach with Axios
  axios.get(`https://jsonplaceholder.typicode.com/posts?title=${title.length}`)
    .then(response => {
      const result = {
        books: booksByTitle,
        externalData: response.data,
        message: "Books by title retrieved successfully using Promise callbacks with Axios"
      };
      return res.status(200).json(result);
    })
    .catch(error => {
      console.error('External API error:', error.message);
      return res.status(200).json({
        books: booksByTitle,
        message: "Books by title retrieved successfully (external API unavailable)"
      });
    });
});

module.exports.general = public_users;
