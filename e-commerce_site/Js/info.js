document.addEventListener("DOMContentLoaded", () =>{
    localData(); //main function who spread his data
});

const imageObj = {
    img1 : '',
    img2 : '',
    img3 : '',
};

//localstorage
function localData() {
    const raw = localStorage.getItem("productDetail");
    const productData = JSON.parse(raw);

    console.log("data -> ", productData);

    updateProductCard(productData);
    cartFunctionality(productData);
}

//functionality to update product-card info
function updateProductCard(productData){

    //store images
    imageObj.img1 = productData.src1;
    imageObj.img2 = productData.src2;
    imageObj.img3 = productData.src3;
    imageToggle();

    // console.log(imageObj);


    //now update card!
    const title_1 = document.getElementById("title");
    const title_2 = document.getElementById("title2");
    title_1.innerText = productData.title;
    title_2.innerText = productData.title;

    const desc_1 = document.getElementById("desc");
    const desc_2 = document.getElementById("desc2");
    desc_1.innerText = productData.desc;
    desc_2.innerText = productData.desc;

    const price_1 = document.getElementById("price1");
    const price_2 = document.getElementById("price2");
    price_1.innerText = productData.price;
    price_2.innerText = productData.price2;

    const mainImg = document.getElementById("mainImg");
    const secImg = document.getElementById("secImg");
    mainImg.setAttribute("src", productData.mainImg);
    secImg.setAttribute("src", productData.src1);

    //update review cards
    const reviewList = document.getElementById("p-review");
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for(let idx=1; idx<=3; idx++) {
        const review = reviewList.querySelector(`.review${idx}`);
        const reviewData = productData.reviews[idx-1];

        const date = new Date(reviewData.date);
        const random = Math.floor(Math.random() * 10) + 1
        const name = reviewData.name == "undefined" ? `user${random+1}4` : reviewData.name;

        review.querySelector(`.r${idx}-name`).innerText = name;
        review.querySelector(`.r${idx}-date`).innerText = `${date.getDate()} ${week[date.getDay()]} ${date.getFullYear()}`;
        review.querySelector(`.r${idx}-comment`).innerText = reviewData.comment;
        review.querySelector(`.r${idx}-rating`).innerText = `${reviewData.rating} Star`;
    }

    //some other essential factors - policy, rating, discount etc.
    const discount = document.querySelector(".discount");
    discount.textContent = `${productData.discount}%`;

    document.querySelector(".rating1").innerText = `rating: ${productData.rating}`;
    document.querySelector(".stock").innerText = productData.available;
    document.querySelector(".warrenty").innerText = productData.warrenty;
    document.querySelector(".rating2").innerText = `${productData.rating} Star`;
    document.querySelector(".policy").innerText = productData.returnPolicy;

    //rating star updating
    const stars = document.querySelectorAll(".star");
    let totalRating = productData.rating;
    let starPrint = 0;

    if(totalRating <= 5) {
        starPrint += totalRating;
    } else {
        starPrint += Math.floor(Math.random() * 5) + 1;
    }

    //now print stars
    for(let star of stars) {
        star.classList.add("text-yellow-400");
        starPrint--;

        if(starPrint == 0) break;
    }



    console.log("All updated, of product card!!");
}

function imageToggle() {
    const left = document.getElementById("leftToggle");
    const right = document.getElementById("rightToggle");
    const displayImg = document.getElementById("secImg");

    const images = [imageObj.img1, imageObj.img2, imageObj.img3];

    left.addEventListener("click", () => {
        if(displayImg.getAttribute("src") == images[0]) {
            displayImg.setAttribute("src", images[2]);

        } else if(displayImg.getAttribute("src") == images[1]) {
            displayImg.setAttribute("src", images[0]);
            
        } else if(displayImg.getAttribute("src") == images[2]){
            displayImg.setAttribute("src", images[1]);
        } else {
            console.log("Image didn't match!");
            displayImg.setAttribute("src", images[0]);
        }
    });

    right.addEventListener("click", () => {
        if(displayImg.getAttribute("src") == images[0]) {
            displayImg.setAttribute("src", images[1]);

        } else if(displayImg.getAttribute("src") == images[1]) {
            displayImg.setAttribute("src", images[2]);
            
        } else if(displayImg.getAttribute("src") == images[2]) {
            displayImg.setAttribute("src", images[0]);
        } else {
            console.log("Image didn't match!");
            displayImg.setAttribute("src", images[0]);
        }
    }); 
}

//cart functionality --
function cartFunctionality(data) {
    //make an object who holds all essential data for 'cart'
    const cartData = { 
        title : data.title,
        desc : data.desc,
        finalPrice : data.price, //actual price of item
        subPrice : data.price2,   //dummy price
        img : data.src1,
        discount : data.discount,
        id: data.id,
        quantity: 1,
    }

    console.log("Cart Data -> ", cartData);

    const cart = document.getElementById("cartBtn");
    cart.addEventListener("click", () => {
        //now upload on local
        localStorage.setItem("cartItem", JSON.stringify(cartData));

        console.log(`Page loads!`);
        setTimeout(() => {
            window.location.href = 'Cart.html';
        }, 1000)
    });
}