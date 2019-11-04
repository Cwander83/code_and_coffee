console.log('hello');


var map;


function place() {
  fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${google_api}`, {
        mode: 'no-cors'
      }
    )
     .then(
         function (response) {
           if (response.status !== 200) {
             console.log('Looks like there was a problem. Status Code: ' +
               response.status);
             return;
           }

           // Examine the text in the response
           response.json().then(function (data) {
             console.log(data);
           });
         }
       )
       .catch(function (err) {
         console.log('Fetch Error :-S', err);
       });

}

place();


// function initMap() {
//   var sydeny = { lat: -34.397, lng: 150.644 };

//   map = new google.maps.Map(document.getElementById('map'), {
//     center: sydeny,
//     zoom: 4,
//   });
//   var marker = new google.maps.Marker({ position: sydeny, map: map });
// }