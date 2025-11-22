document.addEventListener("DOMContentLoaded", () => {
    apiTest();
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
        alert("Failed to load page please wait few seconds!");

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
    console.log("Product category -> ", productName);

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

        li.classList.add("w-full", "min-w-[250px]", "lg:max-w-[300px]", "xl:max-w-[330px]", "bg-white", "shadow-sm", "rounded-md", "flex", "flex-col", "p-1", "mx-auto", "product-item", "hover:shadow-md", "hover:scale-[1.02]", "transition-all" ,"delay-75", "duration-100", "ease-linear");

        li.innerHTML = `
            <img src=${item.images[0]}  
            class="w-full max-w-[98%] mx-auto object-center object-cover max-h-[230px]"
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
        `;

        ul.appendChild(li);
        countProducts.count += 1;
    }

    countProducts.category += 1;
}
