const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json({ limit: '300kb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/testurl',async (req, res) => {
  const response1 = await axios.get(`${process.env.service1}/dummypath1`);
  const response2 = await axios.get(`${process.env.service2}/dummypath2`);
  res.status(200).send({
    input: req.body,
    response1: response1.data,
    response2: response2.data,
  });
});



module.exports = app;
