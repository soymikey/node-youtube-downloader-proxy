var path = require('path')
var fs = require('fs')
var ytdl = require('..')

function playlist (url, options) {
  'use strict'
  var video = ytdl(url, options)

  video.on('error', function error (err) {
    console.log(err.stack)
  })

  var size = 0
  video.on('info', function (info) {
    size = info.size
    // var output = path.resolve(__dirname, '/video', size + '.mp4')
    var file = path.join(__dirname + '/video', info._filename)
    video.pipe(fs.createWriteStream(file))
  })

  var pos = 0
  video.on('data', function data (chunk) {
    pos += chunk.length
    // `size` should not be 0 here.
    if (size) {
      var percent = ((pos / size) * 100).toFixed(2)
      process.stdout.cursorTo(0)
      process.stdout.clearLine(1)
      process.stdout.write(percent + '%')
    }
  })

  video.on('next', playlist)
}

playlist('https://www.youtube.com/playlist?list=UUpsSadsgX_Qk9i6i_bJoUwQ', [
  '-f',
  '18',
  '--proxy=127.0.0.1:1080'
])
