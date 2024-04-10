// Import required modules
const fs = require('fs');
const csv = require('csv-parser');

// Initialize arrays to store data
let race = []; //list of all mentioned races
let zipCodes = [];//list of all mentioned zip codes
let arrestAge = [];//list of all age at arrest time

// Initialize object to store ages at each zip code
let zipCodeAges = {};//this gets all the ages in a provided zip code, see line 42 and 50 for examples

// Function to find the mode of an array
function findMode(arr) {
    let frequency = {};  // Array of frequency.
    let maxFreq = 0;  // Holds the max frequency.
    let modes = [];

    // Calculate frequency of each value
    for(let i in arr) {
        frequency[arr[i]] = (frequency[arr[i]] || 0) + 1; // Increment frequency.

        // If this frequency is greater than the max so far, update max
        if(frequency[arr[i]] > maxFreq) {
            maxFreq = frequency[arr[i]];
        }
    }

    // Find values with max frequency
    for(let k in frequency) {
        if(frequency[k] === maxFreq) {
           modes.push(k);
        }
    }

    return modes;
}

// Function to find the mean of an array
function findMean(arr) {
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += Number(arr[i]);
    }
    return sum / arr.length;
}

// Function to find the least occurring value in an array
function findLeastOccurring(array) {
    let frequency = array.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    let minFrequency = Math.min(...Object.values(frequency));

    let leastOccurring = Object.keys(frequency).filter(key => frequency[key] === minFrequency);

    return leastOccurring;
}

// Function to find the standard deviation of an array
function findStandardDeviation(arr, mean) {
    let sumOfSquares = 0;
    for(let i = 0; i < arr.length; i++) {
        sumOfSquares += Math.pow(Number(arr[i]) - mean, 2);
    }
    let variance = sumOfSquares / arr.length;
    return Math.sqrt(variance);
}

// Read and parse the CSV file
fs.createReadStream('Police_Arrests.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Extract data from row
    var arLZip = row[Object.keys(row)[8]];
    var Race = row[Object.keys(row)[51]];
    var AgeAtArrestTime = row[Object.keys(row)[39]];

    // Add data to arrays
    zipCodes.push(arLZip); 
    race.push(Race);

    // If age is not empty, add it to the array
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
    // Calculate statistics
    let mostArrestZipCode = findMode(zipCodes);
    let arrestAgesInZip = zipCodeAges[mostArrestZipCode];

    // Calculate means
    let totalArrestsMean = 35.16984164597521;
    let mostArrestZipMean = 36.71599684791174;

    // Calculate standard deviations
    let totalArrestsStdDev = findStandardDeviation(arrestAge, totalArrestsMean);
    let mostArrestZipStdDev = findStandardDeviation(arrestAgesInZip, mostArrestZipMean);

    // Print statistics
    console.log('The race arrested most is ' + findMode(race));
    console.log('The zip code with the most arrest is ' + mostArrestZipCode);
    console.log('The age with the most arrest is ' + findMode(arrestAge) + ' out of ' + arrestAge.length + ' with the average age of ' + findMean(arrestAge));
    console.log('The age with most arrest in ' + mostArrestZipCode + ' is ' + findMode(arrestAgesInZip) + ' out of ' + arrestAgesInZip.length + ' with the average age in this zip code being ' + findMean(arrestAgesInZip));
    console.log('The "least" dangerous area is ' + findLeastOccurring(zipCodes));
    console.log('Fun fact, the zip code that Townview is in has had ' + zipCodeAges['75203'].length + ' arrests as of 2014');
    console.log('The standard deviation of the total amount of arrests is ' + totalArrestsStdDev);
    console.log('The standard deviation of the zip code with the most arrests is ' + mostArrestZipStdDev);
  });
