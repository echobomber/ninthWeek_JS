const api_path = "jordan990301";
const baseUrl = "https://hexschoollivejs.herokuapp.com";
const headers = {Authorization: 'PBZzz6dBY3Q67V6SPh4xTkfc3Oh1'};
let orderTable = document.querySelector('.orderPage-table');
let delAllBtn = document.querySelector('.discardAllOrder');

function getOrder() {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    axios.get(url, {headers})
        .then((res) => {
            let orderData = res.data.orders;
            renderTable(orderData);
            filterC3Title(orderData);
        })
        .catch((error) => {
            console.log(error);
        })
}
function renderTable(orderData) {
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
        status.addEventListener('click', function(e){
            e.preventDefault();
            editStatus(item);
        });
        delSingleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            delSingleOrder(item);
        });
    })
}
function editStatus(orderTarget) {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
        let data = {
            data: {
                id: orderTarget.id,
                paid: !orderTarget.paid
            }
        };
        axios.put(url, {...data}, {headers})
            .then(() => {
                getOrder();
                setTimeout(function(){ alert("成功調整狀態");}, 1000);
            })
            .catch((error) => {
                console.log(error);
            })
}
function delSingleOrder(orderTarget) {
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders/${orderTarget.id}`;
    axios.delete(url, {headers})
        .then(() => {
            getOrder();
            setTimeout(function(){ alert("成功刪除");}, 1000);
        })
        .catch((error) => {
            console.log(error);
        })
}
function delAllOrder(e) {
    e.preventDefault();
    let url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
    axios.delete(url, {headers})
        .then(() => {
            getOrder();
            setTimeout(function(){ alert("成功刪除所有訂單");}, 1000);
        })
        .catch((error) => {
            console.log(error);
        })
}
;(function(){
    getOrder();
    delAllBtn.addEventListener('click', delAllOrder);
})();

// 04/12 作業修改處
function filterC3Title(orderData) {
    let objNum = {};
    orderData.forEach((item) => {
        for(let i = 0; i < item.products.length; i++) {
            if(objNum[item.products[i].title] === undefined) {
                objNum[item.products[i].title] = item.products[i].quantity;
            }else{
                objNum[item.products[i].title] += item.products[i].quantity;
            }
        }
    })
    let c3Data = [];
    let productName = Object.keys(objNum);
    productName.forEach((item) => {
        let arr = [];
        arr.push(item);
        arr.push(objNum[item]);
        c3Data.push(arr);
    })
    c3Data.sort((a, b) => {
        a = a[1];
        b = b[1];
        return b - a;
    })
    console.log(c3Data)
    // 超出排名前三的都歸納到其他
    if(c3Data.length > 3) {
        let outRank = 0;
        c3Data.forEach((item, i) => {
            if (i > 2) {
                outRank += item[1];
            }
        })
        c3Data = [c3Data[0], c3Data[1], c3Data[2], ["其他", outRank]];
        renderC3(c3Data);
    }else {
        renderC3(c3Data);
    }
}

function renderC3(c3Data) {
    let dataColor = {};
    let c3DataTitle = [];
    c3Data.forEach((item) => {
        c3DataTitle.push(item[0]);
    })
    let colorCode = ["#301E5F", "#5434A7", "#9D7FEA", "#6A33F8"];
    c3DataTitle.forEach((item, i) => {
        dataColor[item] = colorCode[i];
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

