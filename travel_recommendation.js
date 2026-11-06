const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultDiv = document.getElementById('result');

function searchCondition() {
  const input = document.getElementById('searchInput').value.toLowerCase().trim();
  resultDiv.innerHTML = '';

  fetch('./travel_recommendation_api.json')
    .then(res => res.json())
    .then(data => {
      let results = [];
      if (input === 'beach' || input === 'beaches') results = data.beaches;
      else if (input === 'temple' || input === 'temples') results = data.temples;
      else if (input === 'country' || input === 'countries') {
        data.countries.forEach(c => c.cities.forEach(city => results.push(city)));
      } else {
        data.countries.forEach(c => {
          if (c.name.toLowerCase().includes(input)) c.cities.forEach(city => results.push(city));
          c.cities.forEach(city => { if (city.name.toLowerCase().includes(input)) results.push(city); });
        });
        data.beaches.forEach(b => { if (b.name.toLowerCase().includes(input)) results.push(b); });
        data.temples.forEach(t => { if (t.name.toLowerCase().includes(input)) results.push(t); });
      }
      if (results.length) {
        results.forEach(i => {
          resultDiv.innerHTML += `<div><img src="${i.imageUrl}"><h3>${i.name}</h3><p>${i.description}</p></div>`;
        });
      } else {
        resultDiv.innerHTML = `No results`;
      }
    });
}
function clearSearch() {
  document.getElementById('searchInput').value = '';
  resultDiv.innerHTML = '';
}
searchBtn.addEventListener('click', searchCondition);
clearBtn.addEventListener('click', clearSearch);
