// Note to Know how this Js file works 
//first step1 - cartUpdate() call it takes current click item data from localstorage to update dynamic within mainList
//second step2 - it calls two funcs 1st is cartHelper() that update current item , 2nd updatelocal()
//continue - updateLocal() first fetch all previous cartData if exist then update dynamically then | new item store to local storge for future ! 

// const { string } = require("mathjs");

document.addEventListener("DOMContentLoaded", () => {
    verifyLocal(); //verifier
    quantityMaintain();
    popItem();
});

// Now linked structure of functions --->
// call 1st VerifyLocal() main check (curritem == duplicate product) if yes -> so skip & call dynamicLocalUpdater() it updates previous cart history !
// if no -> then add new item to cart call -> cartUpdate() | cartUpdate() first call cartHelper to manage new one into UI , then call updateLocal() it store new item to local for history!


//updateLocal() --- using parameter data of new product add new one to Local -- Map for history
//updateLocal() --- also call dynamicUpdater() to first update all history items before store newitem into localstorage!
//dynamicLocal() -- this function share localstorage map data objects(products) to cartHelper to render all product into mainUIList!
//cartHelper() -- just use parameter data or product data and add new LI to UI of mainItem-List of UI


//other new one are -- quantity updater of cart products using event delegation match click product & update it's price both localstorage & UI , by using helper functions ,
//such as quantityIncrease - increase quantity & price on UI (price on product card & main dashboard)
//such as quantityDecrease - decrease quantity & price on UI (price on product card & main dashboard)
// helper - polishPrice it help to avoid price to many 0's


//check first current_item is already on local & mainList
function verifyLocal() {
    const rawMap = localStorage.getItem("cartData");
    const map = new Map(JSON.parse(rawMap));

    const currItem = localStorage.getItem("cartItem");
    const jsonData = JSON.parse(currItem);

    if(map.has(jsonData.id)) { //checks id
        console.log("alreday have item with id:", jsonData.id);
        dynamicLocalUpdater(); //update local just!
        return;
    } else {
        cartUpdate(); //call main
    }

    // console.log("after load page item id -> ", jsonData.id);
}

//dynamic cart page updating ---> 
function cartUpdate() {
    const raw = localStorage.getItem("cartItem"); //current product!
    const productData = JSON.parse(raw); //product data of 'add to cart click' item

    //now update current item & update local
    cartHelper(productData); //update curritem
    updateLocal(productData);
}

//cart update helper --->
function cartHelper(data) { //dynamic adding new cart's
    if(data) {
        const cartList = document.getElementById("cartList");

        const newLi = document.createElement("li");
        newLi.classList.add("flex", "flex-col", "p-2", "gap-4", "border-b", "border-gray-400");

        newLi.innerHTML = `
            <!-- heading -->
                        <!-- usefull data-->
                        <span class="hidden itemId">${data.id}</span> 
            
                        <h2 class="text-xl md:text-2xl font-medium tracking-wide mb-4 title">
                            ${data.title}
                        </h2> 

                        <!-- data wrapper -->
                        <div class="flex flex-col gap-4 lg:flex-row xl:flex-col lg:justify-around">

                            <!-- item img & desc-->
                            <div class="w-full flex flex-col sm:flex-row items-start gap-4">
                                <img src=${data.img}  class="w-full max-w-[200px]">

                                <div class="flex flex-col gap-2">
                                    <p class="text-sm lg:text-base tracking-wide text-gray-800 font-normal line-clamp-3 desc">
                                        ${data.desc}
                                    </p>

                                    <span class="text-sm tracking-wide font-medium">
                                        Color : Black
                                    </span>
                                    
                                    <!--Toggler to modify quantity-->
                                    <div class="flex flex-wrap items-center gap-4 sm:gap-6 w-full my-2"> 
                                        <div class="w-full max-w-[135px] h-8 p-4 rounded-full border-2 border-y-amber-300 flex items-center justify-between">
                                            <i class="fa-solid fa-minus cursor-pointer hover:scale-[1.1] remove"></i>

                                            <span class="text-base font-semibold tracking-normal quantity">
                                                1
                                            </span>

                                            <i class="fa-solid fa-plus cursor-pointer hover:scale-[1.1] add"></i>
                                        </div>

                                        <!--remove from cart btn-->
                                        <button class="w-full max-w-[110px] h-[35px] border border-red-500 p-2 flex justify-center items-center rounded-lg hover:bg-red-500 hover:shadow-sm group transition-all delay-75 duration-200 ease-linear cursor-pointer removeBtn">
                                            <span class="text-base tracking-wide font-medium text-red-500 group-hover:text-white transition-all delay-75 duration-200 ease-linear">
                                                remove 
                                            </span>
                                        </button>
                                    </div>

                                </div> 

                            </div>

                            <!-- Price & Offer -->
                            <div class="flex flex-col gap-2 w-full items-end">
                                <span class="text-red-700 text-sm md:text-base tracking-normal font-medium">Limited deal offer</span>
                                <!-- amount -->
                                <span class="text-black/90 text-xl lg:text-2xl tracking-normal font-medium price1">
                                    ${data.finalPrice}
                                </span>

                                <!--dumy amount -->
                                <span class="text-balance tracking-normal font-light line-through price2">
                                    M.R.P: ${data.subPrice}/-
                                </span>
                            </div>

                        </div>
        `;

        cartList.appendChild(newLi);
        console.log("object -> ", data);

        //append total amount by quantity of perticular item !
        for(let i=0; i<data.quantity; i++) {
            updateAmount(data);
        }

        //update quantity & item price of item UI
        const quantity = newLi.querySelector(".quantity");
        quantity.innerText = `${data.quantity}`;

        const price = newLi.querySelector(".price1"); //bug fix {document. to newLI.} replace !
        const amount = String(data.finalPrice).slice(1);

        // console.log("amount --> ", amount);
        price.innerText =  `$${polishPrice(parseFloat(amount) * data.quantity)}`; //quantity x finalPrice
        // console.log("localstorage item price -> ", polishPrice(parseFloat(amount) * data.quantity));

    } else {
        console.log("cart curr item data is undefined or null!");
    }
}

