function openSidebar() {
	document.getElementById("sidebar").classList.toggle('active');
	document.getElementById("gray-background").classList.toggle('active');
}

document.getElementById ("sidebar-btn").addEventListener ("click", openSidebar);

function openShoppingCartSidebar() {
	document.getElementById("shopping-cart-sidebar").classList.toggle('active');
	document.getElementById("gray-background").classList.toggle('active');
}

document.getElementById ("shopping-cart-sidebar-btn").addEventListener ("click", openShoppingCartSidebar);
