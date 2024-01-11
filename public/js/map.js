let map;

const coordinates = listing.geometry.coordinates;
const lat = coordinates[1];
const lng = coordinates[0];
const loc = listing.location;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    center:{lat,lng},
    zoom: 12,
  });


 

  const infoWindow =new google.maps.InfoWindow({
    content:`<h5>${listing.title}</h5><p>Exact Location Will Be provided after booking</p>`,
  })

  const marker = new google.maps.Marker({
    position:{lat,lng},
    map:map,
    title:listing.location,
    animation: google.maps.Animation.DROP,
  })

  marker.addListener("click", () => {
    infoWindow.open(map,marker);
  });
  
}

initMap();
  