const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const logger = require('./logger')
const config = require('config')
const helmet = require('helmet')
const morgan = require('morgan')
const Joi = require('joi')
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

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
]

app.get('/', (req, res) => {
  res.render('index', {
    title: 'My Express APP',
    message: 'Hello'
  })
})

app.get('/api/courses', (req,res) => {
  res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(e => e.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('the course with the given Id was not found')
  res.send(course)
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course)
  res.send(course)
})

app.put('/api/courses/:id', (req, res)=> {
  // Look up the course
  // if not existing, return 404
  const course = courses.find(e => e.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('the course with the given Id was not found')
  // validate
  // if invalid, return 400 - Bad request
  const { error } = validateCourse(req.body) // result.error
  if(error) return res.status(400).send(error.details[0].message)
  // update course
  course.name = req.body.name
  // return the updated course
  res.send(course)

})

app.delete('/api/courses/:id', (req, res)=> {
  // Lookup the course
  // not existing , return 404
  const course = courses.find(e => e.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('the course with the given Id was not found')
  // delete
  const index = courses.indexOf(course)
  courses.splice(index, 1)
  // return the same course
  res.send(course)
})

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(course, schema)
}

// app.get('/api/posts/:year/:month', (req, res)=> {
//   res.send(req.query)
//   // res.send(req.params)
// })

// PORT: use command `export PORT=5000` to set your process variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})