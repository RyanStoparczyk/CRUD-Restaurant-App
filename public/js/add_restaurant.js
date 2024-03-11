/* 
  Grabs info from the DOM, then passes it as an object to the POST req function.
*/
function submit() {
  //retrieves values from the dom
  let name = document.getElementById('name').value;
  let delivery_fee = +document.getElementById('delivery_fee').value;
  let min_order = +document.getElementById('min_order').value;

  //constructs object
  let restaurant = {
    name: name,
    delivery_fee: delivery_fee,
    min_order: min_order,
  };
  postAddRestaurant(restaurant);
}

/*
Makes req to server.
Responds with status 200 and newly created restaurant object if successful.
- Then, the client will be redirected to the newly created page.
Responds with status 400 if submitted data was invalid
*/
async function postAddRestaurant(restaurant) {
  try {
    const res = await axios.post('http://localhost:3000/restaurants', restaurant);
    console.log(res.status + ': Success!');
    console.log(res.data);
    console.log(`Navigating to newly built page for Restaurant ${res.data.name}`);
    window.location.replace(`http://localhost:3000/restaurants/${res.data.id}`);
  } catch (err) {
    console.log(err);
    alert(
      'Please ensure you have filled out each text box. ' +
        'Also, ensure that you put in a number for delivery fee and minimum order.',
    );
  }
}
