
$(function(){
  getProductList()
  showMyCart()
})
const list_Product = document.querySelector('.productWrap')
const cartTbl = document.querySelector('.shoppingCart-table')
const handleForm = document.querySelector(".orderInfo-form")
const categorySelectChange = document.querySelector(".productSelect")

const transactionType = document.querySelector('#tradeWay');

let PData = []
let cartArr = []

const constraints = {
  "name": {
      presence: {
          message: "此欄位必填!",
      }
  },
  "tel": {
      presence: {
          message: "此欄位必填!"
      },
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
      },
  },
}

function getProductList(){
  const url = `${BaseUrl}/api/livejs/v1/customer/${api_path}/products` 
  axios.get(url)
  .then(function (response) {
    let data = response.data
    PData = data.products
    if(data.status)
       renderProductData(data.products)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  })

}


function showMyCart(){
  const url = `${BaseUrl}/api/livejs/v1/customer/${api_path}/carts`
  axios.get(url)
  .then(function (response) {
    // 成功會回傳的內容
    reRenderMyCart(response.data)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  })  
}

function addMyCart(pId){
  let buyCount = 0
  cartArr.forEach((item) => {
    if (item.product.id == pId) {
      item.quantity+=1; 
      buyCount = item.quantity;
    }
  });
 
  axios.post(`${BaseUrl}/api/livejs/v1/customer/${api_path}/carts`, {
    //帶入的值會使用物件包裝
    "data": {
      "productId": pId,
      "quantity": buyCount
    }
  })
  .then(function (response) {
    // 成功會回傳的內容
 
    let data = response.data
    
    if(data.status){
      reRenderMyCart(data)
      Swal.fire({
        title: '新增成功!',
        text: '',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }else{
      Swal.fire({
        title: '新增失敗!',
        text: '',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

//更新我的購物車列表
function reRenderMyCart(PDArr){
  cartArr = PDArr.carts
  //表頭
  const myCartHTML_TH= `
      <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
      </tr>

  `
  let myCartHTML = ``
  let totalPrice = PDArr.finalTotal
  if(PDArr.carts.length==0){
    myCartHTML += ShowEmptyTbl();
  }else{
    PDArr.carts.forEach((pItemObj,pIdx)=>{
     
      myCartHTML += `
        <tr>
          <td>
              <div class="cardItem-title">
                  <img src="${pItemObj.product.images}" alt="">
                  <p>${pItemObj.product.title}</p>
              </div>
          </td>
          <td>NT$${pItemObj.product.price}</td>
          <td>${pItemObj.quantity}</td>
          <td>NT$${pItemObj.product.price*pItemObj.quantity}</td>
          <td class="discardBtn">
              <a onclick=delSingleCart("${pItemObj.id}") href="#javascript:;" class="material-icons">
                  clear
              </a>
          </td>
        </tr>  
      `
      
    })    
  }

  
  //表尾
  const myCartHTML_Tfoot= `
    <tr>
      <td>
          <a href="#javascript:;" onclick='delAllCart();' class="discardAllBtn">刪除所有品項</a>
      </td>
      <td colspan="2"></td>

      <td>
          <p>總金額</p>
      </td>
      <td>NT$${totalPrice}</td>
    </tr>

  `
  cartTbl.innerHTML = myCartHTML_TH + myCartHTML + myCartHTML_Tfoot
 
}


// 刪除購物車內特定產品
function delSingleCart(pid){
  axios.delete(`${BaseUrl}/api/livejs/v1/customer/${api_path}/carts/${pid}`).
    then(function (response) {
      if(response.data.status){
        Swal.fire({
          title: '刪除成功!',
          text: '',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }else{
        Swal.fire({
          title: '刪除失敗!',
          text: '',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
      reRenderMyCart(response.data);
  })
}

//清除購物車內全部產品
function delAllCart(){
  axios.delete(`${BaseUrl}/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      //重新渲染一次List  carts
      reRenderMyCart(response.data);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });

}

function addPresertData(){
  let currentOpt = transactionType.options[transactionType.selectedIndex]; 
  const error = 
     validate(
      {
        email: document.getElementById("customerEmail").value,
        name:document.getElementById("customerName").value,
        address:document.getElementById("customerEmail").value,
        tel:document.getElementById("customerPhone").value
      }, 
      constraints);

  if(error==undefined){
    //表示驗證通過
    axios.post(`${BaseUrl}/api/livejs/v1/customer/${api_path}/orders`, {
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
    })
    .then(function (response) {
      // 成功會回傳的內容
      let data = response.data


    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });

  }else{

    



  }



}






categorySelectChange.addEventListener("change",(e)=>{
  if(e.target.value=="全部"){
    renderProductData(PData)
  }else{
    renderProductData(FilterProduct(e.target.value))
  }
})

 



handleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addPresertData();
});




function FilterProduct(qCategory){
  return PData.filter((el)=>{
    return el.category == qCategory
  })
}

function renderProductData(productArr){
  let HTMLStr = ""
  
  productArr.forEach((item,index)=>{
    HTMLStr += `
    <li class="productCard">
                <h4 class="productType">${item.category}</h4>
                <img src="${item.images}" alt="">
                <a href="#javascript:;"  class="addCardBtn" onclick=addMyCart("${item.id}") data-pid="${item.id}" >加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>
    `
  })
  list_Product.innerHTML = HTMLStr
}





//將SweetAlert封裝
function ShowToast(title,text,isSuccess,confirmButton){
  let iconMsg = ''
  if (isSuccess){
    iconMsg = 'success'
  }else{
    iconMsg = 'error'
  }
  Swal.fire({
    title: title,
    text: text,
    icon: iconMsg,
    confirmButtonText: confirmButton
  })
}

//秀空白td
function ShowEmptyTbl(){
  return  `
    <tr>
      <td colspan=5>
          <div class="cardItem-EmptyData">
              空資料
          </div>
      </td>
    </tr>  
  `
}