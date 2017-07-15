const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const Nexmo = require('nexmo');

const app = express();
const server = app.listen(3000);
const nexmo = new Nexmo({
  apiKey: 6834c3b7,
  apiSecret: bc6ebd41b974275c,
}, {debug: true});

app.set(path.join('views', __dirname, '/../views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  res.send(req.body);
  const toNumber = req.body.number;
  const text = req.body.text;
  nexmo.message.sendSms(
    NUMBER, toNumber text, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(response.data)
      }
    }
  );
});
