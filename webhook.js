const crypto = require('crypto')
const spawn = require('child_process') //开子进程
const http = require('http')
const SECRET = 'Cjl1134173583@'

function sign(body) {
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
}
const server = http.createServer(function (req, res) {
  console.log(req.method, req.url)
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = []
    req.on('data', function (buffer) {
      buffers.push(buffer)
    })
    req.on('end', function (buffer) {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-github-event'] //event=push
      // github请求过来时候，要传递请求体是body，同时还会传递一个签名signature过来，我需要验证签名对不对，对才往下走
      let signature = req.heaers['x-hub-signature']
      if (signature !== sign(body)) {
        return res.end('Not Allowed')
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true }))
      if(event === 'push') {
        //开始部署
        let payload = JSON.parse(body)
        let child = spawn('sh', [`./${payload.repository.name}`])
        let buffers = []     //在子进程执行这些脚本，执行的就是sh vue-front.sh等脚本
        child.stdout.on('data', function(buffer) {
          buffers.push(buffer)
        })
        child.stdout.on('end', function(buffer) {
          let log = Buffer.concat(buffers)
          console.log(log)
        })
      }
    })
  } else {
    res.end('not found!')
  }
})

server.listen(4000, function () {
  console.log('服务器启动在4000端口上！')
})