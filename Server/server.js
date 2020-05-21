const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const cors = require('cors');
require ('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

app.use(cors({ origin: "*"}));

app.post('save-products', (req, res)=>{
	console.log('req in save-products route: ', req);
})

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
	console.log(`Server is running on port ${port}`)
})
