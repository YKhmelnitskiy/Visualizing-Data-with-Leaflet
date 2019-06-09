// Store our API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features)

});
// Defining our createFeatures function for the purpose of adding layers
function createFeatures(earthquakeData) {

  
  
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  // Also adding our layer for the circle makers
  var earthquakes = L.geoJson(earthquakeData, {
     
    onEachFeature: function (feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + " -   Mag: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  },
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
          {radius: feature.properties.mag * 5,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
    }

 
  });

  // Create our map
  var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4,
    layers : [earthquakes]
  });

  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY,
  }).addTo(myMap);

   // Create a legend to display information about our map
  var infolegend = L.control({
    position: 'bottomright'
  });

  // When the layer control is added, inserting a div with the class of "legend"
  infolegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
      grade =  [0,1,2,3,4,5],
      colors = ["#BFE56B", "#D4F74E", "#EEDE4A", "#E4C366", "#F3A46A","#D2796B"];
      // to insert our legend parameters into the html
    for (var i = 0; i< grade.length; i++) {
      div.innerHTML += 
        '<i style="background:' + colors[i] + '"></i> ' +
        grade[i] + (grade[i+1] ? '&ndash;' + grade[i+1] + '<br>' : '+');
    }
    return div;
  };
  // Add the info legend to the map
  infolegend.addTo(myMap);

}
// function to get the color of the circle markers
function getColor(magnitude) {
  if (magnitude >= 5) {
    return "#D2796B"
  } 
  else if (magnitude >= 4) {
    return "#F3A46A"
  }
  else if (magnitude >= 3) {
    return "#E4C366"
  }
  else if (magnitude >= 2) {
    return "#EEDE4A"
  }
  else if (magnitude >= 1) {
    return "#D4F74E"
  }
  else {
    return "#BFE56B"
  }
}




