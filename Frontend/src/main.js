$(function(){
    // This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Order = require("./order/Order");

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
});