//updating localstorage 
function updateLocal(data) {
    //now dynamic update all cart items through localstorage data
    dynamicLocalUpdater();

    //locol map ->
    const rawMap = localStorage.getItem("cartData");
    const jsonMap = new Map(JSON.parse(rawMap));
    // console.log("Main Map -> ", jsonMap);
     

    jsonMap.set(data.id, data); //with current item id  | available is id
    localStorage.setItem("cartData", JSON.stringify([...jsonMap]));
    // console.log("Map after updating -> ", jsonMap);
    
    // console.log("localstorage after updating map & new Id -> ", localStorage);
}

function dynamicLocalUpdater() {
    const raw = localStorage.getItem("cartData");
    const map = new Map(JSON.parse(raw));

    if(map.size === 0) return;
    else { 
        for(let [key, value] of map) {
            // console.log("map key:", key);
            cartHelper(value); //pass value
        } 
    }
}

//update amount
function updateAmount(data) {
    const amount = document.getElementById("amount");
    const items = document.getElementById("total");

    items.innerText = parseInt(items.textContent.trim()) + 1;

    let itemPrice = new String(data.finalPrice).slice(1);
    // console.log("final price -> ", itemPrice);

    amount.innerText = `${parseFloat(amount.innerText) + parseFloat(itemPrice)}`; //previous amount + current data amount
}

// <-------- quantity increase/decrease functionality of an item -------->

//polish price 
function polishPrice(amount) {
    return parseFloat(amount.toFixed(2));
}

//
function quantityMaintain() {
    const cart = document.getElementById("cartList");

    cart.addEventListener("click", (event) => {
        event.stopPropagation();

        const addItem = event.target.closest(".add");
        const removeItem = event.target.closest(".remove");

        const data = event.target.closest("li"); //click item data itself
        const item_id = data.querySelector(".itemId").textContent.trim();

        // console.log(data);
        // console.log("item click id -> ", item_id);

        if(addItem) {
            quantityIncrease(data, item_id); //
        } else if(removeItem) {
            quantityDecrease(data, item_id); //
        } else {
            console.log("click on other side!");
        }
    });
}

// ------ quantity helper
function quantityIncrease(li, id) {
    const map = new Map(JSON.parse(localStorage.getItem("cartData"))); //access Map from localstorage

    // --- increase quantity -- on UI | local | page refresh (access quantity x finalPrice) add to total! ---

    //on UI
    const quantityUI = li.querySelector(".quantity");
    quantityUI.innerText = `${parseInt(quantityUI.textContent.trim()) + 1}`;

    const itemPriceUI = li.querySelector(".price1"); //UI of curr item price

    //now on local
    if(map.has(id)) {

        //increase quantity 
        const obj = map.get(id); 
        obj.quantity = Number(obj.quantity) + 1; 
        // console.log("updated quantity -> ", obj.quantity);

        // save object to map
        map.set(id, obj); 

        //save to localstorage
        localStorage.setItem("cartData", JSON.stringify([...map])); 

        //update price on item UI & final UI
        const amount = document.getElementById("amount");
        const itemObj = map.get(id);
        const itemPrice = String(itemObj.finalPrice).slice(1); 

        if(amount) { 
            //amount ~ dashboard final amount (Total product price)
            const finalPrice = parseFloat(amount.textContent.trim()) + parseFloat(itemPrice); //dashboard final amount
            const polish = polishPrice(finalPrice); //get $129.99999 to $129.99/-
            amount.innerText = polish; //update on Total Amount

            //current product UI price updating 
            const finalUIPrice = polishPrice(parseInt(obj.quantity) * parseFloat(itemPrice)); //quantity x itemPrice
            itemPriceUI.innerText = `$${finalUIPrice}`; //update on Item price section
        }

        // console.log("item price -> ", itemPrice);
    } else {
        console.log("id didn't match!!");
    }

    console.log("quantity increased!!");
    console.log("access id -> ", id);
}

