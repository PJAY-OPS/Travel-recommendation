document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("btnSearch");
    const clearBtn = document.getElementById("btnClear");
    const searchInput = document.getElementById("searchInput");
    const resultDiv = document.getElementById("result");

    let data = null;

    // Fetch data
    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            console.log("Data loaded");
        })
        .catch(error => {
            console.error("Error loading JSON", error);
        });

    // Search function
    function doSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query || !data) return;

        resultDiv.innerHTML = "";
        let results = [];

        if (query.includes("beach") || query === "beaches") {
            results = data.beaches;
        } else if (query.includes("temple") || query === "temples") {
            results = data.temples;
        } else if (query.includes("country") || query === "countries") {
            // Show all countries cities
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } else {
            // Search for specific country name like japan, australia, brazil
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    results = results.concat(country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            results.push(city);
                        }
                    });
                }
            });
            // Also search temples and beaches by name
            data.temples.forEach(t => {
                if (t.name.toLowerCase().includes(query)) results.push(t);
            });
            data.beaches.forEach(b => {
                if (b.name.toLowerCase().includes(query)) results.push(b);
            });
        }

        if (results.length === 0) {
            resultDiv.innerHTML = `<p style="color:white; background:rgba(0,0,0,0.5); padding:10px;">No results found for "${query}". Try beach, temple, or country.</p>`;
            return;
        }

        results.forEach(place => {
            const card = `
                <div style="background:white; margin:15px 0; border-radius:10px; overflow:hidden; max-width:400px; box-shadow:0 4px 8px rgba(0,0,0,0.3);">
                    <img src="${place.imageUrl}" alt="${place.name}" style="width:100%; height:200px; object-fit:cover;">
                    <div style="padding:15px;">
                        <h3 style="margin:0 0 10px 0;">${place.name}</h3>
                        <p style="font-size:14px; color:#555;">${place.description}</p>
                    </div>
                </div>
            `;
            resultDiv.innerHTML += card;
        });
    }

    // Events
    if (searchBtn) {
        searchBtn.addEventListener("click", doSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                doSearch();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            resultDiv.innerHTML = "";
        });
    }
});
