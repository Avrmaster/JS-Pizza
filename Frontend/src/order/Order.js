$(function () {
    var cart = require("../pizza/PizzaCart");


    var $proceedBtn = $("#order-proceed-btn");

    function setApproveListener($input, warnMessage, re) {
        var $parent = $input.parent();
        var $grandParent = $parent.parent();
        var $warn = $parent.find(".warning");

        function test() {
            var str = String($input.val());
            var passes = str.length === 0 || re.test(str);

            if (!passes) {
                if (str.length !== 0)
                    $parent.addClass("has-error");
                $parent.removeClass("has-success");
            } else {
                if (str.length !== 0)
                    $parent.addClass("has-success");
                $parent.removeClass("has-error");
            }
            $warn.html(passes ? "" : warnMessage);
        }

        $input.change(test);
        $input.keypress(test);
        $input.on("input", test);
    }

    var $nameInput = $("#name-input");
    var $phoneInput = $("#phone-input");
    var $addressInput = $("#address-input");
    setApproveListener($nameInput, "Ім'я має містити лише символи та пробіли!",
        /^[a-z а-яА-Я,.'-]+$/i);
    setApproveListener($phoneInput, "Некоретний телефон!",
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);


    var liqPay = require('./LiqPay');

    $proceedBtn.click(function () {
        liqPay.initLiqPay();
    });
});
