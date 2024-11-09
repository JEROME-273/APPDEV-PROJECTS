// const express = require('express');
// const app = express();
// const routes = require('./routes/router');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// app.set('view engine' , 'ejs');
// app.use(bodyParser.urlencoded({extended:true}));

// app.use('/', routes);

// app.listen(8080, 'localhost', () => {
//     console.log('server running on http://localhost:8080');
// });


const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const cors = require('cors');
const app = express();
const session = require('express-session');


//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));


//enable CORS for request from vue  front-end
app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true,
}));

// use of routes
app.use('/api', routes);


// start the server
app.listen(8080, 'localhost', () => {
    console.log('server running on http://localhost:8080');
});