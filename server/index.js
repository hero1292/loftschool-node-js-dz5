const express = require('express');
const router = express.Router();
const http = require('http');
const path = require('path');const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const chat = require('./chat');

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || config.port;

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use(
  session({
    secret: 'loftschool',
    key: 'sessionkey',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    saveUninitialized: false,
    resave: false,
  })
);

app.use(cookieParser());

app.use(require('./routes/auth')(router));
app.use(require('./routes/user')(router));
app.use(require('./routes/news')(router));
app.use(require('./routes/permission')(router));

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.status(200).sendFile('index.html', {root: path.join(__dirname, '../dist')});
});

server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

chat.WS(server);