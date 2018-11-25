const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!!!')
})

app.get('/api/courses', (req,res) => {
  res.send([1,2,3])
})

// PORT: use command `export PORT=5000` to set your process variable
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log(`listening on port ${port}...`)
})
// app.post()
// app.put()
// app.delete()