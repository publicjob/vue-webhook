const http = require('http')


const server = http.createServer(function(req, res) {
  console.log(req.method, req.url) 
  if(req.method == 'POST' && req.url =='/webhook'){
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ok: true}))
  }else {
    res.end('not found!')
  }
})

server.listen(4000, function() {
  console.log('服务器启动在4000端口上！')
})