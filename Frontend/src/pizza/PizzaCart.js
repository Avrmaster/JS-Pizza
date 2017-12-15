String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = 37*hash+char; // Convert to 32bit integer
        hash = hash & hash;
    }
    return hash;
};

var Templates = require('../Templates');

var basil = require('basil.js');
var Storage = new basil();
var CART_KEY = "cart_content";

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML елемент куди будуть додаватися піци
var $cart = $("#cart-list");
var $order_cnt = $("#order-cnt");
var $order_price = $("#order-price");
var $emptyPhr = $("#emptyPhr");
var $order_btn = $("#order-btn");

$order_btn.click(function() {
    if (!$order_btn.hasClass("disabled")) {
        window.location.assign("order");
    }
});
$("#edit-btn").click(function () {
    window.location.assign("/"); //main
});


$("#order-clear-btn").click(function() {
    Cart.forEach(function (el) {
        removeFromCart(el);
    })
});

function getId(cart_item) {
    return (cart_item.pizza.title+cart_item.size_name).hashCode();
}
function getCartElement(cart_item) {
    return $cart.find("#"+getId(cart_item));
}

function addToCart(pizza, size, quantity) {
    var to_push = {
        pizza: pizza,
        price: pizza[size].price,
        weight: pizza[size].weight,
        diameter: pizza[size].size,
        size: size,
        size_name: size === "small_size"? "Мала" : "Велика",
        quantity: quantity? quantity : 1,
        editable: !window.location.href.contains("order")
    };
    to_push.id = getId(to_push);

    var found = false;
    for (var i = Cart.length - 1; i >= 0; i--) {
        if (getId(Cart[i]) === to_push.id) {
            Cart[i].quantity += 1;
            found = true;
            break;
        }
    }
    if (!found) {
        Cart.push(to_push);
        updateCart(to_push);
    } else {
        updateCart();
    }
}

function removeFromCart(cart_item) {
    getCartElement(cart_item).slideUp(function() {
        for (var i = Cart.length - 1; i >= 0; i--) {
            if (cart_item.id === Cart[i].id) {
                Cart.splice(i, 1);
            }
        }
        updateCart();
    });
}

function initialiseCart() {
    var cart_content = Storage.get(CART_KEY);
    if (cart_content) {
        cart_content.forEach(function (t) {
            addToCart(t.pizza, t.size, t.quantity);
        });
    }
    updateCart();
}

function getPizzaInCart() {
    return Cart;
}

function updateCart(to_slide_down) {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    var itemsCount = 0;
    var orderPrice = 0;
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);

        $node.find(".plus").click(function(){
            cart_item.quantity += 1;
            updateCart();
        });
        $node.find(".minus").click(function(){
            cart_item.quantity -= 1;
            if (cart_item.quantity <= 0) {
                removeFromCart(cart_item);
            } else {
                updateCart();
            }
        });
        $node.find(".delete").click(function() {
            removeFromCart(cart_item);
        });

        $node.attr("id", cart_item.id);

        orderPrice += cart_item.quantity*cart_item.price;
        itemsCount += cart_item.quantity;
        $cart.append($node);
        if (to_slide_down && to_slide_down === cart_item) {
            $node.css("display", "none");
            $node.slideDown(80);
        }
    }

    Cart.forEach(showOnePizzaInCart);

    Storage.set(CART_KEY, Cart);

    $order_price.html("<b>Сума замовлення: <span style='float: right;'>"+orderPrice+"грн"+"</span></b>");
    $order_cnt.text(itemsCount);
    if (Cart.length === 0) {
        $emptyPhr.slideDown();
        $order_price.slideUp();
        $order_btn.addClass("disabled");
    } else {
        $emptyPhr.slideUp();
        $order_price.slideDown();
        $order_btn.removeClass("disabled");
    }
}

function getPizzaSum() {
    var sum = 0;
    Cart.forEach(function (t) {
        sum += parseInt(t.pizza[t.size].price) * parseInt(t.quantity);
    });
    return sum;
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;

exports.getPizzaSum = getPizzaSum;