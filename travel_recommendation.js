const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const resultDiv = document.getElementById('result');

function search() {
  const query = searchInput.value.toLowerCase().trim();
  resultDiv.innerHTML = '';

  if (!query) return;

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let results = [];

      if (query.includes('beach') || query.includes('beaches')) {
        results = data.beaches;
      } else if (query.includes('temple') || query.includes('temples')) {
        results = data.temples;
      } else if (query.includes('country') || query.includes('countries')) {
        data.countries.forEach(country => {
          results = results.concat(country.cities);
        });
      } else {
        data.countries.forEach(country => {
          if (country.name.toLowerCase().includes(query)) {
            results = results.concat(country.cities);
          }
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(query)) {
              results.push(city);
            }
          });
        });
        data.temples.forEach(temple => {
          if (temple.name.toLowerCase().includes(query)) {
            results.push(temple);
          }
        });
        data.beaches.forEach(beach => {
          if (beach.name.toLowerCase().includes(query)) {
            results.push(beach);
          }
        });
      }

      if (results.length > 0) {
        results.forEach(item => {
          resultDiv.innerHTML += `
            <div class="card">
              <img src="${item.imageUrl}" alt="${item.name}">
              <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
              </div>
            </div>
          `;
        });
      } else {
        resultDiv.innerHTML = `<p style="color:white; text-align:center;">No results found. Try beach, temple, or country.</p>`;
      }
    });
}

searchBtn.addEventListener('click', search);
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  resultDiv.innerHTML = '';
});
