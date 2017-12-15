function initLiqPay() {
    var sum = require('../pizza/PizzaCart').getPizzaSum();
    var pizzas_in_order = "";

    require('../pizza/PizzaCart').getPizzaInCart().forEach(function (t) {
        pizzas_in_order += "- " + t.quantity + "шт. [" + (t.size === 'big_size' ? 'Велика' : 'Мала') + "] "
            + t.pizza.title + ";\n";
    });

    var order_info = {
        amount: sum,
        description: 'Замовлення піци: ' + $('#name-input').val() + '\n' +
        'Адреса доставки: ' + $("#address-input").val() + '\n' +
        'Телефон: ' + $('#phone-input').val() + '\n' +
        pizzas_in_order +
        '\nРазом ' + sum + 'грн'
    };
    require('../Server_API.js').createOrder(order_info, function (err, data) {
        if (!err) {
            LiqPayCheckout.init({
                data: data.data,
                signature: data.signature,
                embedTo: "#liqpay",
                mode: "popup"	//	embed	||	popup
            }).on("liqpay.callback", function (data) {
                console.log(data.status);
                console.log(data);
            }).on("liqpay.ready", function (data) {
                //	ready
            }).on("liqpay.close", function (data) {
                //	close
            });
        }
    });
}

exports.initLiqPay = initLiqPay;