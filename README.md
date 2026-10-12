# Meghan Lally - Assignment 5

This assignment uses the instructor's ArcGIS SceneView starter to make a 3D map of places in my life. It uses plain HTML and JavaScript, ordinary loops, and short functions.

## Map link

[Live assignment map](https://meghanlally.github.io/week6Assignment/week6Assignment/)

GitHub Pages must be enabled from the `main` branch and the root folder for the live-map link to work. The map files stay inside the original `week6Assignment` folder.

## My locations

- **Home:** Ladder Ranch near Savery, Wyoming.
- **University:** Colorado State University in Fort Collins, Colorado.
- **Favorite Vacation Spot:** Cancún, Mexico.
- **Wedding:** Ladder Ranch, using the same marker coordinates as Home.
- **Hometown:** Savery, Wyoming.

The personal descriptions come from the locations I chose for this assignment. The Ladder Ranch coordinates are the approximate marker I supplied for my earlier Savery website, not a surveyed house or wedding-site position. The university marker uses the main-campus coordinates listed for [Colorado State University](https://en.wikipedia.org/wiki/Colorado_State_University), `[-105.0808, 40.5762]`. The Cancún marker uses city coordinates from [Geodatos](https://www.geodatos.net/en/coordinates/mexico/cancun), `[-86.84656, 21.17429]`, rather than a specific hotel. The hometown marker uses the settlement coordinates for [Savery, Wyoming](https://en.wikipedia.org/wiki/Savery,_Wyoming), `[-107.44972, 41.025]`.

## Files

- `week6Assignment/index.html`: the page, simple styles, and search form.
- `week6Assignment/obj.js`: the `myStuff` object and predefined search coordinates.
- `week6Assignment/map.js`: the SceneView, square markers, popups, click-to-zoom, and clustering.
- `week6Assignment/jquery-1.11.1.min.js`: the original supplied library. This assignment does not load external JSON, so it does not need jQuery.

## Assignment requirements

- Changed `myStuff` to include my home, university, vacation spot, wedding, and hometown.
- Changed markers to orange squares with white outlines.
- Changed popups to include a location and personal description.
- Changed the starting view to fit all five entries and docked the popup.
- Added `zoomToPoint()` to zoom when a marker is clicked.
- Grouped nearby points into larger blue squares. A cluster popup shows its count and each member's description. Clicking a cluster zooms closer; groups are recalculated when the map stops moving.
- Added a predefined city search. It also accepts `Ladder Ranch` and `Colorado State University`. Enter or the Search button works, with capitalization differences and extra spaces allowed. Both `Cancun` and `Cancún` are accepted.

The clustering uses two loops and screen distance. It compares each unused point with the first point in a group and is intended for this small dataset. Home and Wedding share the exact same coordinates, so they remain a two-entry cluster even when zoomed in. Their shared popup includes both descriptions. No marker has been moved to a different ranch just to make it separate.

## How to try it

1. Download or clone this repository.
2. Open the repository folder in VS Code.
3. Use Live Server to open `week6Assignment/index.html`.
4. Search for `Ladder Ranch`, then click its blue square. The popup should list Home and Wedding.
5. Search for `Savery` or `Colorado State University` and click an orange square.
6. Search for `Cancun` to visit the vacation spot.
7. Try an unknown city to see the message. Use Reset to return to all my places.

The map needs an internet connection and a browser with WebGL support. ArcGIS modules, the basemap, and terrain load from online services.

## Submission

Use the public [assignment repository](https://github.com/meghanlally/week6Assignment). Enable GitHub Pages from the `main` branch and root folder, open the live-map link above, and submit the repository link. The account name is included in both URLs.

This public assignment identifies my home and wedding venue using an approximate ranch marker rather than a surveyed house or wedding-site position.
