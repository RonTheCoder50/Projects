document.addEventListener("DOMContentLoaded", () => {
    apiTest();

    productCard();
 
});

const countProducts = {
    count: 0,
    category: 0,
};

// api for products
async function apiTest() {
    try {
        const url = 'https://dummyjson.com/products/category-list';
        const raw = await fetch(url);
        const data = await raw.json();

        console.log(data);
        let idx = 0;

        for(let item of data) {
            const products = await callAllProductCategories(item);
            noteAllProducts(products, data[idx], idx);
            idx++;
        }
    } catch(err) {
        console.log("Failed to fetch api response -> ", err);
        // alert("Failed to load page please wait few seconds!");

        setTimeout(() => {
            apiTest(); //again call 
        }, 1500);
    }

    //basic extra info
    console.log("Total products -> ", countProducts.count);
    console.log("Total categories of products -> ", countProducts.category);
}

async function callAllProductCategories(data) {
    try {
        const url = `https://dummyjson.com/products/category/${data}?limit=0`;
        const raw = await fetch(url);
        const jsonData = await raw.json();

        return jsonData.products;
    } catch(e) {
        console.log(`failed to fetch -> ${e}`);
    }
}

function noteAllProducts(products, productName, count) {
    dynamicProductAdding(products, productName, count);
}

function dynamicProductAdding(product, productName, count) {
    // console.log(product[0]);

    //main list
    const mainList = document.getElementById("productList");
    const ul = document.createElement("ul"); //new ul element created!

    //ul class adding
    ul.classList.add("w-full", "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-5", "md:gap-8", "xl:gap-10", "xl:place-items-center", "p-2", "bg-gray-300", `itemList_${count}`);

    mainList.appendChild(ul);

    //itemList_${no}
    //now time to add dynamic li's
    for(let item of product) {
        const li = document.createElement("li");

        li.classList.add("w-full", "min-w-[250px]", "lg:max-w-[300px]", "xl:max-w-[330px]", "bg-white", "shadow-sm", "rounded-md", "flex", "flex-col", "p-1", "mx-auto", "product-item", "hover:shadow-md", "hover:scale-[1.02]", "transition-all" ,"delay-75", "duration-100", "ease-linear", "ly");

        li.innerHTML = `
                <img src=${item.images[0]}  
                class="w-full max-w-[98%] mx-auto object-center object-cover max-h-[230px] mainImg"
                loading="lazy">

                <!--extra img for product card-->
                <img src=${item.images[0]}  
                class="hidden w-full max-w-[98%] mx-auto object-center object-cover max-h-[230px] sec-img"
                loading="lazy">

                <img src=${item.images[1]}  
                class="hidden w-full max-w-[98%] mx-auto object-center object-cover max-h-[230px] sec-img"
                loading="lazy">

                <img src=${item.images[2]}  
                class="hidden w-full max-w-[98%] mx-auto object-center object-cover max-h-[230px] sec-img"
                loading="lazy">
                
                <!-- data -->
                <div class="flex flex-col p-4 gap-1 tracking-wide">
                    <!-- name -->
                    <span class="text-xl font-semibold item_name">
                        ${item.title}
                    </span>

                    <!-- description -->
                    <p class="text-xs font-wide line-clamp-4 item_desc">
                         ${item.description}
                    </p> 

                    <hr class="border-gray-400 my-3 w-full">

                    <!-- price -->
                    <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-base font-light">
                        <span class="text-xl sm:text-2xl font-medium item_price">
                            $${item.price}
                        </span>

                        <div class="flex gap-1 items-center text-gray-500 text-sm sm:gap-2 sm:text-lg">
                            <span class="tracking-wider text-base">
                                M.R.P
                            </span>

                            <span class="line-through item_price2">
                                ${item.price + 300}
                            </span>
                        </div>
                    </div> 

                    <!-- add to cart button -->
                    <button class="w-full max-w-[75%] mx-auto p-2 mt-6 bg-yellow-400 rounded-full text-base text-gray-200 font-semibold border border-yellow-400 hover:bg-white hover:text-gray-600 cursor-pointer transition-all delay-75 duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md item_cartBtn">
                            <span>Add to Cart</span>
                    </button>
                </div>

                <!-- extra data1 -->
                <div id="otherData" class="hidden flex flex-col">
                    <span class="id"> 
                        ${item.id}
                    </span>
                    
                    <span class="discount"> 
                        ${item.discountPercentage}
                    </span>

                    <span class="warrenty"> 
                        ${item.warrantyInformation}
                    </span>
                    
                    <span class="policy"> 
                        ${item.returnPolicy}
                    </span>

                    <span class="stock"> 
                        ${item.availabilityStatus}
                    </span>

                    <span class="rate"> 
                        ${item.rating}
                    </span>

                </div>

                <!-- extra data 2-->
                <ul id="reviews" class="hidden flex flex-col">
                    <li class="flex flex-col gap-1 rev1">
                        <span class="name">
                            ${item.reviews[0].reviewerName} 
                        </span> 

                        <span class="rating">
                            ${item.reviews[0].rating}
                        </span> 

                        <span class="date">
                            ${item.reviews[0].date}
                        </span> 

                        <span class="email">
                            ${item.reviews[0].reviewerEmail}
                        </span> 

                        <span class="comment">
                            ${item.reviews[0].comment}
                        </span> 
                    </li>
                    
                    <li class="flex flex-col gap-1 rev2">
                        <span class="name">
                            ${item.reviews[1].reviewrName}
                        </span> 

                        <span class="rating">
                            ${item.reviews[1].rating}
                        </span> 

                        <span class="date">
                            ${item.reviews[1].date}
                        </span> 

                        <span class="email">
                            ${item.reviews[1].reviewrEmail}
                        </span> 

                        <span class="comment">
                            ${item.reviews[1].comment}
                        </span> 
                    </li>

                    <li class="flex flex-col gap-1 rev3">
                        <span class="name">
                            ${item.reviews[2].reviewrName}
                        </span> 

                        <span class="rating">
                            ${item.reviews[2].rating}
                        </span> 

                        <span class="date">
                            ${item.reviews[2].date}
                        </span> 

                        <span class="email">
                            ${item.reviews[2].reviewrEmail}
                        </span> 

                        <span class="comment">
                            ${item.reviews[2].comment}
                        </span> 
                    </li>

                </ul>
        `;

        

        // console.log(item);
        ul.appendChild(li);
        countProducts.count += 1;
    }

 

    countProducts.category += 1;

}

