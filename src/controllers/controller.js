const fs = require('fs').promises;
const { readCSV, isValidString, isValidNumber, writeCSV } = require('../helper/helper');

const getBooks = async (req, res) => {
    try {
      let books = [];
  
      if (req.user.userType === 'admin') {
        books = await readCSV('data/adminUser.csv');
      } else {
        books = await readCSV('data/regularUser.csv');
      }
  
      res.json({ books });
    } catch (error) {
      console.log(error.stack);
      res.status(500).json({ error: error.message });
    }
  };

  const addBook = async (req, res) => {
    if (req.user.userType !== 'admin') return res.sendStatus(403);
  
    const { bookName, author, publicationYear } = req.body;
  
    if (!isValidString(bookName) || !isValidString(author) || !isValidNumber(publicationYear)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
  
    const newBook = `${bookName},${author},${publicationYear}`;
    const books = await readCSV('data/regularUser.csv');
  
    // Check if bookName already exists
    const isBookNameExists = books.some(book => book.bookName === bookName);

    if (isBookNameExists) {
    return res.json(`Book with name ${bookName} already exists.`);
    }

    const newBooks = {
        bookName,
        author,
        publicationYear: Number(publicationYear)
      };
      books.push(newBooks);
  
    fs.appendFileSync('data/regularUser.csv', `\n${newBook}`);
    res.json({ message: 'Book added successfully' });
  };
  

  const deleteBook = async (req, res) => {
    try {
      if (req.user.userType !== 'admin') {
        return res.sendStatus(403);
      }
  
      const { bookName } = req.body;

  
      if (!isValidString(bookName)) {
        return res.status(400).json({ error: 'Invalid parameters' });
      }
    
      const books = await readCSV('data/regularUser.csv');
      const updatedBooks = books.filter((book) => book.bookName.toLowerCase() !== bookName.toLowerCase()); 
      // console.log(updatedBooks);

      fs.unlink('data/regularUser.csv', (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        } 
        // console.log('File deleted successfully.');
      });

      const updatedBooksString = updatedBooks.map(book => Object.values(book).join(',')).join('\n');
      await fs.appendFile('data/regularUser.csv', 'Book Name,Author,Publishing Year\n' + updatedBooksString);

      // console.log('File deleted and updated successfully.');

      res.json({updatedBooks});

    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { getBooks, addBook, deleteBook };
