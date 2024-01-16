'use strict';

$.ajax({
  type: 'get',
  url: 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?',
  data: {
    applicationId: '1098925195934386350',
    keyword: '猫砂 紙',
    sort: '+itemPrice',
    availability: '1',
  }
})
.done(function(data){
  data.Items.forEach(function(item, index){
    // 猫砂以外が検索結果に表示されるのを防ぐため、ジャンルIDが猫砂の場合に限定する
    if(item.Item.genreId === "204174") {
      const productName = item.Item.itemName;
      const productPrice = item.Item.itemPrice;
      const productURL = item.Item.itemUrl;
      const productImg = item.Item.mediumImageUrls[0].imageUrl;
      const shopURL = item.Item.shopUrl;
      const shopName = item.Item.shopName;
      let lowestPriceMark = '';

      // "数字 + L", "数字 + l", "数字 + リットル"という文字列があれば、その前の数字を抜き出す
      // \d+(?:\.\d+)?: 符号なし0省略なしの実数
      const capacity = productName.match((/(\d+(?:\.\d+)?L)|(\d+(?:\.\d+)?l)|(\d+(?:\.\d+)?リットル)/g));
      let pricePerLiterMes = `計算不可。<br>もしくは猫砂ではありません。`;
      let capacityNum = 0;
      if(capacity != null) {
        capacityNum = capacity[0].slice(0, -1);
        const pricePerLiter = parseInt(productPrice)/parseFloat(capacityNum);
        const roundedPrice = Math.round(pricePerLiter);
        pricePerLiterMes = `<span class="big-emphasis">${roundedPrice}円</span>`;

        // 最安値を比較
        let lowestPrice = 0;
        if(lowestPrice >= roundedPrice) {
          lowestPrice = roundedPrice;
          console.log("最安値:", lowestPrice);
          lowestPriceMark = `<div class="lowest-mark-inner">
            <div class="lowest-mark"><p>最安値</p></div>
          </div>`;
        }
      }

      const product = `<li class="product-detail">
      <p>商品名: <a target="_blank" href="${productURL}">${productName}</a></p>
      <div class="lowest-mark-wrap">${lowestPriceMark}</div>
      <table>
        <tr>
          <th>商品画像</th>
          <th>価格</th>
          <th>容量</th>
          <th>1Lあたりの価格</th>
        </tr>
        <tr>
          <td><img class="thumb" src="${productImg}" /></td>
          <td><span class="big-emphasis">${productPrice}円</span></td>
          <td><span class="big-emphasis">${capacityNum}L</span></td>
          <td>${pricePerLiterMes}</td>
        </tr>
      </table>
      <p>ショップ名: <a target="_blank" href="${shopURL}">${shopName}</a></p>
      </li>`;
      $('#products').append(product);
    }
  });
}).fail(function(){
  console.log('取得失敗');
});
