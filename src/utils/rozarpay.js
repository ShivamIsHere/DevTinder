const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "randomKey123", 
  key_secret: "randomSecret456", 
});

module.exports = instance;
