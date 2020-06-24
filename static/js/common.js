// クリップボードにコピー
function copyToClipboard() {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById("Target");

    // コピー対象のテキストを選択する
    copyTarget.select();

    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");

    // コピーをお知らせする
    alert("コピーしました！ : " + copyTarget.value);
}

//テキストボックスの文字を空にする
function clr(){

    document.js.Target.value="";
  
}

// 親ウィンドウが閉じる時に子ウィンドウも閉じる
window.onbeforeunload = function(){

  var winObj = window.open("", 'select');
  winObj.close();

}

// Jqueryおまじない
$(function() {

    // テキストボックスをクリアする
    $("#clr").click(function() {
        $('#Target').val("");
     });

    // 「例文を表示」ボタンが押されたら非同期でDBとやりとりして例文を取ってくる
    $("#button").click(function() {

        // Jqueryのコマンドだと一発で文字列連結が出来なかったので1個つづ取得して連結
        // 送るコマンドを連結した理由はどうにも2つの引数を送れなさそうだから
        var tempText1 = $('#situation').val();
        var tempText2 = $('#destination').val();
        var tempText =tempText1 + "," + tempText2

        // var textData = JSON.stringify({"text":$("#input-text").val()});
        // よく分からんが送りたい文字列をJSONという形式に変換しないとAJAXで送れないらしい
        var textData = JSON.stringify({"text":tempText});

        // 非同期でサーバーから現在選択されてる項目のdetailsの件数をDBから取ってくる 
        function details_len(){
          return $.ajax({
            type:'POST',
            url:'/check',
            data:textData,
            contentType:'application/json',
          })
        }
        details_len().done(function(data, status, xhr){

          // console.log(data['ResultSet']);
          // console.log(tempText);

          // 件数が2以上なら子ウィンドウを表示
          if (Number(data['ResultSet']) >=2){
          
            window.open('/window/'+tempText,"select");

          // それ以外(件数が1以下)ならそのまま例文を表示
          }else{
  
            // ここでAJAXという手法でサーバーに対し非同期通信を投げる
            // 中身はよく分からんが引数を見れば何送れば良さそうか大体分かるでしょ
            $.ajax({
              type:'POST',
              url:'/postText',
              data:textData,
              contentType:'application/json',
              success:function(data) {
                var result = JSON.parse(data.ResultSet).result;
                $("#Target").val(result);
              }
            });
            return false;
          }

        }).fail(function(XMLHttpRequest, status, errorThrown){

        });

      });

      // 小画面のボタン
      $("#button2").click(function() {

        let str = "";
        const color2 = document.getElementsByName("example");
        
        // strに現在選択しているラジオボタンの値を入れる
        for (let i = 0; i < color2.length; i++){
          if(color2[i].checked){ //(color2[i].checked === true)と同じ
            str = color2[i].value;
            // console.log(str);
            break;
          }
        }

        // クエリ用の文字列を作成
        var tempText = decodeURIComponent(location.pathname.slice(location.pathname.lastIndexOf('/')+1));
        tempText=tempText + "," + str ;

        // console.log(tempText);

         // よく分からんが送りたい文字列をJSONという形式に変換しないとAJAXで送れないらしい
        textData = JSON.stringify({"text":tempText});
        // console.log(tempText);

        // 非同期で取得した例文を親ウィンドウに投げてウィンドウを閉じる
        $.ajax({
          type:'POST',
          url:'/postText2',
          data:textData,
          contentType:'application/json',
          success:function(data) {
            var result = JSON.parse(data.ResultSet).result;
            window.opener.document.getElementById("Target").value=result;
            window.close();
          }
        });
        
        return false;
        
      });

});