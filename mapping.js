var map = L.map('map').setView([0, 0], 3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,minZoom:0,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Define the gyres
    var gyres = [
      {
        name: "The Great Pacific Garbage Patch",
        latLng: [42, 175],
        radius: 1000000,
        popup: "<b>The Great Pacific Garbage Patch.</b><br> It is roughly 1.6 million square kilometers."
      },
      {
        name: "The Indian Ocean Garbage Patch",
        latLng: [-18.479609, 75.9375],
        radius: 700000,
        popup: "<b>The Indian Ocean Garbage Patch</b><br> It is centered in the Indian Ocean, made from the Indian Ocean Gyre."
      },
      {
        name: "The North Atlantic Ocean Garbage Patch",
        latLng: [31, -48],
        radius: 800000,
        popup: "<b>The North Atlantic Ocean Garbage Patch</b><br> It is centered in the North Atlantic Gyre."
      },
      {
        name: "The South Atlantic Ocean Garbage Patch",
        latLng: [-45.336702, -21.09375],
        radius: 600000,
        popup: "<b>The South Atlantic Ocean Garbage Patch</b><br> It is centered in the South Atlantic Gyre."
      }
    ];

    // Add gyres to the map
    gyres.forEach(function(gyre) {
      var circle = L.circle(gyre.latLng, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: gyre.radius
      }).addTo(map);
      circle.bindPopup(gyre.popup);
      gyre.circle = circle;
    });

    // Calculate distance between two points in kilometers
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;

      return R * 2 * Math.asin(Math.sqrt(a));
    }

    // On map click, find the nearest gyre and draw a line
    map.on('click', function(e) {
      var clickedLatLng = e.latlng;
      var marker = L.marker([clickedLatLng.lat, clickedLatLng.lng]).addTo(map);
      var nearestGyre = gyres[0];
      var minDistance = getDistance(clickedLatLng.lat, clickedLatLng.lng, gyres[0].latLng[0], gyres[0].latLng[1]);

      gyres.forEach(function(gyre) {
        var distance = getDistance(clickedLatLng.lat, clickedLatLng.lng, gyre.latLng[0], gyre.latLng[1]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestGyre = gyre;
        }
      });
      
      if(minDistance.toFixed(2)>4000){
        alert("Nearest gyre: " + nearestGyre.name + "\nDistance: " + minDistance.toFixed(2) + " km. \n There is a low chance for this trash to end up in the Gyre anytime soon.  ");
      }else{
        alert("Nearest gyre: " + nearestGyre.name + "\nDistance: " + minDistance.toFixed(2) + " km");
      }
var line = null;
if(line){
    console.log("heya");
        map.removeLayer(line);      
}
      // Draw a line to the nearest gyre
      line= L.polyline([clickedLatLng, nearestGyre.latLng], {color: 'blue'}).addTo(map);
    });