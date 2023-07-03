import { count, apiKey } from "./config.js";

const modeBtn = document.getElementById("mode-btn");
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let currentQuery = "";
let firstLoad = true; // Flag variable for the first load of photos

//check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Get Photos from Unsplash API
async function getPhotos(query = currentQuery) {
  try {
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${query}`;
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (firstLoad) {
      loader.hidden = true; // Hide the loader after the first load
      firstLoad = false; // Set the flag to false after the first load
    }
  } catch (error) {
    // Catch error here
  }
}

// Create Elements For Links & Photos, Add to DOM
document.getElementById("title").innerHTML =
  "Random<br />Photo gallery<br />Infinite Scroll";
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
    img.setAttribute("class", "img-shadow");
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
    // Put both <p> inside .item-info
    itemInfo.appendChild(photoAuthor);
    itemInfo.appendChild(photoDesc);
    // Put img and .item-info inside .grid-item
    gridItem.appendChild(img);
    gridItem.appendChild(itemInfo);
    // Put .grid-item inside <a>
    link.appendChild(gridItem);
    // Put each <a> inside .image-container
    imageContainer.appendChild(link);
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
  currentQuery = query; // Store the current search query
  getPhotos(query);
}

// Check to see if scrolling near the bottom of the page (90% of the page height), Load more Photos
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight * 0.9 && ready) {
    ready = false;
    getPhotos(currentQuery);
  }
});

//  Event listener for click on Light/Dark mode
document.getElementById("mode-icon").classList.add("fa-moon");

modeBtn.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    document.getElementById("mode-icon").classList.remove("fa-sun");
    document.getElementById("mode-icon").classList.add("fa-moon");
    document.getElementById("mode-text").innerHTML = "Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    document.querySelector("img.img-shadow").classList.remove("img-shadow");
    document.getElementById("mode-icon").classList.remove("fa-moon");
    document.getElementById("mode-icon").classList.add("fa-sun");
    document.getElementById("mode-text").innerHTML = "Light Mode";
    localStorage.setItem("theme", "dark");
  }
});

// On Load
getPhotos();
