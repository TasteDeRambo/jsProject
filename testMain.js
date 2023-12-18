const fs = require('fs');
const csv = require('csv-parser');

let zipCodeAges = {};

fs.createReadStream('Police_Arrests.csv')
  .pipe(csv())
  .on('data', (row) => {
    var arLZip = row[Object.keys(row)[8]];
    var AgeAtArrestTime = row[Object.keys(row)[39]];
    
    if(!(AgeAtArrestTime === (''))){
        if(!zipCodeAges[arLZip]){
            zipCodeAges[arLZip] = [];
        }
        zipCodeAges[arLZip].push(AgeAtArrestTime);
    }
  })
  .on('end', () => {
    let mostArrestsZipCode = findMode(Object.keys(zipCodeAges));
    console.log('The zip code with the most arrests is ' + mostArrestsZipCode);
    console.log('The ages in this zip code are ' + zipCodeAges['75201']);
  });
  function findMode(arr) {
    let frequency = {};  // array of frequency.
    let maxFreq = 0;  // holds the max frequency.
    let modes = [];

    for(let i in arr) {
        frequency[arr[i]] = (frequency[arr[i]] || 0) + 1; // increment frequency.

        if(frequency[arr[i]] > maxFreq) { // is this frequency > max so far ?
            maxFreq = frequency[arr[i]];  // update max.
        }
    }

    for(let k in frequency) {
        if(frequency[k] === maxFreq) {
           modes.push(k);
        }
    }

    return modes;
  }