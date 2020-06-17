
import sqlite3,json
# flaskをimportしてflaskを使えるようにする
from flask import Flask , render_template , request , redirect , session , jsonify
# appにFlaskを定義して使えるようにしています。Flask クラスのインスタンスを作って、 app という変数に代入しています。
app = Flask(__name__)

@app.route("/")
def contents():

    conn = sqlite3.connect('service.db')
    c = conn.cursor()
    c.execute("select distinct situation from Example_Sentence")
    sentence_list = []
    for row in c.fetchall():
        sentence_list.append(row[0])
    c.execute("select distinct destination from Example_Sentence")
    destination_list = []
    for row in c.fetchall():
        destination_list.append(row[0])

    return render_template("contents.html",situation_list=sentence_list,destination_list=destination_list)



# 非同期で送られてきた文字列からクエリを作成し例文を取得しブラウザに返す
@app.route('/postText', methods=['POST'])
def lower_conversion():
    text = request.json['text']

    #配列にテキストを分割して入れる。0がシチュエーションで1が宛先
    temp_query=text.split(",")
    query={"situation": temp_query[0], "destination": temp_query[1]}
    # print(query)

    conn = sqlite3.connect('service.db')
    c = conn.cursor()
    c.execute("select sentence from Example_Sentence where situation = ? and destination = ?",(query["situation"],query["destination"]))

    result_tuple=c.fetchone()
    # print(result_tuple[0])

    c.close()

    return_data = {"result":result_tuple[0]}
    return jsonify(ResultSet=json.dumps(return_data))

@app.errorhandler(403)
def mistake403(code):
    return 'There is a mistake in your url!'

@app.errorhandler(404)
def notfound404(code):
    return "404だよ！！見つからないよ！！！"


# __name__ というのは、自動的に定義される変数で、現在のファイル(モジュール)名が入ります。 ファイルをスクリプトとして直接実行した場合、 __name__ は __main__ になります。
if __name__ == "__main__":
    # Flask が持っている開発用サーバーを、実行します。
    # app.run()
    app.run(debug=True)