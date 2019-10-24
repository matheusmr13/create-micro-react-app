const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'gen/uploads')
  },
  filename: function (req, file, cb) {
    console.info('gtting file name', req.body);
    cb(null, req.body.packageName + '.zip')
  }
})

var upload = multer({ storage: storage })


const adapter = new FileSync('./gen/db.json')
const db = low(adapter)

db.defaults({ microfrontends: [] })
  .write()

var express = require('express')
var app = express()
app.use(express.json());
console.info(__dirname + '/public')
app.use('/static', express.static('gen'));

app.get('/', function (req, res) {
  res.send('asd');
})

app.get('/microfrontend', function (req, res) {
  const microfrontends = db.get('microfrontend').value();
  res.send(microfrontends);
})

app.post('/microfrontend', function(request, response){
  const microfrontend = request.body;
  db.get('microfrontends')
    .push(microfrontend)
    .write()
  response.send();
});

app.post('/profile', upload.single('build'), function (req, res, next) {
  console.info(req.file, req.body);
  res.send();
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
});