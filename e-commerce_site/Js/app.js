// const { prod } = require("mathjs");

// const { map } = require("mathjs");

document.addEventListener("DOMContentLoaded", () => {
    //Home functionality
    HomeFunctionality();
    
    //navbar 
    barFunction();
    searchDisplay();

    // apiTest();

    //product switching
    productPage();

    //switch by category
    categoryOfProduct();

    //more products call
    moreProducts();

    //localstorage setting
    if(!localStorage.getItem("cartData")) {
        let map = new Map();

        localStorage.setItem("cartData", JSON.stringify([...map]));
        console.log("map at local -> ", localStorage.getItem("cartData"));
    }
    
    console.log("localstorage -> ", localStorage);
});

// <----- Nav bar ----->

//hamburger/bar functionality
function barFunction() {
    const dropdown = document.getElementById("drop_list");
    document.getElementById("barToggler").addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if(!dropdown.classList.contains("hidden") && e.target) {
            console.log("droplist getclose!");
            
            setTimeout(() => {
                dropdown.classList.add("hidden");
            }, 150);
        }
    });
}

//search-bar functionality
function searchDisplay() {
    const sIcon = document.getElementById("searchIcon");
    const xMark = document.getElementById("xIcon");

    const sInp = document.getElementById("searchInp");
    let navEle = document.querySelectorAll(".nav");

    sIcon.addEventListener("click", () => {
        for(let nav of navEle) {
            nav.classList.toggle("hidden");
        }

        sInp.classList.toggle("hidden");
       
        sIcon.classList.toggle("hidden");
        xMark.classList.toggle("hidden");
    });

    xMark.addEventListener("click", () => {
        for(let nav of navEle) {
            nav.classList.toggle("hidden");
        }

        sInp.classList.toggle("hidden");
       
        sIcon.classList.toggle("hidden");
        xMark.classList.toggle("hidden");
    });
}

//Home button functionality to go back Home (cart done! , )
function HomeFunctionality() {

    const heroSec = document.getElementById("hero1"); //avatar
    const categorySec = document.getElementById("main_section2"); //category listing
    const cart = document.getElementById("myCart"); //Your cart
    const homeBtn = document.querySelectorAll(".homeIcon"); //Home buttons of dropdown & navbar
    const moreItemSec = document.getElementById("main_section3");

    for(let btn of homeBtn) {
        btn.addEventListener("click", () => {
            console.log("Home button was Click!");

            if(heroSec.classList.contains("hidden")) heroSec.classList.remove("hidden");
            if(categorySec.classList.contains("hidden")) categorySec.classList.remove("hidden");
            if(!cart.classList.contains("hidden")) cart.classList.add("hidden");
            if(moreItemSec.classList.contains("hidden")) moreItemSec.classList.remove("hidden");
        });
    }
}

// api Test for products
async function apiTest() {
    const url = 'https://dummyjson.com/products/category-list';
    const raw = await fetch(url);
    const data = await raw.json();
    console.log(data);

 
    for(let item of data) {
        const products = await callAllProductCategories(item);
        noteAllProducts(products);
    }
}

async function callAllProductCategories(data) {
    const url = `https://dummyjson.com/products/category/${data}?limit=0`;
    const raw = await fetch(url);
    const jsonData = await raw.json();

    return jsonData.products;
}

function noteAllProducts(products) {
    let count = 0;
    for(let product of products) {
        console.log(`product ${count} - ${product.title} , ${product.price} , ${product.images[0]}`);
        count++;
    }
}

// More products functionality 
async function moreProducts() {
    const info = {
        products : [],
        status : 0,
    }
    
    //api data fetching
    try {
        const url = `https://fakestoreapi.com/products`;
        const raw = await fetch(url);
        const data = await raw.json();

        for(let d of data) {
            info.products.push(d);
        }

        info.status = raw.status; //store status 200 , 404 etc
        console.log("More products loaded successfully!");
        console.log("API status -> ", raw.status);
    } catch(err) {
        console.log("failed to fetch api data!!");
        return;
    }


    //dom connecting
    if(info.status == 200) {
        const itemList = document.getElementById("moreItems");

        for(let item of info.products) {
            // console.log(item);
            const newLi = document.createElement("li");

            newLi.classList.add("w-full", "min-w-[250px]", "lg:max-w-[300px]", "xl:max-w-[330px]", "bg-white", "shadow-sm", "hover:shadow-md", "hover:scale-[1.02]", "transition-all", "delay-75", "duration-100", "ease-linear", "rounded-md", "flex", "flex-col", "p-1", "mx-auto", "product-item", "h-auto");

            newLi.innerHTML = `
                    <img src=${item.image}  
                    class="w-full max-w-[95%] mx-auto object-center object-cover max-h-[220px]"
                    loading="lazy">
                    
    
                    <div class="flex flex-col p-4 gap-1 tracking-wide">
                    
                        <span class="text-xl font-semibold item_name">
                            ${item.title}
                        </span>

    
                        <p class="text-xs font-wide line-clamp-4 item_desc">
                            ${item.description}
                        </p> 

                        <hr class="border-gray-400 my-3 w-full">
    
                        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-base font-light">
                            <span class="text-xl sm:text-2xl font-medium item_price">
                                $${item.price}
                            </span>

                            <div class="flex gap-1 items-center text-gray-500 text-sm sm:gap-2 sm:text-lg">
                                <span class="tracking-wider text-base">
                                    M.R.P
                                </span>

                                <span class="line-through item_price2">
                                    $${item.price + 99}
                                </span>
                            </div>
                        </div> 
    
                        <button class="w-full max-w-[75%] mx-auto p-2 mt-6 bg-yellow-400 rounded-full text-base text-gray-200 font-semibold border border-yellow-400 hover:bg-white hover:text-gray-600 cursor-pointer transition-all delay-75 duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md item_cartBtn">
                            <span>Add to Cart</span>
                        </button>
                    </div>
            `;

            itemList.appendChild(newLi);
        }
    } 
    
}

 
//  <-------- Secondary Pages functionality -------->

//product page switching
function productPage() {
    document.getElementById("main_section1").addEventListener("click", (e) => {
        const prod = e.target.closest(".productIcon");
        if(prod) {
            console.log("product icon click!");
            window.location.href='products.html';
        } 
    });
}


//category-wise product switching -->
function categoryOfProduct() {
    const categoryMap = {
        cloths : ["mens-shirts", "womens-dresses", "tops", "mens-shoes", "womens-shoes"],
        mixed1 : ["mens-shirts", "tops", "mens-shoes", "sunglasses", "mens-watches", "womens-watches", "skin-care", "beauty", "fragrances", "womens-bags", "womens-jewellery"],
        mixed2 : ["laptops", "smartphones", "tablets", "mobile-accessories"],
        electronics : ["laptops", "smartphones", "tablets", "mobile-accessories"],
        groceries : ["groceries"],
        furniture : ["furniture", "home-decoration", "kitchen-accessories"],
        sport : ["sports-accessories"],
        vehicals : ["motorcycle", "vehicle"],
    };

    document.getElementById("category").addEventListener("click", (e) => {
        const data = e.target.closest(".cat");
        const category = data.dataset.category;
        console.log("category click -> ", data.dataset.category);

        setTimeout(() => {
            if(category == undefined) {
                console.log("underfined category !");
                return;
            }
            else if(category) {
                localStorage.setItem("selectedCategory", JSON.stringify(categoryMap[data.dataset.category]));
                window.location.href = 'category-prod.html';
            }
        }, 500);
    });
}