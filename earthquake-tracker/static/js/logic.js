// Creating map object
// Chose Oklahoma as the center coordinate
var map = L.map("map", {
    center: [35.5, -97.0059],
    zoom: 4
  });

// Colors for scale
var colors = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"];

  function getColor(mag) {
    // var color = "";
    if (mag < 1) {
        // color = "#ffffb2";
        return "#ffffb2";
    }
    else if (mag < 2) {
        // color =  "#fed976";
        return "#fed976";
    }
    else if (mag < 3) {
        // color =  "#feb24c";
        return "#feb24c";
    }
    else if (mag < 4) {
        // color =  "#fd8d3c";
        return "#fd8d3c";
    }
    else if (mag < 5) {
        // color =  "#f03b20";
        return "#f03b20";
    }
    else {
        return "#bd0026";
    }
}

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    // console.log(data.features.length);
    // console.log(data);
    var mags = [];
    var coords = [];
    var names = [];
    // var dates = [];
    for (i = 0; i < data.features.length; i++) {
        var latLong = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]];
        coords.push(latLong);
        mags.push(data.features[i].properties.mag);
        names.push(data.features[i].properties.place);
        // Wanted to include time, but the time for each earthquake is just the time I grab the data
        // dates.push(Date(data.features[i].properties.time));
        // console.log(dates[i])

        // console.log(mags[i]);
        // console.log(latLong);


    }
    // Get max/min magnitudes to scale the circle radius off of
    var maxMag = Math.max.apply(Math, mags);

    for (i = 0; i < coords.length; i++) {
        L.circle(coords[i], {
            fillOpacity: .75,
            color: getColor(mags[i]),
            fillColor: getColor(mags[i]),
            radius: ((mags[i] / maxMag) * 300) ** 2
        }).bindPopup("<h1>" + names[i] + "</h1> <hr> <h3>" + "Magnitude: " + mags[i]
            + "</h3> <h3>" + 
            // "Date: " + dates[i] + 
            "</h3>").addTo(map) ;
    }

    // Create legend labels
    var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    // // Set up the legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    //     // Add min & max
        var legendInfo = 
        // "<h1>Earthquake Magnitudes</h1>" + 
        "<div class=\"labels\">" +
            "<div>" + "<span style = 'background-color : #ffffb2' </span>" + labels[0] + "</div>" +
            "<div>" + "<span style = 'background-color : #fed976' </span>" + labels[1] + "</div>" +
            "<div>" + "<span style = 'background-color : #feb24c' </span>" + labels[2] + "</div>" +
            "<div>" + "<span style = 'background-color : #fd8d3c' </span>" + labels[3] + "</div>" +
            "<div>" + "<span style = 'background-color : #f03b20' </span>" + labels[4] + "</div>" +
            "<div>" + "<span style = 'background-color : #bd0026' </span>" + labels[5] + "</div>" +
            "</div>";

        // console.log(legendInfo);
        div.innerHTML = legendInfo;
        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
});