//product card-info functionality to send through localstorage to product page
const productInfo = {
    title : '',
    desc : '',
    id : '',
    quantity: 1,

    price : '',
    price2 : '',

    srcMain : '',
    src1 : '',
    src2 : '',
    src3 : '',

    id: '',
    returnPolicy: '',
    discount: '',
    rating: '',

    warrenty: '',
    stock: '',

    reviews : [
        {
            name: '',
            email: '',
            comment: '',
            date: '',
            rating: '',
        },

        {
            name: '',
            email: '',
            comment: '',
            date: '',
            rating: '',
        },

        {
            name: '',
            email: '',
            comment: '',
            date: '',
            rating: '',
        }
    ],
     
};

function productCard() {
    const mainList = document.getElementById("productList");

    mainList.addEventListener("click", (e) => {
        console.log("main list was click!");
        const li = e.target.closest(".ly");
        
        if(li) {
            const images = li.querySelectorAll(".sec-img");
            if(images[0] && images[0].src) productInfo.src1 = images[0].src;
            if(images[1] && images[1].src) productInfo.src2 = images[1].src;
            if(images[2] && images[2].src) productInfo.src3 = images[2].src;

            const mainImg = li.querySelector(".mainImg");
            if(mainImg) productInfo.mainImg = mainImg.src;
            
            const price1 = li.querySelector(".item_price");
            productInfo.price = price1.textContent.trim();

            const price2 = li.querySelector(".item_price2");
            productInfo.price2 = price2.textContent.trim();

            const desc = li.querySelector(".item_desc");
            productInfo.desc = desc.textContent.trim();

            const title = li.querySelector(".item_name");
            productInfo.title = title.textContent.trim();

            //review
            const reviewData = li.querySelector("#reviews");

            for(let idx=1; idx<=3; idx++) {
                const revElem = reviewData.querySelector(`.rev${idx}`);

                if(revElem) {
                    productInfo.reviews[idx-1].name = revElem.querySelector(".name")?.textContent.trim() || "unknwon-user";
                    
                    const rating = revElem.querySelector(".rating").textContent.trim();
                    productInfo.reviews[idx-1].rating = parseInt(rating);
                    
                    const rdate = revElem.querySelector(".date").textContent.trim();
                    productInfo.reviews[idx-1].date = rdate;
                
                    productInfo.reviews[idx-1].email = revElem.querySelector(".email")?.textContent.trim() || "abc@gmail.com";
                    
                    const rdesc = revElem.querySelector(".comment").textContent.trim();
                    productInfo.reviews[idx-1].comment = rdesc;
                }
            }
            

            //otherData
            const otherInfo = li.querySelector("#otherData");
            productInfo.id = otherInfo.querySelector(".id").textContent.trim();
            productInfo.discount = parseInt(otherInfo.querySelector(".discount").textContent.trim());
            productInfo.warrenty = otherInfo.querySelector(".warrenty").textContent.trim();
            productInfo.returnPolicy = otherInfo.querySelector(".policy").textContent.trim();
            productInfo.stock = otherInfo.querySelector(".stock").textContent.trim();
            productInfo.rating = parseInt(otherInfo.querySelector(".rate").textContent.trim());


            console.log("Product info -> ", productInfo);

            //store product-info to localstorage to pass - productCard_Info page
            localStorage.setItem("productDetail", JSON.stringify(productInfo));
            // console.log(localStorage);

            window.location = 'infoCard.html';
        }   
    });
}
