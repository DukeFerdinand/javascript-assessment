//---------------------------
//  Javascript Assessment
//---------------------------

// For each section, read the instructions and add your code to the code area.
// Wherever possible, use methods rather than global functions.
// We're looking for conciseness, intuition and adherence to best practices. Good luck!




//---------------------------
//  Section 1   --Done
//---------------------------


// Make an ajax call to openweathermap.org. Use their documentation to find out how to query their api.
// Use the appid 8690974851e3f54d7ce53bc8c6738558
// Make the API return a five day forecast for any city you'd like, with JSON as the mode and imperial as the units
// Set your city in your query to a variable in the same scope as your ajax method.




//---------------------------
//  Section 2 -- Work on responsive image
//---------------------------


// Bootstrap has been added to index.html for this assessment.
// For every day in your five day forecast, append a div with the class col-sm-4 to the existing row in index.html
// In each div, add a header tag including the "main" property in that day's forecast
// Next, include the day's icon in a responsive image. Refer to openweathermap's documentation to find out how to do this.
// Next, include the day's weather description.
// Finally, include the day's average temperature. The average temperature is not provided in the JSON response.




//---------------------------
//  Section 3   -- Done
//---------------------------


// Add a dropdown somewhere on the page with a list of three cities. Allow a user to click on a city and get an updated forecast for that city.
// Update your method to allow users to choose between imperial and metric units.
// Use the provided ajax loader .gif during ajax calls.




//---------------------------
//  Section 4  -- Done
//---------------------------


// Add a method to the String object called grammarize, which capitalizes the first letter in a string and adds a period to the end of the string if it doesn't have one already.
// Run grammarize on all of your weather descriptions with each new ajax call.




//---------------------------
//  Place Code Here
//---------------------------
const OpenWeather = {
    //Simple state object
    state: {
        //Using provided API key        
        appid: '8690974851e3f54d7ce53bc8c6738558',

        /*
        *Default City so the user can see 
        *what the app does before using it
        */
        currentCity: 'San Antonio',
        
        //Defaults weather to empty object        
        selectedCityWeather: {},

        cityArray : [
            'New York',
            'Austin',
            'Houston'
        ],
        unitObjects: [
            {name: 'imperial', unitSymbol: 'F', opposite: 'metric'},
            {name: 'metric', unitSymbol:'C', opposite: 'imperial'}

        ],
        unitSystem: 'imperial',
        unitSymbol: 'F',
        //Added day labels for ease of use
        days: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },

    //Clears any stored data and starts the loading spinner
    clearCurrentWeather() {
        this.selectedCityWeather = {};
        $('#main.row').empty().prepend('<img class="img-responsive center-block" src="./images/ajax-loader.gif">');
    },

    //Clears row of loading spinner
    clearLoadingSpinner() {
        $('#main.row').empty();
    },

    //Gets the weather using set params
    getCityWeather(city = this.state.currentCity) {
        this.clearCurrentWeather();

        $.get(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=${this.state.appid}` +
                `&q=${city}&mode=json&units=${this.state.unitSystem}&cnt=5`)
        .done(results => this.setCityWeather(results))
        .fail(results => this.renderError(results.responseJSON));
    },

    //To aid in separating concerns and Quality of Life, separated all these functions
    setCityWeather(results, error) {
        //Converting to Bool value to avoid some breakage
        if (!!results) {
            // //Storing data to object variable for later use
            this.state.selectedCityWeather = results;

            // //Sending only the Daily Weather array to map it
            this.renderWeatherData(this.state.selectedCityWeather);
        } else {
            this.renderError(error);
        }
    },

    //Capitalizes the first letter, adds a period to the end
    grammarize(description) {        
        let grammarizedDesc = description.split('')
        grammarizedDesc[0] = grammarizedDesc[0].toUpperCase();
        grammarizedDesc.push('.');

        return grammarizedDesc.join('');
    },

    //Takes the array of daily info and creates a DOM element for each
    mapDailyWeatherToHTML(dailyWeatherArr, ) {
        //Added grammarize method to String object
        String.grammarize = this.grammarize

        dailyWeatherArr.forEach((day, index) => {
            let date = new Date();
            const dayIndex = date.getDay() + index

            $('#main.row').append(`<div id='day${index}' class='day col-sm-4'>`)
            let averageTemp = this.averageDailyTemp(day.temp);

            let description = String.grammarize(day.weather[0].description)

            //Basic templating using ES6 interpolation
            //This renders the content for each day of the week
            $(`#day${index}`).append(
                `<h4 id='name' class='text-center'>${this.state.days[dayIndex]}</h4>` +
                `<h2 class='text-center'>${day.weather[0].main}</h2>` +
                `<p class='text-center'>${description}</p>`+
                `<img class='img-responsive center-block' src=http://openweathermap.org/img/w/${day.weather[0].icon}.png />`+
                `<h4 class='text-center'>${averageTemp} &#176;${this.state.unitSymbol}</h4>`
            );
        })
    },

    /*
    * Almost tricked me, temps.min and temps.max
    * should not be included or they provide 
    * duplicate data, skewing results and accuracy
    */
    averageDailyTemp(dailyTemp) {
        let dt = dailyTemp;
        return ((dt.day + dt.eve + dt.morn + dt.night)/4).toFixed(0);
    },

    renderWeatherData(weatherData) {
        this.clearLoadingSpinner();
        $('#main.row').prepend(`<h2 class='text-center'>${weatherData.city.name}</h2>`)
        this.mapDailyWeatherToHTML(weatherData.list)
    },

    renderError(error) {
        this.clearLoadingSpinner();
        $('#main.row').append(
            `<h1>Sorry, that's an error :(</h1>` +
            `<p>Details: ${error.message}</p>`
        );
    },

    //Handles Changing the system used from Imperial to Metric and vice-versa
    changeTempSystem() {
        this.state.unitObjects.map((system)=> {
            $(`#${system.name}`).click(() => {
                this.state.unitSystem = system.name;
                this.state.unitSymbol = system.unitSymbol;
                this.getCityWeather();
            })
        })
    },

    renderDropdown() {
        //'this' binding seems to make event listeners play nicely with jQuery
        this.getCityWeather = this.getCityWeather.bind(this);
        
        $('div.container').prepend(
            `<div class='row'>`+
                //Unit changing buttons
                `<button id='imperial' class=' btn btn-default col-xs-2'>Imperial</button>`+
                `<button id='metric' class='btn btn-default col-xs-2 '>Metric</button>` +

                //Dropdown menu
                `<div class="col-xs-2 dropdown">` +
                    `<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">More Cities` +
                    `<span class="caret"></span></button>` +
                    `<ul class="dropdown-menu">` +
                        `<li id='dd0'>New York, NY</li>` +
                        `<li id='dd1'>Austin, TX</li>` +
                        `<li id='dd2'>Houston, TX</li>` +
                    `</ul>` +
                `</div>` +
            `</div>`
        );

        /*
        * Map through the cities to add respective event listeners, 
        * 'onclick' inline handlers didn't seem to work very well with ES6 'this' binding
        */
        this.state.cityArray.map((city, index)=>{
            $(`#dd${index}`).click(() =>{
                this.getCityWeather(city)
            })
        })
    },

    init() {
        this.renderDropdown();
        $('div.container').prepend('<h1>jQuery Weather App</h1>')
        this.getCityWeather();
        this.changeTempSystem();
    }
}
//Initial call to startup the app
OpenWeather.init();

//---------------------------
//  End of Code
//---------------------------

