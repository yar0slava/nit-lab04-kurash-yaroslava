var shop = {
	categories: [],
	products: [],
	findCategoryId: function (name) {
        var result;
        this.categories.forEach(function (value) {
            if (value.name == name) {
                result = value;
            }
        })
        return result.id;
    }
}

function createItems(array){
	array.forEach(function(object){
			
			$(".grid").append('\
			<div class="item" data-item-id="">\
	            <div class="item-photo"><img src=""></div>\
	            <a class="item-name"></a>\
	            <div class="price-buy-container">\
		            <button class="buy-button">buy</button>\
	            </div>\
            </div>\
            ');
            $(".grid").find(".item").last().attr("data-item-id", object.id);
            $(".grid").find("img").last().attr({
            	src: object.image_url
            });
            $(".grid").find(".item-name").last().text(object.name);

            if(object.special_price == null){
            	$(".grid").find(".price-buy-container").last().append('<div class="price"></div>');
            	$(".grid").find(".price").last().text(object.price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
            }else{
            	$(".grid").find(".price-buy-container").last().append('\
            		<div class="discount"></div>\
            		<div class="old-price"></div>\
            		');
            	$(".grid").find(".old-price").last().text(object.price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
            	$(".grid").find(".discount").last().text(object.special_price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
            }
    })
	// console.log(shop.products);
}

function createAllItems(){
$.ajax({
	type: "GET",
	url: "https://nit.tron.net.ua/api/product/list",
	dataType: "json",
	success: function (array) {
		// array.forEach(function(object){
		// 	// shop.products.push({
		// 	// 	id: object.id,
		// 	// 	name: object.name,
		// 	// 	descr: object.description,
		// 	// 	img_url: object.image_url,
		// 	// 	price: object.price,
		// 	// 	special_price: object.special_price
		// 	// })
		// })
		createItems(array);
		// console.log(shop.products);
	}
})
}



$(document).ready(function(){


	$.ajax({
	type: "GET",
	url: "https://nit.tron.net.ua/api/category/list",
	dataType: "json",
	success: function (array) {
		array.forEach(function(object){
			shop.categories.push({
				id: object.id,
				name: object.name,
				descr: object.description
			})
			$(".dropdown-content").append('<a class="select-category" href="#"></a>');
			$(".dropdown-content").find(".select-category").last().text(object.name);

			$(".sidebar-nested-list").append('<li><a class="select-category" href="#"></a></li>');
			$(".sidebar-nested-list").find(".select-category").last().text(object.name);
		})
		console.log(shop.categories);
	}
})

	createAllItems();

	$(".dropdown, .sidebar-nested-list").on("click", ".select-category",function (event) {

		if( $("#sidebar").hasClass('active') ){
			$("#sidebar").removeClass("active");
			$("#gray-background").removeClass("active");
		}

		if( $(this).text() != $(".current-category").text()){

			$(".item").remove();

			if( $(this).text() == "All goods" ){
				createAllItems();
			}else{
				$(".item").remove();
			    $(".current-category").text($(this).text());

			    var category_id = shop.findCategoryId($(this).text());
			
			    $.ajax({
				    type: "GET",
				    url: "https://nit.tron.net.ua/api/product/list/category/"+category_id,
			    	dataType: "json",
			    	success: function (array) {
				    	createItems(array);
				    }
		    	})
		    }
		}
	})

    $(".cart-total-container").on("click", ".purchase-btn", function (event){

    	$("#shopping-cart-sidebar").removeClass("active");
			$("#gray-background").removeClass("active");

    	$(".grid").remove();
    	$(".current-category").remove();

    	basket.products.forEach(function(object){

    		$(".goods").append('<div class="order-title">Order the purchase</div>');

    		$(".goods").append('\
    		<div class="order-item">\
				<div class="order-item-img">\
					<img src="">\
				</div>\
				<div class="order-item-info">\
					<a class="order-item-name"></a>\
					<div class="order-item-quantity">Amount: \
						<div class="order-quantity-input"></div>\
					</div>\
				</div>\
				<div class="order-item-price-container">\
					<div class="order-item-delete">\
						<span class="order-item-delete-btn">×</span>\
					</div>\
					<div class="order-item-price"></div>\
					<div class="order-item-total"></div>\
				</div>\
			</div>');

    		$(".goods").find(".order-item").last().attr("data-item-id", object.id);
            $(".goods").find("img").last().attr({
            	src: object.image_url
            });
            $(".goods").find(".order-item-name").last().text(object.name);
            $(".goods").find(".order-quantity-input").last().text(object.quantity);
            $(".goods").find(".order-item-price").last().text(basket.findItemPrice(object.name));
            $(".goods").find(".order-item-total").last().text(basket.calculatePrice(object.name));
		});

		$(".goods").append('\
			<div class="order-info">\
				<p>Enter your full name:</p>\
				<input class="customer-name" type="text" name="">\
				<p>Enter your phone number</p>\
				<input class="customer-phone-number" type="tel" pattern="" name="">\
				<p>Enter your email</p>\
				<input class="customer-email" type="email" name="">\
				<p></p>\
				<input class="submit-order" type="submit" name="" value="Submit order">\
			</div>');
    })

    $(".goods").on("click", ".submit-order", function (event){

    	// console.log($(".customer-name").val());
    	// console.log($(".customer-phone-number").val());
    	// console.log($(".customer-email").val());

    	var customer_name = $(".customer-name").val();
    	var customer_phone_number = $(".customer-phone-number").val();
    	var customer_email = $(".customer-email").val();

    	let products = {};

    	basket.products.forEach(function(object){
    		products[object.id] = object.quantity;
    	});

    	$.ajax({
    		url: "https://nit.tron.net.ua/api/order/add",
            dataType: "json",
            type: "POST",
            data: {
               token: "Lx9D0LEdo3DJFJsl216c",
               name: customer_name,
               phone: customer_phone_number,
               email: customer_email,
               products: products
            },
    		success: (json) => {
    			
    			if(json["status"] == "success"){
    				alert("Order sent successfully!");
    				$(".order-item").remove();
    				$(".order-info").remove();
    			}else{
    				var str = "";
    				if(json["errors"]["email"] != undefined){
    					str += "\n" + json["errors"]["email"][0]
    				}
    				if(json["errors"]["name"] != undefined){
    					str += "\n" + json["errors"]["name"][0]
    				}
    				if(json["errors"]["phone"] != undefined){
    					str += "\n" + json["errors"]["phone"][0]
    				}
    				alert(str + "\n" + " Try again.");
    			}
    			console.log(json);
    		}
    	})
    })

    $(".goods").on("click", "a.item-name", function (event){

    	$(".grid").remove();


    	$(".goods").append('\
    		<div class="item detail" data-item-id="">\
	            <div class="item-photo detail"><img src=""></div>\
	            <div class="item-info detail">\
	        	    <div class="item-name detail" href=""></div>\
	        	    <div class="price-buy-container detail">\
	        		    <button class="buy-button detail">buy</button>\
	        	    </div>\
	            </div>\
	        </div>\
	        <div class="item-descr detail">\
	        	<div class="item-descr-title detail">Detailed description of the device</div>\
	        	<div class="item-descr-body detail"></div>\
	        </div>');

        $.ajax({
        	type: "GET",
        	url: "https://nit.tron.net.ua/api/product/" + $(this).parent().attr("data-item-id"),
        	dataType: "json",
        	success: function (object){
        		$(".goods").find(".item").last().attr("data-item-id", object.id);
            	$(".goods").find("img").last().attr({
            		src: object.image_url
            	});
            	$(".goods").find(".item-name").last().text(object.name);
            	$(".goods").find(".price").last().text(object.price);

            	if(object.special_price == null){
            		$(".goods").find(".price-buy-container").last().append('<div class="price detail"></div>');
            		$(".goods").find(".price").last().text(object.price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
         	    }else{
           	 		$(".goods").find(".price-buy-container").last().append('\
            			<div class="discount detail"></div>\
            			<div class="old-price detail"></div>\
            			');
            		$(".goods").find(".old-price").last().text(object.price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
            		$(".goods").find(".discount").last().text(object.special_price.toString().replace(".00", "").replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "\u20B4");
           	 	}
           	 	$(".goods").find(".item-descr-body").last().text(object.description);
        	}
        })

    })

    $(".goods").on("click", ".current-category", function (event){

    	if( !$(this).siblings().is("div.grid")){

    		$(".detail").remove();
    		$(".goods").append('<div class="grid"></div>');

    		if( $(this).text() == "All goods" ){

				createAllItems();
				console.log("!!!!!!!!!!!!!!!!!!");
			}else{

			    var category_id = shop.findCategoryId($(this).text());
			
			    $.ajax({
				    type: "GET",
				    url: "https://nit.tron.net.ua/api/product/list/category/"+category_id,
			    	dataType: "json",
			    	success: function (array) {
				    	createItems(array);
				    }
		    	})
		    }
		}

    })

})
