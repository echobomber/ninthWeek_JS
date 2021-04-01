const api_path = "jordan990301";
const baseUrl = "https://hexschoollivejs.herokuapp.com";
let orderTable = document.querySelector('.orderPage-table');
let delAllBtn = document.querySelector('.discardAllBtn');
let orderData = {};

function getOrder() {
    let vm = this;
    // console.log(this);
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    axios.get(url, 
        {
            'headers': {
                'Authorization': 'PBZzz6dBY3Q67V6SPh4xTkfc3Oh1'
            }
        })
        .then((res) => {
            orderData = res.data.orders;
            console.log(orderData);
            renderTable();
            renderC3();
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderTable() {
    let str = `
    <thead>
        <tr>
            <th>訂單編號</th>
            <th>聯絡人</th>
            <th>聯絡地址</th>
            <th>電子郵件</th>
            <th>訂單品項</th>
            <th>訂單日期</th>
            <th>訂單狀態</th>
            <th>操作</th>
        </tr>
    </thead>
    `;
    orderData.forEach((item) => {
        let statusClass;
        let statusText;
        if (item.paid) {
            statusClass = "orderStatus-done";
            statusText = "已處理";
        }else {
            statusClass = "orderStatus-unDone";
            statusText = "未處理";
        }
        str += 
        `<tr>
            <td>${item.id}</td>
            <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>`;
        for(let i = 0; i < item.products.length; i++) {
            str += 
            `<p>${item.products[i].title}</p>`        
        }
        str += 
            `
            </td>
            <td>${new Date(item.createdAt * 1000).toLocaleString()}</td>
                <td class="orderStatus ${statusClass}">
                    <a href="#">${statusText}</a>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn" value="刪除">
                </td>
            </tr>`;
    })
    orderTable.innerHTML = str;
    orderData.forEach((item, i) => {
        let status = document.querySelectorAll('.orderStatus a')[i];
        let delSingleBtn = document.querySelectorAll('.delSingleOrder-Btn')[i];
        status.addEventListener('click', editStatus(item));
        delSingleBtn.addEventListener('click', delSingleOrder(item));
    })
}
function editStatus(orderTarget) {
    return function(e) {
        e.preventDefault();  // 為何不用 closure 就會壞掉、自動執行?
        let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
        let data = {};
        if(orderTarget.paid) {
            data = {
                "data": {
                    "id": orderTarget.id,
                    "paid": false
                }
            }
        }else {
            data = {
                "data": {
                    "id": orderTarget.id,
                    "paid": true
                }
            }
        }
        axios.put(url, {...data},
            {
                'headers': {
                    'Authorization': 'PBZzz6dBY3Q67V6SPh4xTkfc3Oh1'
                }
            })
            .then((res) => {
                getOrder();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delSingleOrder(orderTarget) {
    return function(e) {
        e.preventDefault();  // 為何不用 closure 就會壞掉、自動執行?
        let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders/${orderTarget.id}`;
        axios.delete(url,
            {
                'headers': {
                    'Authorization': 'PBZzz6dBY3Q67V6SPh4xTkfc3Oh1'
                }
            })
            .then((res) => {
                getOrder();
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
function delAllOrder(e) {
    e.preventDefault();
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    axios.delete(url,
        {
            'headers': {
                'Authorization': 'PBZzz6dBY3Q67V6SPh4xTkfc3Oh1'
            }
        })
        .then((res) => {
            getOrder();
        })
        .catch((error) => {
            console.log(error);
        })
}
;(function(){
    getOrder();
    delAllBtn.addEventListener('click', delAllOrder);
})();

function renderC3() {
    let totalObj = {};
    orderData.forEach((item) => {
        for(let i = 0; i < item.products.length; i++) {
            if(totalObj[item.products[i].title] === undefined) {
                totalObj[item.products[i].title] = 1;
            }else{
                totalObj[item.products[i].title] += 1;
            }
        }
    })
    let c3Data = [];
    let productName = Object.keys(totalObj);
    productName.forEach((item) => {
        let arr = [];
        arr.push(item);
        arr.push(totalObj[item]);
        c3Data.push(arr);
    })
    //
    let dataColor = {};
    let colorCode = ["#301E5F", "#5434A7", "#9D7FEA", "#6A33F8"];
    productName.forEach((item, i) => {
        dataColor[item] = colorCode[i%4];
    })
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: c3Data,
            colors: dataColor
        },
    });
}

