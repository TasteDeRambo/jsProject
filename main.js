const fs = require('fs');
const csv = require('csv-parser');

let zipCodeAges = {};
fs.createReadStream('Police_Arrests.csv')
  .pipe(csv())
  .on('data', (row) => {
    var arLZip = row[Object.keys(row)[8]];
    var Race = row[Object.keys(row)[51]];
    var AgeAtArrestTime = row[Object.keys(row)[39]];
    zipCodes.push(arLZip); 
    if(!(AgeAtArrestTime === (''))){
        arrestAge.push(AgeAtArrestTime);
        if(!zipCodeAges[arLZip]){
          zipCodeAges[arLZip] = [];
      }
      zipCodeAges[arLZip].push(AgeAtArrestTime);
    }
    race.push(Race);//created race array, ages at zip code, zip code array
  })
  
  .on('end', () => {
    let mostArrestZipCode = findMode(zipCodes);//in order to get the ages at a zip code, change zipCodeAges['this part']
    let arrestAgesInZip = zipCodeAges[mostArrestZipCode];// store the ages from the zip code provided in an array
    console.log('The race arrested most is ' + findMode(race));
    console.log('The zip code with the most arrest is ' + mostArrestZipCode);
    console.log('The age with the most arrest is ' + findMode(arrestAge) + ' out of ' + arrestAge.length + ' with the average age of ' + findMean(arrestAge));
    console.log('The age with most arrest in ' + mostArrestZipCode + ' is ' + findMode(arrestAgesInZip) + ' out of ' + arrestAgesInZip.length + ' with the average age in this zip code being ' + findMean(arrestAgesInZip));
    console.log('The "least" dangerous area is ' + findLeastOccurring(zipCodes));
  });
//create arrays that will store the data from line 8 to line 19
  let race = [];
  let zipCodes = [];
  let arrestAge = [];

//math functions 
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
  function findMean(arr) {
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += Number(arr[i]);
    }
    return sum / arr.length;
  }
  function findLeastOccurring(array) {
    let frequency = array.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    let minFrequency = Math.min(...Object.values(frequency));

    let leastOccurring = Object.keys(frequency).filter(key => frequency[key] === minFrequency);

    return leastOccurring;
}