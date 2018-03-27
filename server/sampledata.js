
// genre,how : nameは表示のため, idで管理
//           : 0はallのために開けておく(1からスタート)
// contents  : [genre][how]の下に管理

let data = {
  genres: [
    {name: '❓', id: 'temporary'},  // 特殊
    {name: '🗑', id: 'trash'},   // 特殊
    {name: 'フォント', id: 'fheaufhaeu'},
    {name: 'CTF', id: 'jfeafhuea'},
    {name: 'Deep Learning', id: 'hfuahfauefha'},
    {name: 'シェーダー', id: 'f89rhfsna'},
    {name: 'Tool', id: 'fjaufhe8hq'},
  ],
  hows: [
    {name: 'Todo', id: 'todo'},    // 特殊
    {name: 'Later', id: 'later'},  // 特殊
    {name: 'URL', id: 'url'},      // 特殊
    {name: 'Study', id: 'study'}   // 特殊
  ],
  contents: [
    {
      genre: 'hfuahfauefha',
      how: 'url',
      id: 'r6h8zabef5f1xmqnxfyikx3930cczsnl',
      title: 'フレームワーク: deeplearn.js',
      body: 'WebGL + GPU でブラウザ上で高速に処理'
    },
    {
      genre: 'hfuahfauefha',
      how: 'url',
      id: 'afa44we5r5uqheusi857n6jl82s404wj',
      title: '理論: CAN',
      url: 'http://createwith.ai/paper/20170629/839'
    },
    {
      genre: 'hfuahfauefha',
      how: 'url',
      id: 'gypy6jtt1bhxi1pgdi18p6ohxhnhgecm',
      title: '理論: StacksGAN',
      url: 'http://catindog.hatenablog.com/entry/2017/02/05/160156'
    },
    {
      genre: 'hfuahfauefha',
      how: 'url',
      id: 'dj3y356vxfsl9mhkvnoz8niw0nnapo3e',
      title: '学習済みモデル: illustlation2vec',
      url: 'https://github.com/rezoo/illustration2vec'
    },
    {
      genre: 'hfuahfauefha',
      how: 'url',
      id: 'auwjef52izfed0esbntv7stglhbbvhwq',
      title: '学習済みモデル: word2vec',
      url: 'http://aial.shiroyagi.co.jp/2017/02/japanese-word2vec-model-builder'
    }
  ]
};

module.exports = data;
