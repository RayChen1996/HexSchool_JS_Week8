
$(function(){
  GetProductList()
  ShowMyCart()
})

let PData = []
let CartArr = []
function GetProductList(){
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/getproductlist/carts
  const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
  // console.log(`GetProductList  ${api_path}`)
 
  axios.get(url)
  .then(function (response) {
    // 成功會回傳的內容
    // console.log(response);
    let data = response.data
    PData = data.products
    if(data.status)
       RenderProductData(data.products)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  })



}





function ShowMyCart(){
  // https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts
  const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
  axios.get(url)
  .then(function (response) {
    // 成功會回傳的內容
    console.log('我的購物車');
    console.log(response);
    ReRenderMyCart(response.data)

  
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  })  
}

function AddMyCart(PId){
  console.log(`PId  ${PId}`)
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    //帶入的值會使用物件包裝
    "data": {
      "productId": PId,
      "quantity": 1
    }
  })
  .then(function (response) {
    // 成功會回傳的內容
    let data = response.data
    CartArr = data.carts
    if(data.status){
      ReRenderMyCart(data)
    }
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}

//更新我的購物車列表
function ReRenderMyCart(PDArr){
  const CartTbl = document.querySelector('.shoppingCart-table')
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
  let TotalPrice = PDArr.finalTotal
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
          <td>NT$${pItemObj.product.origin_price}</td>
          <td>1</td>
          <td>NT$${pItemObj.product.price}</td>
          <td class="discardBtn">
              <a onclick=DelSingleCart("${pItemObj.id}") href="#javascript:;" class="material-icons">
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
          <a href="#javascript:;" onclick='DelAllCart();' class="discardAllBtn">刪除所有品項</a>
      </td>
      <td colspan="2"></td>

      <td>
          <p>總金額</p>
      </td>
      <td>NT$${TotalPrice}</td>
    </tr>

  `
  CartTbl.innerHTML = myCartHTML_TH + myCartHTML + myCartHTML_Tfoot
}


// 刪除購物車內特定產品
function DelSingleCart(pid){
  //'https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts/jw1jNknjVsKYPNyqYSWA'
  // console.log(`delete at  ${pid}`)
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/jw1jNknjVsKYPNyqYSWA
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${pid}`).
    then(function (response) {
      console.log(response.data);
      ReRenderMyCart(response.data);
  })


}

//清除購物車內全部產品
function DelAllCart(){
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/carts
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      //重新渲染一次List  carts

      ReRenderMyCart(response.data);
      
      
  })

}

function AddPresertData(){
  // console.log($("#tradeWay").val())
  //https://livejs-api.hexschool.io/api/livejs/v1/customer/raychen/orders
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
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
  })
  .then(function (response) {
    // 成功會回傳的內容
    let data = response.data
    console.log(response)

  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });


}





let CaegorySelectChange = document.querySelector(".productSelect")
CaegorySelectChange.addEventListener("change",(e)=>{
  console.log(e.target.value)
  if(e.target.value=="全部"){
    RenderProductData(PData)
  }else{
    RenderProductData(FilterProduct(e.target.value))
  }
})


// let SubmitPresertOrrder = document.querySelector(".orderInfo-btn")
// SubmitPresertOrrder.addEventListener("click",()=>{
//   AddPresertData()
// })


let handleForm = document.querySelector(".orderInfo-form")

handleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  AddPresertData();

  
});




function FilterProduct(qCategory){
  return PData.filter((el)=>{
    return el.category == qCategory
  })
}

function RenderProductData(ProductArr){
  console.log(ProductArr)
  var HTMLStr = ""
  let list_Product = document.querySelector('.productWrap')
  ProductArr.forEach((item,index)=>{
    HTMLStr += `
    <li class="productCard">
                <h4 class="productType">${item.category}</h4>
                <img src="${item.images}" alt="">
                <a href="#javascript:;"  class="addCardBtn" onclick=AddMyCart("${item.id}") data-pid="${item.id}" >加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>
    `
  })
  list_Product.innerHTML=HTMLStr
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