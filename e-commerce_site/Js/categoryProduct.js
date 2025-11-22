document.addEventListener("DOMContentLoaded", () => {
    apiCall();
});

//main function to fetch api calls!
async function apiCall() {
    const productCategory = JSON.parse(localStorage.getItem("selectedCategory"));
    try {
        // const url = `https://dummyjson.com/products/category/${productCategory[0]}`;
        // const raw = await fetch(url);
        // const data = await raw.json();

        // console.log(`${productCategory[0]} of data -> ${JSON.stringify(data.products)}`);

        for(let item of productCategory) {
            const data = await apiHelper(item);
            console.log("category data call -> ", data);

            //now dynamic data rendering !
            dynamicUpdation(item, data); //item is category name & data is json data
        }
    } catch(err) {
        console.log("Failed to fetch bcoz -> ", err);
    }

    console.log("apicall logged!");
}

//helper function of apiCall to fetch data & provide it
async function apiHelper(data) {
    const url = `https://dummyjson.com/products/category/`;
    try {
        console.log("data -> ", data);

        //real work
        const raw = await fetch(`${url}${data}?limit=30`);
        const jsonData = await raw.json();
        console.log("json format -> " , jsonData);

        return jsonData.products;
    } catch(err) {
        console.log("failed to fetch at categoryProducts.js -> " , err);
        // alert("some error occur please wait few seconds!!");

        // setTimeout(() => {
        //     location.reload();
        // }, 1500);
    }
}

//dynamic page update according to data --->
function dynamicUpdation(categoryName, jsonData) {
    const mainList = document.getElementById("productList");

    //wrapper div
    const wrapper = document.createElement("div");
    wrapper.classList.add("w-full", "p-6", "text-xl", "sm:text-2xl", "lg:text-3xl", "font-semibold", "tracking-wide", "font-['Arial']", "text-gray-900", "flex", "justify-between", "items-center", "flex-wrap", "gap-4");
    
    //first child of wrapper create span <Headin of category>
    const span = document.createElement("span");
    span.classList.add("p-2");
    span.innerText = categoryName;

    //second child of wrapper create UL list
    const newUl = document.createElement("ul");
    newUl.classList.add("w-full", "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-5", "md:gap-8", "xl:gap-10", "xl:place-items-center", "p-2", "bg-gray-300", "itemList_");

    //now loopthrough first append all li's to ul 
    for(let item of jsonData) {
        const li = document.createElement("li");
        li.classList.add("w-full", "min-w-[250px]", "lg:max-w-[300px]", "xl:max-w-[330px]", "bg-white", "shadow-sm","hover:shadow-md", "hover:scale-[1.02]", "transition-all", "delay-75", "duration-100", "ease-linear", "rounded-md", "flex", "flex-col", "p-1", "mx-auto", "product-item", "overflow-x-hidden");

        li.innerHTML = `
                <img src= ${item.thumbnail}  
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
                                $${item.price+100}
                            </span>
                        </div>
                    </div> 

                    <!-- add to cart button -->
                    <button class="w-full max-w-[75%] mx-auto p-2 mt-6 bg-yellow-400 rounded-full text-base text-gray-200 font-semibold border border-yellow-400 hover:bg-white hover:text-gray-600 cursor-pointer transition-all delay-75 duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md item_cartBtn">
                        <span>Add to Cart</span>
                    </button>
                </div>
        `;

        newUl.appendChild(li); //done
    }

    wrapper.appendChild(span);
    wrapper.appendChild(newUl);
    mainList.appendChild(wrapper); //all done
}