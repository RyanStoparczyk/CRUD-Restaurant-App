/* 
  Helper function for addItemHandler()
*/
 function itemReader() {
  // read from DOM
  let name = document.getElementById('menu_item').value;
  let category = document.getElementById('categories_select').value;
  let description = document.getElementById('menu_item_description').value;
  let price = +document.getElementById('menu_item_price').value;
  textboxWiper();
  if(name != '' && category != '' && description != '' && price) {
    let menu_item = {
      name: name,
      description: description,
      price: price,
    }
    return { category, menu_item };
  } else {
    return 0;
  }
}

/* 
  Helper function for modRestInfo()
*/
function infoReader() {
  let name = document.getElementById('name').value;
  let delivery_fee = +document.getElementById('delivery_fee').value;
  let min_order = +document.getElementById('min_order').value;
  textboxWiper();
  return { name, delivery_fee, min_order }
}
