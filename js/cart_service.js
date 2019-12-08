var basket = {
    products: [],
    findElement: function (name) {
        var result;
        this.products.forEach(function (value) {
            if (value.name == name) {
                result = value;
            }
        })
        return result;
    },
    findItemPrice: function (name) {
        var res = basket.findElement(name).price * 1;
        return res.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4";
    },
    calculatePrice: function (name) {
        var res = (basket.findElement(name).quantity * basket.findElement(name).price);
        return res.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4";  
    },
    calculateTotalPrice: function () {
        $(".cart-total").text(function () {
            var price = 0;
            basket.products.forEach(function (value) {
                price += value.quantity * value.price;
            })
            return price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4";
        })
    },
    calculateAmount: function () {
        $(".cart-products-amount").text(function () {
            var amount = 0;
            basket.products.forEach(function (value) {
                amount += value.quantity;
            })
            return amount;
        })
    }
};

$(document).ready(function(){

    $(".grid").on("click", ".buy-button", function (event) {

        var name = $(this).parent().siblings("a.item-name").text();
        var img_url = $(this).parent().parent().find("img").attr("src");
        var id = $(this).parent().parent().attr("data-item-id");
        var price;

        if($(this).siblings().is("div.price")){
            price = $(this).siblings("div.price").text().replace('\u20B4','').replace(" ","");
        }else{
            price = $(this).siblings("div.discount").text().replace('\u20B4','').replace(" ","");
        }

        
        if (basket.findElement(name) == undefined) {
            basket.products.push({
                name: name,
                quantity: 1,
                price: price,
                id: id,
                image_url: img_url
            });
            $(".shopping-cart-container").append('\
                <div class="cart-item" data-item-id="">\
                    <div class="cart-item-img">\
                        <img>\
                    </div>\
                    <div class="cart-item-info">\
                        <a class="cart-item-name"></a>\
                        <div class="cart-item-quantity">\
                            <div class="decrement-container">\
                                <span class="decrement">-</span>\
                            </div>\
                            <div class="quantity-input">1</div>\
                            <div class="increment-container">\
                                <span class="increment">+</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="cart-item-price-container">\
                        <div class="cart-item-delete">\
                            <span class="cart-item-delete-btn">&times;</span>\
                        </div>\
                        <div class="cart-item-price"></div>\
                        <div class="cart-item-total"></div>\
                    </div>\
                </div>\
            ')

            $(".shopping-cart-container").find("div.cart-item-img").last().children("img").attr({
                src: img_url
            });
            $(".shopping-cart-container").find("div.cart-item").last().attr("data-item-id", id);
            $(".shopping-cart-container").find("a.cart-item-name").last().text(name);
            $(".shopping-cart-container").find("div.cart-item-price").last().text(basket.findItemPrice(name));
            $(".shopping-cart-container").find("div.cart-item-total").last().text(basket.calculatePrice(name));
            
            $("div.cart-total-container").removeClass("hide");
        } else {

            if(basket.findElement(name).quantity<5){
                basket.findElement(name).quantity++;
                $("div.cart-item-total").eq(basket.products.indexOf(basket.findElement(name))).text(basket.calculatePrice(name));
                $("div.quantity-input").eq(basket.products.indexOf(basket.findElement(name))).text(basket.findElement(name).quantity);
            }
        }

        basket.calculateAmount();
        basket.calculateTotalPrice();

        console.log(basket.products);
        console.log(basket.findElement(name));
    })

    $(".shopping-cart-container").on("change paste", "div.quantity-input", function (event) {
        var itemName = $(event.target).parent().siblings("a.cart-item-name").text();
        basket.findElement(itemName).quantity = parseInt($(event.target).text());
        $(event.target).parents("div.cart-item").find("div.cart-item-total").text(basket.calculatePrice(itemName));
        basket.calculateAmount();
        basket.calculateTotalPrice();

        console.log(basket.products);
        console.log(basket.findElement(itemName));
    })

    $(".shopping-cart-container").on("click", ".decrement", function (event) {
        event.preventDefault();
        var itemName = $(event.target).parents("div.cart-item-info").find("a.cart-item-name").text();
        if (basket.findElement(itemName).quantity > 1) {
            basket.findElement(itemName).quantity--;
            $(event.target).parent().siblings("div.quantity-input").text(basket.findElement(itemName).quantity);
            $(event.target).parents("div.cart-item").find("div.cart-item-total").text(basket.calculatePrice(itemName));
            basket.calculateAmount();
            basket.calculateTotalPrice();
        }

        console.log(basket.products);
        console.log(basket.findElement(itemName));
    })

    $(".shopping-cart-container").on("click", ".increment", function (event) {
        event.preventDefault();
        var itemName = $(event.target).parents("div.cart-item-info").find("a.cart-item-name").text();
        if (basket.findElement(itemName).quantity < 5){
            basket.findElement(itemName).quantity++;
            $(event.target).parent().siblings("div.quantity-input").text(basket.findElement(itemName).quantity);
            $(event.target).parents("div.cart-item").find("div.cart-item-total").text(basket.calculatePrice(itemName));
            basket.calculateAmount();
            basket.calculateTotalPrice();
        }

        console.log(basket.products);
        console.log(basket.findElement(itemName));
    })

    $(".shopping-cart-container").on("click", ".cart-item-delete-btn", function (event) {
        event.preventDefault();
        var itemName = $(event.target).parents("div.cart-item").find("a.cart-item-name").text();
        basket.products.splice(basket.products.indexOf(basket.findElement(itemName)), 1);
        $(event.target).parents("div.cart-item").remove();
        basket.calculateAmount();

        if(basket.products.length == 0){
            $("div.cart-total-container").addClass("hide");
        }else{
            basket.calculateTotalPrice();
        }
        
        console.log("After delete: ");
        console.log(basket.products);
    })

    
})