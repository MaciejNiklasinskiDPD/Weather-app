// Load node modules
const path = require('path');

// Load express module
const express = require('express');

// Load hbs module
const hbs = require('hbs');

// Load custom modules
const weatherProvider = require('./utils.js/weatherProvider');

// Initialize instance of the express app.
const app = express();

// Get paths to directory containing static resources
const pagesPath = path.join(__dirname, '../resources/pages');
const scriptsPath = path.join(__dirname, '../resources/scripts');
const stylesPath = path.join(__dirname, '../resources/styles');
const imagesPath = path.join(__dirname, '../resources/images');
const templatePagesPath = path.join(__dirname, '../resources/templates/pages');
const templatePartialsPath = path.join(__dirname, '../resources/templates/partials');

// Configure server to use resources directories
app.use(express.static(pagesPath));
app.use(express.static(scriptsPath));
app.use(express.static(stylesPath));
app.use(express.static(imagesPath));

// Set 'hbs' as express templating engine
app.set('view engine', 'hbs');
// Set custom template pages directory path
app.set('views', templatePagesPath);
// Set custom partial templates directory path
hbs.registerPartials(templatePartialsPath);

// Set up response to home page get request
app.get('', (request, response) => {
    response.render('index', {
        title: 'Weather',
        createdBy: 'Maciej Niklasinski'
    });
});

// Set up response to about page get request
app.get('/about', (request, response) => {
    response.render('about', {
        title: 'About Me',
        createdBy: 'Maciej Niklasinski'
    });
});

// Set up response to help page get request
app.get('/help', (request, response) => {
    response.render('help', {
        title: 'Help',
        createdBy: 'Maciej Niklasinski',
        message: 'Provide an address and click submit to receive localized weather forecast.'
    });
});


// Set up response to 404 error page get request
app.get('/help/*', (request, response) => {
    response.render('error', {
        title: 'Help article not found!',
        createdBy: 'Maciej Niklasinski',
        error: `404 error. There is no help article referring to "${request.path.substr(6)}".`
    });
});

// Set up response to whether page get request
app.get('/weather', (request, response) => {

    const { query } = request;

    if (!query.address) {

        return response.send({
            error: 'Address cannot be empty'
        });

        // return response.render('error', {
        //     title: 'Address is required!',
        //     createdBy: 'Maciej Niklasinski',
        //     error: `Unable to provide a weather forecast for undefined address.`
        // });
    }
    (async () => {
        try {
            response.send({
                forecast: await weatherProvider.getAsync(query.address),
                address: query.address
            });

            // response.render('weather', {
            //     title: `Weather forecast for ${query.address}`,
            //     createdBy: 'Maciej Niklasinski',
            //     address: query.address,
            //     summary: forecast.daily.data[0].summary,
            //     apparentTemperature: forecast.currently.apparentTemperature,
            //     precipProbability: forecast.currently.precipProbability
            // });
        }
        catch (err) {
            response.send({
                error: err.message
            });
            // response.render('error', {
            //     title: 'Error encountered!',
            //     createdBy: 'Maciej Niklasinski',
            //     error: err.message
            // });
        }
    })();
});

// Set up response to 404 error page get request
app.get('*', (request, response) => {
    response.render('error', {
        title: 'Page not found!',
        createdBy: 'Maciej Niklasinski',
        error: `404 error. Page not found. Provided address "${request.path}" is not valid.`
    });
});

// Starts the server on port 3000.
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});