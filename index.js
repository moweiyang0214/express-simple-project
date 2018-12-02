const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const logger = require('./middleware/logger')
const config = require('config')
const helmet = require('helmet')
const morgan = require('morgan')
const courses = require('./routes/courses')
const home = require('./routes/home')
const express = require('express')
const app = express();

app.set('view engine', 'pug')
app.set('views', './views') // default

console.log(`Node_ENV: ${process.env.NODE_ENV}`) // undefined
console.log(`app: ${app.get('env')}`)
// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true})) 
// middleware that can serve static content
app.use(express.static('public'))
app.use(helmet())
app.use('/api/courses', courses)
app.use('/', home)

//configuration
console.log('Application Name: '+ config.get('name'))
console.log('mail-server: '+ config.get('mail.host'))
console.log('mail password: '+ config.get('mail.password'))

// use `export NODE_ENV=product` will not be able
if(app.get('env') === 'development'){
  app.use(morgan('tiny'))
  startupDebugger('morgan enable...')
}

// DB work
dbDebugger('Connected to the database...')

app.use(logger)

app.use(function(req, res, next) {
  console.log('Authenticating...')
  next()
})

// app.get('/api/posts/:year/:month', (req, res)=> {
//   res.send(req.query)
//   // res.send(req.params)
// })

// PORT: use command `export PORT=5000` to set your process variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})