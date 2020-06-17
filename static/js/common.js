// クリップボードにコピー
function copyToClipboard() {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById("Target");

    // コピー対象のテキストを選択する
    copyTarget.select();

    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");

    // コピーをお知らせする
    alert("コピーできました！ : " + copyTarget.value);
}

//テキストボックスの文字を空にする
function clr(){

    document.js.Target.value="";
  
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
      });

});