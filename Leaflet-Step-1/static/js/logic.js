// Perform a GET request to the query URL/
d3.json("static/data/2.5_week.geojson").then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.

  createFeatures(data.features);
});

const colorscale = [
  '#ff6666',   // red
  '#ff9933',   // orange
  '#ffb266',   // orange-yellow
  '#ffff33',   // yellow
  '#ffffcc',   // light yellow
  '#98fb98'     // neon green
]

getFillColor = function (depth) {
  if (depth >= 90)
    return colorscale[0];   // red
  else if (depth >= 70)
    return colorscale[1];   // orange
  else if (depth >= 50)
    return colorscale[2];   // orange-yellow
  else if (depth >= 30)
    return colorscale[3];   // yellow
  else if (depth >= 10)
    return colorscale[4];   // light yellow
  else
    return colorscale[5];   // neon green
};

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: +feature.properties.mag *3,
        fillColor: getFillColor(+feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0.8
      })
    }
  });
  
  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("myMap", {
    center: [
      15, -90
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function createLegend(legend) {
    var div = L.DomUtil.create('div');
    var magnitudes = [-10, 10, 30, 50, 70, 90];
  
    div.innerHTML += '<div style="font-weight: 600; text-align: center;">Depth</div>';
    for(var i = 0; i < magnitudes.length; i++) {
      div.innerHTML += '<div style="background: ' + colorscale[i] + '; text-align: center; padding: 1; border: 1px solid gray; min-width: 80px;">'
      + magnitudes[i] + (magnitudes[i+1] ? "&ndash;" + magnitudes[i+1] + "</div>" : "+</div>");
    }

    return div;
  };

  legend.addTo(myMap);

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  var myMap = L.map('myMap').setView([37.8, -122.4], 3);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
}
