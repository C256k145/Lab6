const app = new Vue({
  el: '#app',
  data: {
    stops: [],
    numStops: 10,
    position: { lat: null, lon: null}
  },
  created: function () {
    fetch('https://utils.pauliankline.com/stops.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        app.stops = myJson;
        setDistance();
      });
    },
  computed: {
    filteredStops: function() {
      return this.stops.sort(function(a,b) {return a.distance-b.distance;}).slice(0, this.numStops);
    }
  }
})
let watchID;
function setDistance() {
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      app.stops.forEach(stop => {
         stop.distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, stop.lat, stop.lon).toFixed(2);
      });
    });
    watchID = navigator.geolocation.watchPosition(function(position) {
      app.stops.forEach(stop => {
         stop.distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, stop.lat, stop.lon).toFixed(2);
      });
    });
  }
}
//code to convert to km from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
