const fs = require('fs');
const csv = require('csv-parser');

let race = [];
let zipCodes = [];
let arrestAge = [];

let zipCodeAges = {};

// Read and parse the 'Police_Arrests.csv' file
fs.createReadStream('Police_Arrests.csv')//https://www.dallasopendata.com/Public-Safety/Police-Arrests/sdr7-6v3j/data_preview
  .pipe(csv())
  .on('data', (row) => {

    var arLZip = row[Object.keys(row)[8]];
    var Race = row[Object.keys(row)[51]];
    var AgeAtArrestTime = row[Object.keys(row)[39]];

    // Add data to arrays
    zipCodes.push(arLZip); 
    race.push(Race);

    if(!(AgeAtArrestTime === '')){
        arrestAge.push(AgeAtArrestTime);

        // If this zip code is not already in the object, add it
        if(!zipCodeAges[arLZip]){
          zipCodeAges[arLZip] = [];
        }

        // Add age to the array for this zip code
        zipCodeAges[arLZip].push(AgeAtArrestTime);
    }
  })
  .on('end', () => {
    let mostArrestZipCode = findMode(zipCodes).join('');
    let arrestAgesInZip = zipCodeAges[mostArrestZipCode];

    console.log('The race arrested most is ' + findMode(race));
    console.log('The zip code with the most arrest is ' + mostArrestZipCode);
    console.log('The age with the most arrest is ' + findMode(arrestAge) + ' out of ' + arrestAge.length + ' with the average age of ' + findMean(arrestAge));
    console.log('The age with most arrest in ' + mostArrestZipCode + ' is ' + findMode(arrestAgesInZip) + ' out of ' + arrestAgesInZip.length + ' with the average age in this zip code being ' + findMean(arrestAgesInZip));
    console.log('Fun fact, the zip code that Townview is in has had ' + zipCodeAges['75203'].length + ' arrests as of 2014');

    let populationAtZip;
    let popDensityAtZip; 
    // Read and parse the 'uszips.csv' file
    fs.createReadStream('uszips.csv')//https://simplemaps.com/data/us-zips
      .pipe(csv())
      .on('data', (row) => {
        // Check if this row's zip code matches the most arrested zip code
        if (mostArrestZipCode===(row['zip'])) {
          populationAtZip = row['population'];
          popDensityAtZip = row['density'];
        }
      })
      .on('end', () => {
        console.log('As of 2020, \nThe population of zip code ' + mostArrestZipCode + ' is ' + populationAtZip);
        console.log('The population DENSITY of zip code ' + mostArrestZipCode + ' is ' + popDensityAtZip);
      });
      let buildingsInZip = 0;
      let buildingValues = [];
      fs.createReadStream('Building_Permits.csv')//https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah/data_preview
        .pipe(csv())
        .on('data', (row) => {
          var values = [];
          
          if(mostArrestZipCode===row[Object.keys(row)[10]]){
            buildingValues.push(row[Object.keys(row)[5]]);
            buildingsInZip++;
          }
        })
        .on('end', () => {
          console.log(findMean(buildingValues) + ' is the mean value of the business buidings in ' + mostArrestZipCode);
          console.log(buildingsInZip + ' is the number of business buildings in ' + mostArrestZipCode);
        })
  });

function findMode(arr) {
    let frequency = {};
    let maxFreq = 0;  
    let modes = [];

    for(let i in arr) {
        frequency[arr[i]] = (frequency[arr[i]] || 0) + 1; 

        if(frequency[arr[i]] > maxFreq) {
            maxFreq = frequency[arr[i]];
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
