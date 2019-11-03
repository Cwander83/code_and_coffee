console.log('hello');

var map;




function initMap() {
  var sydeny = { lat: -34.397, lng: 150.644 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: sydeny,
    zoom: 4,
  });
  var marker = new google.maps.Marker({ position: sydeny, map: map });
}


