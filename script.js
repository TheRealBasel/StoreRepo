const products = [
    { name:"Apple Watch S6", price:1435 },
    { name:"Apple iPhone 12", price:4499 },
    { name:"MacBook Air 2020", price:4999 },
    { name:"Apple Airpods Pro", price:929 },
];

let cart = [];
function addToCart ( product ){
    let selectedProduct = products[product-1];
    let productCount = 1;
    let productAlreadyFound = false;
    if ( cart[selectedProduct] ){
        productCount = cart[selectedProduct].count++;
    }
    for ( let i = 0; i <= cart.length; i++){
        if (cart[i] && cart[i].name === selectedProduct.name) {
            cart[i].count++;
            productAlreadyFound = true;
        }
    }
    if ( !productAlreadyFound ){
        cart.push ({name:selectedProduct.name, price:selectedProduct.price, count:productCount});
    }
    saveCart();
    let totalPrice = 0;
    for ( let i = 0; i < cart.length; i++){
        totalPrice += cart[i].price * cart[i].count;
    }
    document.getElementById("totalPricePargraph").innerText = `${totalPrice} SAR.`;
    var toastLiveExample = document.getElementById('priceToast')
    var toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
}


// Save cart
function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Load cart
function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
}
if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
}

/* Cart functions */

function getTotalPrice (){
    let subtotalPrice = 0;
    let totalPrice = 0;
    let shippingPrice = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    for ( let i = 0; i < cart.length; i++){
        subtotalPrice += cart[i].price * cart[i].count;
    }
    totalTax = (15/ 100) * subtotalPrice;
    let shippingOption = Array.from(document.getElementsByName("deOptions")).find(r => r.checked).value;
    if ( shippingOption === "pickup"){
        shippingPrice = 0;
    }else if (shippingOption === "1day"){
        shippingPrice = 40;
    }else if (shippingOption === "1week"){
        shippingPrice = 20;
    }
    let discountCode = document.getElementById("couponText").value;
    if ( discountCode && discountCode === "JS"){
        totalDiscount = (40/ 100) * subtotalPrice;
    }
    totalPrice = subtotalPrice;
    totalPrice = totalPrice - totalDiscount;
    totalPrice = totalPrice + shippingPrice;
    totalPrice = totalPrice + totalTax;
    return {"total":totalPrice,"subtotal":subtotalPrice,"shipping":shippingPrice,"tax":totalTax,"discount":totalDiscount};
}

var currentValue = 0;
function handleClick(myRadio) {
    let price = getTotalPrice ();
    document.getElementById("subtotalText").innerText = Math.floor(price.subtotal);
    document.getElementById("shippinglText").innerText = Math.floor(price.shipping);
    document.getElementById("discountText").innerText = Math.floor(price.discount);
    document.getElementById("totalText").innerText = Math.floor(price.total);

    if ( price.discount > 0 ){
        document.getElementById("couponAppliedText").innerText = "You got a 40% discount.";
    }else{
        document.getElementById("couponAppliedText").innerText = "";
    }
}

function confirmOrder (){
    document.getElementById("orderTextRE").innerText = `Your order reference number is\n #${Math.floor(Math.random() * 100000) + 10000}`; 
    document.getElementById("orderTextRE").classList = "text-center";
}