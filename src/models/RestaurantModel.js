const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name for the menu item.']
    },
    description: {
      type: String,
      required: [true, 'Please enter a description for the item.']
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price for the menu item.']
    }
  }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name for the restaurant.']
    },
    min_order: {
      type: Number,
      required: [true, 'Please enter the minumum price for an order']
    },
    delivery_fee: {
      type: Number,
      required: [true, 'Please enter the delivery fee for the restaurant.']
    },
    menu: [{
      category: String,
      items: [itemSchema]
    }]
  }
);

restaurantSchema.post('save', function(doc){
  console.log(`Restaurant ${doc._id} has been saved`);
});

itemSchema.post('save', function(doc){
  console.log(`Item ${doc._id} has been saved`);
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
