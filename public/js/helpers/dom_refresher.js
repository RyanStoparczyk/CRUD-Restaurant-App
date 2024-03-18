
//  Helper function for addCategoryHandler.
function categoryRefresher(newCategory) {
  let catLinkNode = document.createElement('a');
  let linkTextNode = document.createElement('STRONG');
  let brNode0 = document.createElement('br');
  let brNode1 = document.createElement('br');

  catLinkNode.href = `#${newCategory.replace(' ', '_')}`;
  linkTextNode.innerHTML = `${newCategory}`;
  catLinkNode.append(linkTextNode, brNode0, brNode1);
  document.getElementById('category_links').append(catLinkNode);

  let catMenuDivNode = document.createElement('div');
  let catMenuHeadNode = document.createElement('h3');

  catMenuDivNode.id = `${newCategory.replace(' ', '_')}`;
  catMenuHeadNode.innerText = `${newCategory}`;
  catMenuDivNode.append(catMenuHeadNode);
  document.getElementById('itemized_menu').append(catMenuDivNode);

  let catSelectNode = document.createElement('option');

  catSelectNode.value = newCategory;
  catSelectNode.innerText = newCategory;
  document.getElementById('categories_select').append(catSelectNode);
}

/* 
  Helper function called by addMenuItemHandler()
  Reconstructs the dom menu of the specified category with local information.
*/
function menuRefresher(indexCategory, indexItem) {
  let categoryObj = cached_rest.menu[indexCategory];

  let foodItem = categoryObj.items[indexItem];
  let category_name = categoryObj.category.replace(' ', '_');
  let domMenu = document.getElementById(category_name);

  let nameNode = document.createElement('p');
  let descNode = document.createElement('p');
  let priceNode = document.createElement('p');
  let brNode = document.createElement('br');

  nameNode.innerHTML = `${foodItem.name}`;
  descNode.innerHTML = `${foodItem.description}`;
  priceNode.innerHTML = `$${Number(foodItem.price).toFixed(2)}`;

  domMenu.append(nameNode, descNode, priceNode, brNode);
}

// updates the view for the restaurant info field.
function infoRefresher() {
  console.log('Updating menu.');
  document.getElementById('res_name').innerHTML = cached_rest.name;
  document.getElementById('res_fee').innerHTML =
    `Delivery Fee: $${Number(cached_rest.delivery_fee).toFixed(2)} | ` +
    `Minimum Order: $${Number(cached_rest.min_order).toFixed(2)}`;
}

//  Helper function that clears all textboxes. 
function textboxWiper() {
  let reset_fields = document.getElementsByClassName('resetme');
  for (let i = 0; i < reset_fields.length; i++) {
    reset_fields[i].value = '';
  }
}
