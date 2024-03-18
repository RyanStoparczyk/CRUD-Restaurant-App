const restaurants = document.getElementById("restaurants-list");

Array.from(document.getElementsByClassName("restaurant-item"))
  .forEach((item, index) => {
    item.onmouseover = () => {
      restaurants.style.setProperty("--active-index", index)
    }
});