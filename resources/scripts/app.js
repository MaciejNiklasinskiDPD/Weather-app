// Select form html element
const form = document.querySelector('form');

// Add submit even listener to the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    displayForecast()
});

// Obtains weather forecast and displays it on the page.
async function displayForecast() {

    // Get description paragraph html element 
    const description = document.getElementById('description');

    // Replace content of description paragraph
    description.innerHTML = 'Loading...';

    // Obtain whether request url
    const url = getWhetherRequestURL();

    // Await whether forecast ..
    const response = await fetch(url);
    // .. then await it to be converted to json.
    const data = await response.json();

    // Get forecast paragraphs html elements
    const forecastLocation = document.getElementById('forecastLocation');
    const forecastSummary = document.getElementById('forecastSummary');
    const forecastDetails = document.getElementById('forecastDetails');

    // If error has been returned ..
    if (data.error) {
        // .. replace content of description paragraph with the error
        description.innerHTML = data.error;
    }
    else {
        // Deconstruct data into address and forecast pieces
        const { address, forecast } = data;

        // Replace content of description paragraph
        description.innerHTML = '';

        // Replace content of weather forecast paragraphs
        forecastLocation.innerHTML = `Weather forecast for ${address} latitude: ${forecast.latitude}, longitude: ${forecast.longitude}`;
        forecastSummary.innerHTML = forecast.daily.data[0].summary;
        forecastDetails.innerHTML = `There is currently ${forecast.currently.apparentTemperature} degrees. There is a ${forecast.currently.precipProbability}% chance of rain.`;
    }
}

// Returns url for the weather request
function getWhetherRequestURL() {
    // Get address input text html element
    const address = document.getElementById('address').value;

    // Return constructed whether 
    return `/weather?address=${address}`;
}
