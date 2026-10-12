import Map from "https://js.arcgis.com/5.1/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/5.1/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GraphicsLayer.js";
import SceneView from "https://js.arcgis.com/5.1/@arcgis/core/views/SceneView.js";
import Point from "https://js.arcgis.com/5.1/@arcgis/core/geometry/Point.js";
import * as reactiveUtils from "https://js.arcgis.com/5.1/@arcgis/core/core/reactiveUtils.js";

// Create the map and show terrain.
var map = new Map({
    basemap: "topo-vector",
    ground: "world-elevation"
});

// Start over North America, then fit the map to all my places.
var view = new SceneView({
    container: "map",
    map: map,
    center: [-98, 32],
    zoom: 5,
    popup: {
        dockEnabled: true,
        dockOptions: {
            position: "bottom-right",
            breakpoint: false
        }
    }
});

var graphicsLayer = new GraphicsLayer({
    elevationInfo: { mode: "on-the-ground" }
});
map.add(graphicsLayer);

// Save each place as a graphic.
var places = [];
for (var name in myStuff) {
    var place = myStuff[name];
    var pointGraphic = new Graphic({
        geometry: new Point({
            longitude: place.coord[0],
            latitude: place.coord[1]
        }),
        symbol: {
            type: "simple-marker",
            style: "square",
            color: "#d2691e",
            size: 12,
            outline: { color: "white", width: 2 }
        },
        attributes: {
            name: name,
            city: place.city,
            state: place.state,
            description: place.description,
            count: 1
        },
        popupTemplate: {
            title: "{name}",
            content: "<b>{city}, {state}</b><br><br>{description}"
        }
    });
    places.push(pointGraphic);
}

// Group points that are within 45 pixels of the first point in a group.
// Ordinary loops keep this small example easy to follow.
function drawPoints() {
    graphicsLayer.removeAll();
    var used = [];

    for (var i = 0; i < places.length; i++) {
        if (used[i]) {
            continue;
        }

        var first = view.toScreen(places[i].geometry);
        // Skip points that are outside the visible map.
        if (!first || first.x < 0 || first.y < 0 ||
            first.x > view.width || first.y > view.height) {
            continue;
        }

        var group = [places[i]];
        used[i] = true;
        var longitude = places[i].geometry.longitude;
        var latitude = places[i].geometry.latitude;

        for (var j = i + 1; j < places.length; j++) {
            if (used[j]) {
                continue;
            }
            var next = view.toScreen(places[j].geometry);
            if (!next) {
                continue;
            }
            var xDistance = first.x - next.x;
            var yDistance = first.y - next.y;
            var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

            if (distance < 45) {
                group.push(places[j]);
                used[j] = true;
                longitude += places[j].geometry.longitude;
                latitude += places[j].geometry.latitude;
            }
        }

        if (group.length === 1) {
            graphicsLayer.add(places[i]);
        } else {
            var list = "";
            var sameLocation = true;
            for (var k = 0; k < group.length; k++) {
                list += "<li><b>" + group[k].attributes.name + "</b>: " +
                    group[k].attributes.description + "</li>";
                if (group[k].geometry.longitude !== group[0].geometry.longitude ||
                    group[k].geometry.latitude !== group[0].geometry.latitude) {
                    sameLocation = false;
                }
            }
            var clusterNote = "Zoom in to separate nearby places.";
            if (sameLocation) {
                clusterNote = "These entries share the same location and stay grouped when you zoom in.";
            }
            var cluster = new Graphic({
                geometry: new Point({
                    longitude: longitude / group.length,
                    latitude: latitude / group.length
                }),
                symbol: {
                    type: "simple-marker",
                    style: "square",
                    color: "#286a9e",
                    size: 18 + group.length * 3,
                    outline: { color: "white", width: 2 }
                },
                attributes: { count: group.length, sameLocation: sameLocation },
                popupTemplate: {
                    title: "{count} places grouped together",
                    content: "<ul>" + list + "</ul>" + clusterNote
                }
            });
            graphicsLayer.add(cluster);
        }
    }
}

// Zoom to a place. For a cluster, move closer so the points can separate.
function zoomToPoint(graphic) {
    var zoomScale = 40000;
    if (graphic.attributes.count > 1) {
        zoomScale = Math.max(view.scale / 4, 10000);
    }
    view.goTo({
        target: graphic.geometry,
        scale: zoomScale,
        tilt: 35
    }).catch(showMapError);
}

view.on("click", function(event) {
    view.hitTest(event, { include: graphicsLayer }).then(function(response) {
        for (var i = 0; i < response.results.length; i++) {
            var graphic = response.results[i].graphic;
            if (graphic && graphic.layer === graphicsLayer) {
                zoomToPoint(graphic);
                break;
            }
        }
    }).catch(showMapError);
});

// Redraw clusters when the user finishes moving the map.
reactiveUtils.watch(function() {
    return view.stationary;
}, function(stationary) {
    if (stationary) {
        drawPoints();
    }
});

// Fill the suggested city list.
var cityList = document.getElementById("cityList");
for (var city in searchCities) {
    var option = document.createElement("option");
    option.value = city;
    cityList.appendChild(option);
}

function searchCity(event) {
    event.preventDefault();
    var input = document.getElementById("cityInput").value.trim().toLowerCase();
    var message = document.getElementById("message");

    for (var city in searchCities) {
        if (city.toLowerCase() === input) {
            var coordinates = searchCities[city];
            view.goTo({
                target: new Point({
                    longitude: coordinates[0],
                    latitude: coordinates[1]
                }),
                scale: 150000,
                tilt: 35
            }).catch(showMapError);
            message.textContent = "Showing " + city + ".";
            return;
        }
    }
    message.textContent = "Please choose a city from the suggested list.";
}

document.getElementById("citySearch").onsubmit = searchCity;

function showOverview() {
    view.goTo({
        target: places,
        tilt: 0
    }).catch(showMapError);
}

document.getElementById("resetMap").onclick = function() {
    showOverview();
    document.getElementById("cityInput").value = "";
    document.getElementById("message").textContent = "Showing all my places.";
};

function showMapError(error) {
    if (error.name !== "AbortError") {
        console.error(error);
        document.getElementById("message").textContent =
            "The map could not finish loading. Check your internet connection.";
    }
}

view.when(function() {
    drawPoints();
    showOverview();
    document.getElementById("cityInput").disabled = false;
    document.getElementById("searchButton").disabled = false;
    document.getElementById("resetMap").disabled = false;
    document.getElementById("message").textContent = "Choose a city or click a square.";
}).catch(showMapError);
