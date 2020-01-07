const https = require('https');

const darkSkyUrl = 'https://api.darksky.net/forecast/40cb36ec74ed7e07ac503a1cb17ee7cd/';

const mapboxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const mapboxToken = 'access_token=pk.eyJ1Ijoic3plbGlnYTkwIiwiYSI6ImNrNHlhZ3pqbDA4N2gzcm8zdXJnOGVhMTIifQ.2uVRdTjHweLcr94G9GN3hQ';


// Return weather forecast data for the provided address.
async function getAsync(address) {

    // Get a geographic coordinates based on the provided address.
    const coordinates = await getCoordinatesAsync(address);

    // Obtain and return weather forecast.
    return await getWeatherAsync(coordinates);

} module.exports.getAsync = getAsync;

// Returns geographic coordinates based on the provided address.
function getCoordinatesAsync(address) {
    // Return promise of obtaining geographic coordinates form the mapbox service
    return new Promise((resolve, reject) => {
        // Send get request to mapbox service.
        https.get(getLocationServiceURL(address), (response) => {

            // If response code does not indicate success ..
            if (response.statusCode !== 200) {
                // .. consume response data to free up memory ..
                response.resume();
                // .. and reject the promise with an error constructed based on the response code and message.
                reject(new Error(`Request to the mapping service failed. Code: ${response.statusCode}, Message: ${response.statusMessage}`));
            }
            else {
                // Define raw data variable
                let rawData = '';

                // On receiving each chunk of data, append rawData variable with the chunk.
                response.on('data', (chunk) => { rawData += chunk.toString(); });

                // Once all the data chunks has been received..
                response.on('end', () => {
                    // Parse the rawData as JSON object and store as data variable.
                    const data = JSON.parse(rawData);
                    
                    // If no location associated with the provided address has been found ..
                    if (data.features.length === 0) {
                        // .. reject a promise with appropriate error provided as a rejection argument.
                        reject(new Error(`Provided ${address} is not a valid address.`));
                    }
                    // Otherwise ..
                    else {
                        // .. deconstruct geographic coordinates array from the data, ..
                        const { coordinates } = data.features[0].geometry;

                        // .. construct a coordinates object from it and use it as a completion
                        // argument while resolving the promise.
                        resolve({ latitude: coordinates[1], longitude: coordinates[0] });
                    }
                });
            }
            // On error ..     
        }).on('error', (e) => {
            // .. reject the promise providing error as a rejection argument.
            reject(e);
        });
    });

}

// Obtains weather forecast for the provided geographic coordinates
function getWeatherAsync({ latitude, longitude }) {
    // Returns promise of obtaining weather forecast
    return new Promise((resolve, reject) => {

        // Send get request to dark sky weather service
        https.get(getWeatherServiceURL(latitude, longitude, { units: 'si', lang: 'en' }), (response) => {

            // If response code does not indicate success ..
            if (response.statusCode !== 200) {
                // .. consume response data to free up memory ..
                response.resume();
                // .. and reject the promise with an error constructed based on the response code and message.
                reject(new Error(`Request to the weather service failed. Code: ${response.statusCode}, Message: ${response.statusMessage}`));
            }
            // Otherwise process response.
            else {

                // Define raw data variable
                let rawData = '';

                // On receiving each chunk of data, append rawData variable with the chunk.
                response.on('data', (chunk) => { rawData += chunk.toString(); });

                // Once all the data chunks has been received, parse raw data as JSON object
                // and resolve the promise providing parsed JSON object as a completion argument.
                response.on('end', () => { resolve(JSON.parse(rawData)); });
            }
            // On error ..     
        }).on('error', (e) => {
            // .. reject the promise providing error as a rejection argument.
            reject(e);
        });
    });

}

// Construct and returns the mapbox service url for a specified address.
function getLocationServiceURL(address) {
    return `${mapboxUrl}${encodeURIComponent(address)}.json?${mapboxToken}`;
}

// Constructs and returns weather service url based on the provided parameters.
function getWeatherServiceURL(latitude, longitude, parametersObj) {

    // Construct basic dark sky weather service url based on provided latitude and longitude.
    let url = `${darkSkyUrl}${latitude},${longitude}`;

    // If no query string parameters provided..
    if (!parametersObj) {
        // .. return the basic url.
        return url;
    }
    // Otherwise ..
    else {
        // .. append basic url with question mark character and..
        url += '?';

        // .. for each property of provided query string parameters object ..
        for (var key in parametersObj) {
            // append the url with key value pair ending with ampersand character ..
            url += `${key}=${parametersObj[key]}&`;
        }

        // .. then return the url with the last ampersand character removed from it.
        return url.substring(0, url.length - 1);
    }
}