function quantityDecrease(li, id) {
    console.log("quantity decreased!!");

    const map = new Map(JSON.parse(localStorage.getItem("cartData"))); //access Map from localstorage

    // --- decrease quantity -- on UI | local | page refresh (access quantity x finalPrice) add to total! ---

    //on UI
    const quantityUI = li.querySelector(".quantity");
    const itemPriceUI = li.querySelector(".price1"); //UI of curr item price

    if(Number(quantityUI.textContent.trim()) > 1) { //to stop at 1
        quantityUI.innerText = `${parseInt(quantityUI.textContent.trim()) - 1}`;

        //now on local
        if(map.has(id)) {
            //increase quantity 
            const obj = map.get(id); 
            obj.quantity = Number(obj.quantity) - 1; 
            console.log("updated quantity -> ", obj.quantity);

            // save object to map
            map.set(id, obj); 

            //save to localstorage
            localStorage.setItem("cartData", JSON.stringify([...map])); 

            //update price 
            const amount = document.getElementById("amount");
            const itemObj = map.get(id);
            const itemPrice = String(itemObj.finalPrice).slice(1);  //curr item price
            const polish = polishPrice(parseFloat(amount.textContent.trim()) - parseFloat(itemPrice));
            // console.log("item price -> ", itemPrice);

            if(amount) {
                amount.innerText = polish; //final dashboard amount of UI

                //current product price on UI updation
                itemPriceUI.innerText = `$ ${polishPrice(parseInt(itemObj.quantity * itemPrice))}`;
            }
        } else {
            console.log("id didn't match!!");
        }
 
        console.log("access id -> ", id);
    } else {
        console.log("item quantity is reached to '1' !");
    }
}


//delete click item on (both UI & localstorage of map) using event-delegation ---
function popItem() {
    const itemList = document.getElementById("cartList");
    //removeBtn

    itemList.addEventListener("click", (event) => {
        //accessing container ID
        if(event.target.closest(".removeBtn")) {
            const li = event.target.closest("li");
            if(!li) return;
            const itemId = li.querySelector(".itemId");

            //send for remove from localstorage MapData --
            removeItem(itemId.textContent.trim()); 
            
            //and now remove from UI --
            itemList.removeChild(li);
        }
    });
}

//popItem helper
function removeItem(id) { //(--- <= group , -- <= subgroup, - <= somework)
    // --- Access localstorage Map ---
    const rawData = localStorage.getItem("cartData");
    const map = new Map(JSON.parse(rawData)); //accessing local map
    if(map.has(id)) console.log("map have item with id:", id);

    // -this two for updating dashboard amount --decrease-
    const itemPrice = map.get(id).finalPrice.slice(1);
    const quantity = map.get(id).quantity;

    // --- removing item from Map of local & updating it ---
    const isRemove = map.delete(id);
    if(isRemove) console.log(`item with id:${id} successfully remove`);
    localStorage.setItem("cartData", JSON.stringify([...map])); //update modified map on local

    // --- update TOTAL DUE/AMOUNT from main dashboard panel ---
    if(itemPrice) console.log("item finalPrice: ", itemPrice);
    if(quantity) console.log("item with quantity -> ", quantity);
    const deposit = polishPrice(quantity * itemPrice);
    
    // --now remove from dashboard--
    const dashboard = document.getElementById("amount");
    dashboard.innerText = Number(dashboard.textContent - deposit);
    console.log(`Item remove with quantity:${quantity} & price:$${itemPrice} => overall deposit ${deposit} from dashboard`);

    // -remove also dashboard item count
    const dashboardItemCount = document.getElementById("total").textContent.trim();
    dashboardItemCount.innerText = Number(dashboardItemCount.textContent) - 1;
    console.log(dashboardItemCount);

    //handeled edge case single element
    //compare current remove id matches (itemcart save product) if yes then itemcart should be clear!
    const cartSaveItem = JSON.parse(localStorage.getItem("cartItem"));
    if(id === cartSaveItem.id) {
        localStorage.setItem("cartItem", "");
    }

}


