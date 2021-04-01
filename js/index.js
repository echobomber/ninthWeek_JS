// 以下開始撰寫 JS 程式碼
let productWrap = document.querySelector('.productWrap');
let productSelect = document.querySelector('.productSelect');
//
let keyWordSearch = document.querySelector('#keyWordSearch');
const api_path = "jordan990301";
const baseUrl = "https://hexschoollivejs.herokuapp.com";

let products = []; // 原始資料
let categoryName = [];

function getProduct() {
    let vm = this;
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/products`;
    axios.get(url)
        .then((res) => {
            products = [...res.data.products];
            filterCategories();
            renderProductList();
            renderProduct(products);
        })
        .catch((error) => {
            console.log(error);
        })
}
function filterCategories() {
    let vm = this;
    categoryName = products.map((item) => {
        return item.category;
    })
    categoryName = categoryName.filter((element, index, self) => {
        return self.indexOf(element) === index;
    })
}
// select 只能用 appendChild 填入
function renderProductList() {
    categoryName.forEach((item) => {
        let options = document.createElement('option');
        options.value = item;
        options.textContent = item;
        productSelect.appendChild(options);
    })
}
function addCart(item) {    
    // 要用 closure 才可以代入 e + 其他參數
    return function(e) {
        e.preventDefault();
        // console.log(item);
        let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
        let data = {
            "data": {
              "productId": `${item.id}`,
              "quantity": 1
            }
        }
        axios.post(url, {...data})
            .then((res) => {
                console.log(res);
                renderCart();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delSingleCart(item) {
    return function(e) {
        e.preventDefault();
        let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${item.id}`;
        axios.delete(url)
            .then((res) => {
                console.log(res);
                renderCart();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delAllCart(e) {
    e.preventDefault();
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    axios.delete(url)
        .then((res) => {
            console.log(res);
            renderCart();
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderCart() {
    let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
    let cartTable = document.querySelector('.shoppingCart-table');
    let str = '';
    axios.get(url)
        .then((res) => {
            let data = res.data.carts;
            if(data[0]){
                str += `
                    <tr>
                        <th width="40%">品項</th>
                        <th width="15%">單價</th>
                        <th width="15%">數量</th>
                        <th width="15%">金額</th>
                        <th width="15%"></th>
                    </tr>`;
                data.forEach((item, i) => {
                    str += `
                    <tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>NT$${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>NT$${item.product.price * item.quantity}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons">
                                clear
                            </a>
                        </td>
                    </tr>`;
                })
                str += `
                    <tr>
                        <td>
                            <a href="#" class="discardAllBtn">刪除所有品項</a>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            <p>總金額</p>
                        </td>
                        <td>NT$${res.data.finalTotal}</td>
                    </tr>`;
            }
            cartTable.innerHTML = str;
            data.forEach((item, i) => {
                document.querySelectorAll('.discardBtn a')[i].addEventListener('click', delSingleCart(item));
            })
            let discardAllBtn = document.querySelector('.discardAllBtn');
            discardAllBtn.addEventListener('click', delAllCart);
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderProduct(targetProduct) {
    let vm = this;
    let str = '';
    targetProduct.forEach((item, i) => {
        str += `
        <li class="productCard">
            <h4 class="productType">${item.category}</h4>
            <img src="${item.images}" alt="${item.title}">
            <a href="#" id="addCardBtn">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>
        `
    })
    productWrap.innerHTML = str;
    targetProduct.forEach((item, i) => {
        document.querySelectorAll('#addCardBtn')[i].addEventListener('click', addCart(item));
    })
    /* select 不可以用 innerHTML 來加入 option， 切換的時候文字不會跟著換*/ 
    // str = `<option value="全部">全部</option>`;
    // categoryName.forEach((item) => {
    //     str += `<option value="${item}">${item}</option>`;
    // })
    // productSelect.innerHTML = str;
}
function productFilter(e) {
    e.preventDefault();
    let vm = this;
    if(e.target.value === "全部") {
        renderProduct(products);
    }else{
        let showProduct = products.filter((item) => {
            return item.category === e.target.value;
        })
        renderProduct(showProduct);
    }
}
function init() {
    getProduct();
    renderCart();
}
//
function keywordFilter() {
    let keyword = document.querySelector('#keyWord').value.trim();
    let showProduct = products.filter((item) => {
        return item.title.match(keyword);
    })
    renderProduct(showProduct);
}

init();
productSelect.addEventListener('change', productFilter);

// validate.js
;(function() {
    let constraints = {
        "姓名": {
            presence: {
                message: "是必填的欄位",
            },
        },
        "電話": {
            presence: {
                message: "是必填的欄位"
            },
        },
        "Email": {
            presence: {
                message: "是必填的欄位",
            },
        },
        "寄送地址": {
            presence: {
                message: "是必填的欄位"
            },
        },
    };
    let form = document.querySelector('.orderInfo-form');
    let messages = document.querySelectorAll('[data-message]');
    let inputs = document.querySelectorAll('.orderInfo-input');
    form.addEventListener('submit', formCheck);

    inputs.forEach((item) => {
        item.addEventListener("change", function (e) {
            e.preventDefault();
            let targetName = item.name;
            let errors = validate(form, constraints);
            let str = `[data-message="${targetName}"]`;
            if (errors) {
                // 取得要輸出錯誤訊息的 p 標籤
                document.querySelector(str).textContent = errors[targetName];
            } else {
                document.querySelector(str).textContent = "";
            }
        });
    })
    function formCheck(e) {
        e.preventDefault();
        let errors = validate(form, constraints);
        if (errors) {
            console.log(errors);
            showErrors(errors); // 顯示錯誤訊息，errors 是物件形式
        } else {
            console.log("驗證成功");
            let name = document.querySelector("#customerName").value;
            let tel = document.querySelector("#customerPhone").value;
            let email = document.querySelector("#customerEmail").value;
            let address = document.querySelector("#customerAddress").value;
            let payment = document.querySelector("#tradeWay").value;

            let url = `${baseUrl}/api/livejs/v1/customer/${api_path}/orders`;
            let data = {
                "data": {
                    "user": {
                        "name": name,
                        "tel": tel,
                        "email": email,
                        "address": address,
                        "payment": payment
                     }
                }
            }
            axios.post(url, {...data})
                .then((res) => {
                    console.log(res);
                    renderCart();
                    location.href = "/pages/order.html";
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    function showErrors(errors) {
        messages.forEach((item) => {
            item.textContent = "";
            item.textContent = errors[item.dataset.message];
        })
    }
})();


