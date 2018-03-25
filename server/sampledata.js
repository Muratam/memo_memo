
// genre,how : nameは表示のため, idで管理
//           : 0はallのために開けておく(1からスタート)
// contents  : [genre][how]の下に(ひとまずは)リストで管理(必要に応じてid付与)

let data = {
  genre: [
    {name: 'WorkSpace', id: 1}, {name: 'フォント', id: 2}, {name: 'CTF', id: 3},
    {name: 'Deep Learning', id: 4}, {name: 'シェーダー', id: 5},
    {name: 'Tool', id: 6}, {name: 'Trash', id: 7}
  ],
  how: [
    {name: 'Todo', id: 1}, {name: 'Later', id: 2}, {name: 'URL', id: 3},
    {name: 'Study', id: 4}, {name: 'Data', id: 5}
  ],
  contents: {
    4: {
      4: [
        {
          title: 'フレームワーク: deeplearn.js',
          body: 'WebGL + GPU でブラウザ上で高速に処理'
        },
        {title: '理論: CAN', url: 'http://createwith.ai/paper/20170629/839'}, {
          title: '理論: StacksGAN',
          url: 'http://catindog.hatenablog.com/entry/2017/02/05/160156'
        },
        {
          title: '学習済みモデル: illustlation2vec',
          url: 'https://github.com/rezoo/illustration2vec'
        },
        {
          title: '学習済みモデル: word2vec',
          url:
              'https://aial.shiroyagi.co.jp/2017/02/japanese-word2vec-model-builder/'
        }
      ]
    }
  }
};

module.exports = data;
