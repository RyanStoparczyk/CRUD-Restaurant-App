const header = document.getElementById("header");

Array.from(document.getElementsByClassName("header-item"))
  .forEach((item, index) => {
    item.onmouseover = () => {
      header.style.setProperty("--active-index", index)
    }
});