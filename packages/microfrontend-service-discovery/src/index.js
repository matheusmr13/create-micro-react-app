const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const multer  = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const {
      packageName
    } = req.body;
    const dir = `${process.env.PWD}/gen/microfrontends/${packageName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    const {
      version = '0.0.1'
    } = req.body;
    const versionEscaped = version.replace(/\./g, '');
    cb(null, `${versionEscaped}.zip`)
  }
});

const upload = multer({ storage: storage })


const adapter = new FileSync(`${process.env.PWD}/gen/db.json`)
const db = low(adapter)

db.defaults({ microfrontends: [] })
  .write()

const express = require('express')
const app = express()
app.use(express.json());
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

console.info(process.env.PWD)

app.post('/profile', upload.single('build'), function (req, res, next) {
  const {
    packageName,
    version = '0.0.1'
  } = req.body;
  const filename = `${process.env.PWD}/gen/microfrontends/${packageName}/${version.replace(/\./g, '')}.zip`;
  console.info(filename)
  var zip = new AdmZip(`${process.env.PWD}/gen/microfrontends/${packageName}/${version.replace(/\./g, '')}.zip`);
  zip.extractAllTo(`${process.env.PWD}/gen/microfrontends/${packageName}/actual/`, true);
  res.send();
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
});