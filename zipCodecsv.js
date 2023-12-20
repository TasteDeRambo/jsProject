const fs = require('fs');
const csv = require('csv-parser');

// The zip code you're looking for
const targetZipCode = '75201';

fs.createReadStream('uszips.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Check if this row's zip code matches the target
    if (row['zip'] === targetZipCode) {
      console.log('The population of zip code ' + targetZipCode + ' is ' + row['population']);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
