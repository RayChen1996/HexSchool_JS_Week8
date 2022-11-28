"use strict";

$(function () {
  getProductList();
  showMyCart();
});
var list_Product = document.querySelector('.productWrap');
var cartTbl = document.querySelector('.shoppingCart-table');
var handleForm = document.querySelector(".orderInfo-form");
var categorySelectChange = document.querySelector(".productSelect");
var transactionType = document.querySelector('#tradeWay');
var PData = [];
var cartArr = [];
var constraints = {
  "name": {
    presence: {
      message: "此欄位必填!"
    }
  },
  "tel": {
    presence: {
      message: "此欄位必填!"
    }
  },
  "email": {
    presence: {
      message: "此欄位必填!"
    },
    email: true
  },
  "address": {
    presence: {
      message: "此欄位必填!"
    }
  }
};

function getProductList() {
  var url = "".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/products");
  axios.get(url).then(function (response) {
    var data = response.data;
    PData = data.products;
    if (data.status) renderProductData(data.products);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function showMyCart() {
  var url = "".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts");
  axios.get(url).then(function (response) {
    // 成功會回傳的內容
    reRenderMyCart(response.data);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function addMyCart(pId) {
  var buyCount = 0;
  cartArr.forEach(function (item) {
    if (item.product.id == pId) {
      item.quantity += 1;
      buyCount = item.quantity;
    }
  });
  axios.post("".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts"), {
    //帶入的值會使用物件包裝
    "data": {
      "productId": pId,
      "quantity": buyCount
    }
  }).then(function (response) {
    // 成功會回傳的內容
    var data = response.data;

    if (data.status) {
      reRenderMyCart(data);
      Swal.fire({
        title: '新增成功!',
        text: '',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: '新增失敗!',
        text: '',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
} //更新我的購物車列表


function reRenderMyCart(PDArr) {
  cartArr = PDArr.carts; //表頭

  var myCartHTML_TH = "\n      <tr>\n        <th width=\"40%\">\u54C1\u9805</th>\n        <th width=\"15%\">\u55AE\u50F9</th>\n        <th width=\"15%\">\u6578\u91CF</th>\n        <th width=\"15%\">\u91D1\u984D</th>\n        <th width=\"15%\"></th>\n      </tr>\n\n  ";
  var myCartHTML = "";
  var totalPrice = PDArr.finalTotal;

  if (PDArr.carts.length == 0) {
    myCartHTML += ShowEmptyTbl();
  } else {
    PDArr.carts.forEach(function (pItemObj, pIdx) {
      myCartHTML += "\n        <tr>\n          <td>\n              <div class=\"cardItem-title\">\n                  <img src=\"".concat(pItemObj.product.images, "\" alt=\"\">\n                  <p>").concat(pItemObj.product.title, "</p>\n              </div>\n          </td>\n          <td>NT$").concat(pItemObj.product.price, "</td>\n          <td>").concat(pItemObj.quantity, "</td>\n          <td>NT$").concat(pItemObj.product.price * pItemObj.quantity, "</td>\n          <td class=\"discardBtn\">\n              <a onclick=delSingleCart(\"").concat(pItemObj.id, "\") href=\"#javascript:;\" class=\"material-icons\">\n                  clear\n              </a>\n          </td>\n        </tr>  \n      ");
    });
  } //表尾


  var myCartHTML_Tfoot = "\n    <tr>\n      <td>\n          <a href=\"#javascript:;\" onclick='delAllCart();' class=\"discardAllBtn\">\u522A\u9664\u6240\u6709\u54C1\u9805</a>\n      </td>\n      <td colspan=\"2\"></td>\n\n      <td>\n          <p>\u7E3D\u91D1\u984D</p>\n      </td>\n      <td>NT$".concat(totalPrice, "</td>\n    </tr>\n\n  ");
  cartTbl.innerHTML = myCartHTML_TH + myCartHTML + myCartHTML_Tfoot;
} // 刪除購物車內特定產品


function delSingleCart(pid) {
  axios["delete"]("".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts/").concat(pid)).then(function (response) {
    if (response.data.status) {
      Swal.fire({
        title: '刪除成功!',
        text: '',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: '刪除失敗!',
        text: '',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

    reRenderMyCart(response.data);
  });
} //清除購物車內全部產品


function delAllCart() {
  axios["delete"]("".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts")).then(function (response) {
    //重新渲染一次List  carts
    reRenderMyCart(response.data);
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

function addPresertData() {
  var currentOpt = transactionType.options[transactionType.selectedIndex];
  var error = validate({
    email: document.getElementById("customerEmail").value,
    name: document.getElementById("customerName").value,
    address: document.getElementById("customerEmail").value,
    tel: document.getElementById("customerPhone").value
  }, constraints);

  if (error == undefined) {
    //表示驗證通過
    axios.post("".concat(BaseUrl, "/api/livejs/v1/customer/").concat(api_path, "/orders"), {
      //帶入的值會使用物件包裝
      "data": {
        "user": {
          "name": document.getElementById("customerName").value,
          "tel": document.getElementById("customerPhone").value,
          "email": document.getElementById("customerEmail").value,
          "address": document.getElementById("customerAddress").value,
          "payment": currentOpt.value
        }
      }
    }).then(function (response) {
      // 成功會回傳的內容
      var data = response.data;
    })["catch"](function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });
  } else {}
}

categorySelectChange.addEventListener("change", function (e) {
  if (e.target.value == "全部") {
    renderProductData(PData);
  } else {
    renderProductData(FilterProduct(e.target.value));
  }
});
handleForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addPresertData();
});

function FilterProduct(qCategory) {
  return PData.filter(function (el) {
    return el.category == qCategory;
  });
}

function renderProductData(productArr) {
  var HTMLStr = "";
  productArr.forEach(function (item, index) {
    HTMLStr += "\n    <li class=\"productCard\">\n                <h4 class=\"productType\">".concat(item.category, "</h4>\n                <img src=\"").concat(item.images, "\" alt=\"\">\n                <a href=\"#javascript:;\"  class=\"addCardBtn\" onclick=addMyCart(\"").concat(item.id, "\") data-pid=\"").concat(item.id, "\" >\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n                <h3>").concat(item.title, "</h3>\n                <del class=\"originPrice\">NT").concat(item.origin_price, "</del>\n                <p class=\"nowPrice\">NT").concat(item.price, "</p>\n            </li>\n    ");
  });
  list_Product.innerHTML = HTMLStr;
} //將SweetAlert封裝


function ShowToast(title, text, isSuccess, confirmButton) {
  var iconMsg = '';

  if (isSuccess) {
    iconMsg = 'success';
  } else {
    iconMsg = 'error';
  }

  Swal.fire({
    title: title,
    text: text,
    icon: iconMsg,
    confirmButtonText: confirmButton
  });
} //秀空白td


function ShowEmptyTbl() {
  return "\n    <tr>\n      <td colspan=5>\n          <div class=\"cardItem-EmptyData\">\n              \u7A7A\u8CC7\u6599\n          </div>\n      </td>\n    </tr>  \n  ";
}
"use strict";

var api_path = 'raychen';
var token = "zjRahQTiUTdZHg18y4XB5gv1Ort2";
var BaseUrl = "https://livejs-api.hexschool.io";
//# sourceMappingURL=all.js.map
