const request = require('request');
const fs = require('fs');
const url = 'http://localhost:8080/profile';
var req = request.post(url, function (err, resp, body) {
	if (err) {
		console.log('Error!');
	} else {
		console.log('URL: ' + body);
	}
});
var form = req.form();

form.append('mykey', 'myvalue');
form.append('file', fs.createReadStream('./package.json'));
