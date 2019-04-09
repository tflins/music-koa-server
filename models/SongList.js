const mongoose = require('mongoose')
const Scheam = mongoose.Schema

// 实例化数据模板
const SongListScheam = new Scheam({
  userId: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  list: {
    type: Array
  }
})

module.exports = SongList = mongoose.model('songList', SongListScheam)
