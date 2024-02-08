const csv = require('csv-parser');
const fs = require('fs');
const fsPromises = require('fs').promises;

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const books = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => {
        const book = {
          bookName: row['Book Name'],
          author: row['Author'],
          publicationYear: parseInt(row['Publication Year'])
        };
        books.push(book);
      })
      .on('end', () => { 
        resolve(books);
        // console.log(books);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};


async function writeCSV(filePath, header, data) {
  try {
    const rows = data.map(item => Object.values(item).join(','));
    const content = [header.join(','), ...rows].join('\n');
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw error;
  }
}



const isValidString = (value) => typeof value === 'string' && value.trim() !== '';
const isValidNumber = (value) => !isNaN(value) && parseInt(value) === parseFloat(value);

module.exports = { readCSV, writeCSV, isValidString, isValidNumber };
