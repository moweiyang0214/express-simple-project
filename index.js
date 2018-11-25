const express = require('express')
const app = express();

// middleware
app.use(express.json())

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
]

app.get('/', (req, res) => {
  res.send('Hello world!!!')
})

app.get('/api/courses', (req,res) => {
  res.send(courses)
})

app.post('/api/courses', (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course)
  res.send(course)
})

app.get('/api/courses/:course_id', (req, res) => {
  const course = courses.find(e => e.id === parseInt(req.params.course_id))
  if(!course) { //404
    res.status(404).send('the course with the given Id was not found')
  } else {
    res.send(course)
  }
})

app.get('/api/posts/:year/:month', (req, res)=> {
  res.send(req.query)
  // res.send(req.params)
})
// PORT: use command `export PORT=5000` to set your process variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})
// app.post()
// app.put()
// app.delete()