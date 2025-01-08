const { Schema, model } = require('mongoose');
const sellerCustomerSchema = new Schema(
  {
    myId: {
      type: String,
      required: true,
    },
    myFriends: {
      type: Array,
      default: [],
    },
  },
  { timestamp: true }
);
module.exports = model('seller_customers', sellerCustomerSchema);
