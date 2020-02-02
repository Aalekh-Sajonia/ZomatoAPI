const insert = document.querySelector(".insert");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const load = document.querySelector(".myLoader");
const cityInput = document.querySelector(".cityInput");
const search = document.querySelector(".searchBtn");
let page = 0;
let str = "";
let totalPages = 0;

function clearHTMl() {
  insert.innerHTML = '';
}

function loader() {
  const text = `<div style="text-align: center; padding: 30px">
    <div class="spinner-border" style="width: 10rem; height: 10rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`;
  load.insertAdjacentHTML('afterbegin', text);
}

function clearLoader() {
  load.innerHTML = '';
}

next.addEventListener('click', () => {
  console.log("next");
  if (page < totalPages) {
    clearHTMl();
    page++;
    getDetails(str);
  }
});

search.addEventListener('click', () => {
  clearHTMl();
  page = 0;
  str = cityInput.value;
  if (str != "") {
    getDetails(str);
  }
})

prev.addEventListener('click', () => {
  console.log("prev");
  if (page > 0) {
    clearHTMl();
    page--;
    getDetails(str);
  }
});



function print(arr) {
  arr.forEach((ele, index) => {
    const text = `<div class="col mb-4">
      <div class="card">
      <div id="carouselExampleFade${index}" class="carousel slide carousel-fade" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${ele.restaurant.photos[0].photo.thumb_url}" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="${ele.restaurant.photos[1].photo.thumb_url}" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="${ele.restaurant.photos[2].photo.thumb_url}" class="d-block w-100" alt="...">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleFade${index}" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleFade${index}" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
        <div class="card-body">
          <h5 class="card-title">${ele.restaurant.name}</h5>
          <p class="card-text">${ele.restaurant.location.address}</p>
        </div>
      </div>
    </div>`;
    insert.insertAdjacentHTML('beforeend', text);
    console.log(ele.restaurant.name);
  })
}

async function getDetails(str) {
  try {
  loader();
  const result = await fetch(`https://developers.zomato.com/api/v2.1/locations?query=${str}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-key": "8ab2591c8220028622a5d46a7a3198a5"
    }
  });
  const resultJson = await result.json();

  console.log(resultJson.location_suggestions[0]);
  const locationId = resultJson.location_suggestions[0].entity_id;
  const locationEntityType = resultJson.location_suggestions[0].entity_type;

  const resResults = await fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=${locationId}&entity_type=${locationEntityType}&start=${page*20}&count=20`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-key": "8ab2591c8220028622a5d46a7a3198a5"
    }
  });
  const resJson = await resResults.json();
  clearLoader();
  print(resJson.restaurants);
  totalPages = resJson.results_found;
  }
  catch(err) {
     console.log("Error Occured While fetching");
  }
}

// getDetails(str);
