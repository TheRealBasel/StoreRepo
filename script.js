let products = [];

fetch("https://fakestoreapi.com/products?limit=12")
	.then((res) => res.json())
	.then(function (json) {
		products = json;
	});

let cart = [];
function addToCart(product) {
	let selectedProduct = products[product - 1];
	let productCount = 1;
	let productAlreadyFound = false;
	if (cart[selectedProduct]) {
		productCount = cart[selectedProduct].count++;
	}
	for (let i = 0; i <= cart.length; i++) {
		if (cart[i] && cart[i].name === selectedProduct.title) {
			cart[i].count++;
			productAlreadyFound = true;
		}
	}
	if (!productAlreadyFound) {
		cart.push({
			name: selectedProduct.title,
			price: selectedProduct.price,
			count: productCount,
			image: selectedProduct.image,
			description: selectedProduct.description,
		});
	}
	saveCart();
	let totalPrice = 0;
	for (let i = 0; i < cart.length; i++) {
		totalPrice += cart[i].price * cart[i].count;
	}

	document.getElementById(
		"totalPricePargraph"
	).innerText = `${totalPrice} SAR.`;
	var toastLiveExample = document.getElementById("priceToast");
	var toast = new bootstrap.Toast(toastLiveExample);

	toast.show();
}

// Save cart
function saveCart() {
	sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Load cart
function loadCart() {
	cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
}
if (sessionStorage.getItem("shoppingCart") != null) {
	loadCart();
}

/* Cart functions */

function getTotalPrice() {
	let subtotalPrice = 0;
	let totalPrice = 0;
	let shippingPrice = 0;
	let totalTax = 0;
	let totalDiscount = 0;
	for (let i = 0; i < cart.length; i++) {
		subtotalPrice += cart[i].price * cart[i].count;
	}
	totalTax = (15 / 100) * subtotalPrice;
	let shippingOption = Array.from(
		document.getElementsByName("deOptions")
	).find((r) => r.checked).value;
	if (shippingOption === "pickup") {
		shippingPrice = 0;
	} else if (shippingOption === "1day") {
		shippingPrice = 40;
	} else if (shippingOption === "1week") {
		shippingPrice = 20;
	}
	let discountCode = document.getElementById("couponText").value;
	if (discountCode && discountCode === "JS") {
		totalDiscount = (40 / 100) * subtotalPrice;
	}
	totalPrice = subtotalPrice;
	totalPrice = totalPrice - totalDiscount;
	totalPrice = totalPrice + shippingPrice;
	totalPrice = totalPrice + totalTax;
	return {
		total: totalPrice,
		subtotal: subtotalPrice,
		shipping: shippingPrice,
		tax: totalTax,
		discount: totalDiscount,
	};
}

var currentValue = 0;
function handleClick(myRadio) {
	let price = getTotalPrice();
	document.getElementById("subtotalText").innerText = Math.floor(
		price.subtotal
	);
	document.getElementById("shippinglText").innerText = Math.floor(
		price.shipping
	);
	document.getElementById("discountText").innerText = Math.floor(
		price.discount
	);
	document.getElementById("totalText").innerText = Math.floor(price.total);

	if (price.discount > 0) {
		document.getElementById("couponAppliedText").innerText =
			"You got a 40% discount.";
	} else {
		document.getElementById("couponAppliedText").innerText = "";
	}
}

function confirmOrder() {
	document.getElementById(
		"orderTextRE"
	).innerText = `Your order reference number is\n #${
		Math.floor(Math.random() * 100000) + 10000
	}`;
	document.getElementById("orderTextRE").classList = "text-center";
}

function addProductsToIndex(jsonArray) {
	for (let i = 0; i < jsonArray.length; i++) {
		document.getElementById("productsSection").innerHTML += `<div
        class="card mb-3 col-3"
        data-bs-toggle="modal"
        data-bs-target="#productInfoModal"
        style="cursor: pointer"
        >
        <div class="row g-0">
            <div class="col-md-4">
                <img
                    src="${jsonArray[i].image}"
                    class="img-fluid rounded-start zoom-hover"
                />
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${jsonArray[i].title}</h5>
                    <p class="card-text text-info">${jsonArray[i].price} SAR</p>
                    <button
                        type="button"
                        class="btn btn-outline-info"
                        data-bs-toggle="modal"
                        data-bs-target="#"
                        onclick="addToCart(${jsonArray[i].id})"
                    >
                        Add to cart
                        <i class="fa fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
        </div>`;
	}
}

function fetchProducts() {
	fetch("https://fakestoreapi.com/products?limit=12")
		.then((res) => res.json())
		.then((json) => addProductsToIndex(json));
}
