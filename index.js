const fs = require('fs')
const http = require('http')
const path = require('path')
const time = require('time')

const server = http.createServer((req, res) => {

    //set basic variables
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    let extname = path.extname(filePath)
    let contentType = 'text/html'

    //Log requests
    console.log(`${time.Date()} \t ${req.url}`)
    fs.appendFile(path.join(__dirname, 'log.txt'), `${time.Date()} \t ${req.connection.remoteAddress} \t ${req.url} \n`, (err) => {
        if( err ) throw err
    })

    //Determine request data type
    switch(extname){
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.jpg':
            contentType = 'image/jpg'
            break
    }

    //Read file and send response
    fs.readFile(filePath, (err, content) => {
        if(err) {
            //Log errors
            fs.appendFile(path.join(__dirname, 'log.txt'),`${time.Date()} \t ${err}\n`, (err) => {
                if( err ) throw err
            })

            //Handle erorrs
            if(err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public/404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html'})
                    res.end(content, 'utf8')
                })
            }else{
                res.writeHead(500)
                res.send(`Server error: ${err.code}`, 'utf8')
            }
            
        //Normal response
        }else{
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf8')
        }
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
