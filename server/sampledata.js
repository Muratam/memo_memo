
// genre,how : nameは表示のため, idで管理
//           : 0はallのために開けておく(1からスタート)
// contents  : [genre][how]の下に管理

let data = {
  genres: [
    {name: 'WorkSpace', id: 1}, {name: 'フォント', id: 2}, {name: 'CTF', id: 3},
    {name: 'Deep Learning', id: 4}, {name: 'シェーダー', id: 5},
    {name: 'Tool', id: 6}, {name: 'Trash', id: 7}
  ],
  hows: [
    {name: 'Todo', id: 1}, {name: 'Later', id: 2}, {name: 'URL', id: 3},
    {name: 'Study', id: 4}, {name: 'Data', id: 5}
  ],
  contents: {
    4: {
      4: [
        {
          id: 'r6h8zabef5f1xmqnxfyikx3930cczsnl',
          title: 'フレームワーク: deeplearn.js',
          body: 'WebGL + GPU でブラウザ上で高速に処理'
        },
        {
          id: 'afa44we5r5uqheusi857n6jl82s404wj',
          title: '理論: CAN',
          url: 'http://createwith.ai/paper/20170629/839'
        },
        {
          id: 'gypy6jtt1bhxi1pgdi18p6ohxhnhgecm',
          title: '理論: StacksGAN',
          url: 'http://catindog.hatenablog.com/entry/2017/02/05/160156'
        },
        {
          id: 'dj3y356vxfsl9mhkvnoz8niw0nnapo3e',
          title: '学習済みモデル: illustlation2vec',
          url: 'https://github.com/rezoo/illustration2vec'
        },
        {
          id: 'auwjef52izfed0esbntv7stglhbbvhwq',
          title: '学習済みモデル: word2vec',
          url:
              'https://aial.shiroyagi.co.jp/2017/02/japanese-word2vec-model-builder'
        }
      ]
    }
  }
};

module.exports = data;
