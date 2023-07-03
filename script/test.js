const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const count = 23;
const apiKey = "gr-kIaCdwKqo2v6IRvHHGa-CTXzR2m1s05cLq4TfNT4";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

//check if all images were loaded
function imageLoaded() {
  imageLoaded++;
  if (imageLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    console.log("ready= ", ready);
  }
}

// Get Photos from Unsplash API
async function getPhotos(query) {
  try {
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${query}`;
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    // Catch error here
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  //Run function for each object in photosArray
  photosArray.forEach((photo) => {
    //Create <.grid-item> to nest photo and info
    const gridItem = document.createElement("div");
    gridItem.setAttribute("class", "grid-item");
    //Create <a> to link to Usnplash
    const link = document.createElement("a");
    link.setAttribute("class", "item-link");
    link.setAttribute("href", photo.links.html);
    link.setAttribute("target", "_blank");
    // Create <img> for photo
    const img = document.createElement("img");
    img.setAttribute("src", photo.urls.small);
    img.setAttribute("alt", photo.alt_description);
    img.setAttribute("title", photo.alt_description);
    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);
    //Create <.item-info> to hold info
    const itemInfo = document.createElement("div");
    itemInfo.setAttribute("class", "item-info");
    // Create <p> element for Author's name
    const photoAuthor = document.createElement("p");
    photoAuthor.textContent = "Photo by " + photo.user.name;
    photoAuthor.setAttribute("class", "photo-author");
    // Create <p> element for Photo's description
    const photoDesc = document.createElement("p");
    photoDesc.textContent = photo.description;
    photoDesc.setAttribute("class", "photo-desc");
    // Put both <p> inside <.item-info>
    itemInfo.appendChild(photoAuthor);
    itemInfo.appendChild(photoDesc);
    // Put <img> inside <a>, then <a> inside the <.grid-item> and put <.grid-item> inside imageContainer element
    imageContainer.appendChild(link);
    link.appendChild(gridItem);
    gridItem.appendChild(itemInfo);
    gridItem.appendChild(img);
  });
}

// Change h1 content with user's input
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    var inputValue = document.getElementById("search-input").value;
    var concatenatedString =
      inputValue + "<br>Photo gallery<br>Infinite Scroll";

    document.getElementById("title").innerHTML = concatenatedString;
  });

// Listen to submission of the form with keyword
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", searchPhotos);

// When user type a keyword and submit the form, clear the images and add the keyword to the query
function searchPhotos(event) {
  event.preventDefault();
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.trim();
  searchInput.value = "";
  imageContainer.innerHTML = "";
  getPhotos(query);
}

// Check to see if crolling near bottom of page, Load more Pohotos
window.addEventListener("scroll", () => {
  if (document.body.scrollTop + "100vh" && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
