"use strict"

// FIVE DAYS weather forecast
const FIVE_DAY_WEATHER = "https://api.openweathermap.org/data/2.5/forecast?"

let html= ``;
let  userInput = ``;
let weatherCondition = ``;


let marker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([-98.4946, 29.4252])
    .addTo(map);

$(".company-logo").on("click",()=>{
    map.flyTo({
        center: [-98.4946, 29.4252],
        essential: true,
        zoom: 13
    });
    marker.setLngLat([-98.4946, 29.4252])
});

// img change on card
function weatherBg(main) {

    if (main.includes("Clouds")) {
        $("body").css({
            "background-image": `url("/img/weather-app/clouds.gif")`
    });
    } else if (main.includes("Rain")) {
        $("body").css({
            "background-image": `url("/img/weather-app/rain.gif")`
        });
    } else if (main.includes("Clear")) {
        $("body").css({
            "background-image": `url("/img/weather-app/clear.gif")`
    });
    } else if (main.includes("Thunderstorm")) {
        $("body").css({
            "background-image": `url("/img/weather-app/thunderstorm.gif")`
        });
    } else if (main.includes("Fog")) {
        $("body").css({
            "background-image": `url("/img/weather-app/fog.gif")`
        });
    } else if (main.includes("Snow")) {
            $("body").css({
                "background-image": `url("/img/weather-app/snow.gif")`
    });
    } else {
        console.log("look 27-54");
    }
}

// card data
const buildForecastCard = (data, i) => {
console.log(data)
    let html = `
        
        <div class="card-wrapper">
                <div class="card mb-3 position-relative" style="width: 14rem;">
                  <div class="card-header">${epochConverter(data.list[i].dt)}</div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${data.city.name}</h5>
                        <p class="card-text">${data.list[i].weather[0].description}</p>
                        <div class="d-flex align-items-center justify-content-center">
                        <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"/>
                        </div>
                        <p class="card-text">Temp: ${data.list[i].main.temp.toFixed()} F&deg</p>
                        <p class="card-text">Feels like: ${data.list[i].main.feels_like.toFixed()} F&deg</p>
                       
                        <p class="card-text">Humidity: ${data.list[i].main.humidity}%</p>
                        <p class="card-text">Wind Speed: ${data.list[i].wind.speed.toFixed()}</p>
                    </div>
                </div>
        </div>`;
    return html;

}

// date conversion
const epochConverter = (epoch)=>{
    return  new Date(epoch * 1000).toString().substring(4, 15)
}

// convert Kelvin to Fahrenheit
const kelvinToFahrenheit = (kelvin) => {
    // Celsius is 273 degrees less than Kelvin
    const celsius = kelvin - 273;
    // Calculating Fahrenheit temperature to the nearest integer
    return Math.floor(celsius * (9/5) + 32);
}

// UPDATE CARDS to marker location
const onDragUpdateWeather = () =>{
    const lngLat = marker.getLngLat();
    console.log(lngLat);

// this get request is displayed when marker dropped
    $.get(FIVE_DAY_WEATHER + `lat=${lngLat.lat}&lon=${lngLat.lng}&appid=${WEATHER_MAP_KEY}&units=imperial`).done((data)=> {
        console.log(data);
        map.flyTo({
            center: lngLat,
            essential: true,
            zoom: 13
        });

// loop to create the weather cards and display them on the DOM
        for (let i = 0; i < data.list.length; i+=8) {

            html += buildForecastCard(data, i);

// put weather cards in the DOM
            $("#forecast-weather").html(html);
        }
// end of for loop


//resets html variable
        html = ``;

    });// end of get request

}
// end of function onDragEnd

// event listener added to marker to run the function onDragUpdateWeather
marker.on('dragend', onDragUpdateWeather);




$.get(FIVE_DAY_WEATHER + `q=san antonio, usa&appid=${WEATHER_MAP_KEY}&units=imperial`).done((data)=>{

// loop to create the weather cards and display them on the DOM
    for (let i = 0; i < data.list.length; i+=8) {


//var is to capture and assign a bg img(gif) to the card
        weatherCondition += data.list[i].weather[0].main;

// build weather cards
        html += buildForecastCard(data, i);

// cards in the DOM
        $("#forecast-weather").html(html);

        weatherBg(html);
    }
// end of for loop

//reset variable
    html = ``;
});
// End of get request


// user input event listener and  function to do a get request, UPDATE CARDS & fly to and center map on inputted location
$("#search-btn").on("click",function(e){
    e.preventDefault();
    userInput = $('#search-input').val();
    geocode(userInput, MAPBOX_API_TOKEN).then(function(result) {
        console.log(result);
        map.flyTo({
            center: result,
            essential: true,
            zoom: 13
    });

// centers the marker in the user input
        marker.setLngLat(result);
        // get request to update weather cards with user input on search button submitting
        $.get(FIVE_DAY_WEATHER + `lat=${result[1]}&lon=${result[0]}&appid=${WEATHER_MAP_KEY}&units=imperial`).done((data)=>{
//  weather card loop s and display them on the DOM
            for (let i = 0; i < data.list.length; i+=8) {

                html += buildForecastCard(data, i);
                // weather cards in the DOM
                $("#forecast-weather").html(html);


            }
            // html variable reset
            html = ``;

    });
// end of geocode function

        $('#search-input').val('');

    });
// end of get request

});
// end of search button event listener

