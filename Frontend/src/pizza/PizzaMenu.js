var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
/** @type {Array} */
var server_api = require("../Server_API")
var Pizza_List = [];
server_api.getPizzaList(function(error, pizzas) {
    if (!error && pizzas) {
        Pizza_List = pizzas;
        filterPizza("");
    }
});

String.prototype.contains = function(another) {
    return this.toLowerCase().indexOf(another.toLowerCase()) !== -1;
};

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $filter_name = $("#filter-name");
var $filter_pizza_count = $("#filter-pizza-cnt");

function showPizzaList(list) {
    //Очищаємо старі піци в меню
    $pizza_list.html("");
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);
        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        $pizza_list.append($node);
    }
    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    Pizza_List.forEach(function(pizza) {
        if (
            (filter === "" || filter.contains("усі")) ||
            (filter.contains("м'ясні") && pizza.type.contains("м’ясна")) ||
            (filter.contains("вега") && pizza.type.contains("вега")) ||
            (filter.contains("з ананасами") && pizza.content.pineapple) ||
            (filter.contains("з грибами") && pizza.content.mushroom) ||
            (filter.contains("з морепродуктами") && pizza.content.ocean)
        ) {
            pizza_shown.push(pizza)
        }
    });
    //Показати відфільтровані піци
    // console.log(""+filter);
    if (filter.length > 0) {
        $filter_name.text(filter + (filter.contains("усі")? " піци" : ""));
        // $filter_name.text(filter);
    }

    $filter_pizza_count.text(pizza_shown.length);
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    var $menu_bar = $("#menu-bar");
    $menu_bar.on({
        "change": function() {
            filterPizza($menu_bar.find(".active").text())
        }
    });
    //усі
    filterPizza("Усі");
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;