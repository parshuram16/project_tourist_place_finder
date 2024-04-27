
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-btn').addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });

    fetchTouristPlaces();
});

let currentPage = 1;
const placesPerPage = 3;
let totalPages = 0;

function fetchTouristPlaces() {
  const apiKey = '7af61a0f49mshfb096746ae3bcefp17ee38jsnc64f17aae9f9';
  const apiUrl = 'https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=500&lon=38.364285&lat=59.855685';
  
  fetch(apiUrl, {
    headers: {
      'X-RapidAPI-Key': apiKey
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch tourist places');
    }
    return response.json();
  })
  .then(data => {
    displayTouristPlaces(data.features);
  })
  .catch(error => console.error('Error fetching tourist places:', error));
}

function displayTouristPlaces(places) {
  const placesList = document.getElementById('places-list');
  const pagination = document.getElementById('pagination');


  totalPages = Math.ceil(places.length / placesPerPage);


  const startIndex = (currentPage - 1) * placesPerPage;
  const endIndex = Math.min(startIndex + placesPerPage, places.length);

  
  placesList.innerHTML = '';
  for (let i = startIndex; i < endIndex; i++) {
    const place = places[i];
    const placeDiv = document.createElement('div');
    placeDiv.classList.add('place');
    
    const name = place.properties.name;
    const type = place.type;
    const rate = place.properties.rate;
    
    const nameElement = document.createElement('h2');
    nameElement.textContent = name;
    
    const typeElement = document.createElement('p');
    typeElement.textContent = 'Type: ' + type;

    const rateElement = document.createElement('p');
    rateElement.textContent = 'Rate: ' + rate;
    
    
    placeDiv.appendChild(nameElement);
    placeDiv.appendChild(typeElement);
    placeDiv.appendChild(rateElement);
    
    
    placeDiv.addEventListener('click', () => {
      openDetailsPage(place);
    });
    

    placesList.appendChild(placeDiv);
  }


  pagination.innerHTML = '';
  
  
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
      currentPage--;
      displayTouristPlaces(places);
    });
    pagination.appendChild(prevButton);
  }


  const pageCounter = document.createElement('span');
  pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
  pagination.appendChild(pageCounter);


  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      displayTouristPlaces(places);
    });
    pagination.appendChild(nextButton);
  }
}
  
function openDetailsPage(place) {
  const name = place.properties.name;
  const type = place.type;
  const distance = place.properties.dist;
  const rate = place.properties.rate;
  const osm = place.properties.osm;
  const wikidata = place.properties.wikidata;
  const xid = place.properties.xid;
  const coordinates = place.geometry.coordinates;
  const geometryType = place.geometry.type;
  const kinds = place.properties.kinds;

  const detailsWindow = window.open('', '_blank');
  detailsWindow.document.write(`
    <html>
    <head>
    <title>${name} Details</title>
    <link rel="stylesheet" href="style2.css">
    </head>
    <body>
    <div class="details-content">
    <h1>${name}</h1>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Distance:</strong> ${distance}</p>
    <p><strong>Rate:</strong> ${rate}</p>
    <p><strong>OSM:</strong> ${osm}</p>
    <p><strong>Wikidata:</strong> ${wikidata}</p>
    <p><strong>XID:</strong> ${xid}</p>
    <p><strong>Coordinates:</strong> ${coordinates.join(', ')}</p>
    <p><strong>Geometry Type:</strong> ${geometryType}</p>
    <p><strong>Kinds:</strong> ${kinds}</p>
    <button onclick="window.close()">Back</button>
    </div>
    </body>
    </html>
    
  `);
  detailsWindow.document.close();
}
