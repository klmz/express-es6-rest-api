import http from 'http';
import express from 'express';
import mustacheExpress from 'mustache-express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(express.static(__dirname + '/public'))

// connect to db
initializeDb(db => {

    // internal middleware
    app.use(middleware({
        config,
        db
    }));

    // api router
    app.use('/api', api({
        config,
        db
    }));
    app.use('/', (req, res) => {
        res.render("index");
    })
    app.server.listen(process.env.PORT || config.port, () => {
        console.log(`Started on port ${app.server.address().port}`);
    });
});

export default app;
