"use strict";

$(function () {
  GetProductList();
  ShowMyCart();
});
var PData = [];
var CartArr = [];

function GetProductList() {
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/getproductlist/carts
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products"); // console.log(`GetProductList  ${api_path}`)

  axios.get(url).then(function (response) {
    // 成功會回傳的內容
    // console.log(response);
    var data = response.data;
    PData = data.products;
    if (data.status) RenderProductData(data.products);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function ShowMyCart() {
  // https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts");
  axios.get(url).then(function (response) {
    // 成功會回傳的內容
    console.log('我的購物車');
    console.log(response);
    ReRenderMyCart(response.data);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function AddMyCart(PId) {
  console.log("PId  ".concat(PId));
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    //帶入的值會使用物件包裝
    "data": {
      "productId": PId,
      "quantity": 1
    }
  }).then(function (response) {
    // 成功會回傳的內容
    var data = response.data;
    CartArr = data.carts;

    if (data.status) {
      ReRenderMyCart(data);
    }
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
} //更新我的購物車列表


function ReRenderMyCart(PDArr) {
  var CartTbl = document.querySelector('.shoppingCart-table'); //表頭

  var myCartHTML_TH = "\n      <tr>\n        <th width=\"40%\">\u54C1\u9805</th>\n        <th width=\"15%\">\u55AE\u50F9</th>\n        <th width=\"15%\">\u6578\u91CF</th>\n        <th width=\"15%\">\u91D1\u984D</th>\n        <th width=\"15%\"></th>\n      </tr>\n\n  ";
  var myCartHTML = "";
  var TotalPrice = PDArr.finalTotal;

  if (PDArr.carts.length == 0) {
    myCartHTML += ShowEmptyTbl();
  } else {
    PDArr.carts.forEach(function (pItemObj, pIdx) {
      myCartHTML += "\n        <tr>\n          <td>\n              <div class=\"cardItem-title\">\n                  <img src=\"".concat(pItemObj.product.images, "\" alt=\"\">\n                  <p>").concat(pItemObj.product.title, "</p>\n              </div>\n          </td>\n          <td>NT$").concat(pItemObj.product.origin_price, "</td>\n          <td>1</td>\n          <td>NT$").concat(pItemObj.product.price, "</td>\n          <td class=\"discardBtn\">\n              <a onclick=DelSingleCart(\"").concat(pItemObj.id, "\") href=\"#javascript:;\" class=\"material-icons\">\n                  clear\n              </a>\n          </td>\n        </tr>  \n      ");
    });
  } //表尾


  var myCartHTML_Tfoot = "\n    <tr>\n      <td>\n          <a href=\"#javascript:;\" onclick='DelAllCart();' class=\"discardAllBtn\">\u522A\u9664\u6240\u6709\u54C1\u9805</a>\n      </td>\n      <td colspan=\"2\"></td>\n\n      <td>\n          <p>\u7E3D\u91D1\u984D</p>\n      </td>\n      <td>NT$".concat(TotalPrice, "</td>\n    </tr>\n\n  ");
  CartTbl.innerHTML = myCartHTML_TH + myCartHTML + myCartHTML_Tfoot;
} // 刪除購物車內特定產品


function DelSingleCart(pid) {
  //'https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts/jw1jNknjVsKYPNyqYSWA'
  // console.log(`delete at  ${pid}`)
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/jw1jNknjVsKYPNyqYSWA
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(pid)).then(function (response) {
    console.log(response.data);
    ReRenderMyCart(response.data);
  });
} //清除購物車內全部產品


function DelAllCart() {
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    console.log(response.data); //重新渲染一次List  carts

    ReRenderMyCart(response.data);
  });
}

function AddPresertData() {
  // console.log($("#tradeWay").val())
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/orders
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    //帶入的值會使用物件包裝
    "data": {
      "user": {
        "name": document.getElementById("customerName"),
        "tel": document.getElementById("customerPhone"),
        "email": document.getElementById("customerEmail"),
        "address": document.getElementById("customerAddress"),
        "payment": $("#tradeWay").val()
      }
    }
  }).then(function (response) {
    // 成功會回傳的內容
    var data = response.data;
    console.log(response);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

var CaegorySelectChange = document.querySelector(".productSelect");
CaegorySelectChange.addEventListener("change", function (e) {
  console.log(e.target.value);

  if (e.target.value == "全部") {
    RenderProductData(PData);
  } else {
    RenderProductData(FilterProduct(e.target.value));
  }
}); // let SubmitPresertOrrder = document.querySelector(".orderInfo-btn")
// SubmitPresertOrrder.addEventListener("click",()=>{
//   AddPresertData()
// })

var handleForm = document.querySelector(".orderInfo-form");
handleForm.addEventListener("submit", function (e) {
  e.preventDefault();
  AddPresertData();
});

function FilterProduct(qCategory) {
  return PData.filter(function (el) {
    return el.category == qCategory;
  });
}

function RenderProductData(ProductArr) {
  console.log(ProductArr);
  var HTMLStr = "";
  var list_Product = document.querySelector('.productWrap');
  ProductArr.forEach(function (item, index) {
    HTMLStr += "\n    <li class=\"productCard\">\n                <h4 class=\"productType\">".concat(item.category, "</h4>\n                <img src=\"").concat(item.images, "\" alt=\"\">\n                <a href=\"#javascript:;\"  class=\"addCardBtn\" onclick=AddMyCart(\"").concat(item.id, "\") data-pid=\"").concat(item.id, "\" >\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n                <h3>").concat(item.title, "</h3>\n                <del class=\"originPrice\">NT").concat(item.origin_price, "</del>\n                <p class=\"nowPrice\">NT").concat(item.price, "</p>\n            </li>\n    ");
  });
  list_Product.innerHTML = HTMLStr;
} //秀空白td


function ShowEmptyTbl() {
  return "\n    <tr>\n      <td colspan=5>\n          <div class=\"cardItem-EmptyData\">\n              \u7A7A\u8CC7\u6599\n          </div>\n      </td>\n    </tr>  \n  ";
}
"use strict";

var api_path = 'raychen';
var token = "zjRahQTiUTdZHg18y4XB5gv1Ort2";
//# sourceMappingURL=all.js.map
