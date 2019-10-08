const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Data = require('./data');

// DB CONN pass: nDY1m8hjnZIXz3wM
const dbRoute = 'mongodb+srv://armaneker:nDY1m8hjnZIXz3wM@cluster0-vltvf.mongodb.net/todos?retryWrites=true&w=majority';
mongoose.connect(dbRoute, { useNewUrlParser: true }); // Connect Mongoose with Database URL
// Check connection events
// Connected Event: This event is fired when the connection is successfully connected.
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// Error Event: This event is fired when the connection gives some error.
mongoose.connection.once('open', function () {
    console.log('connected to db');

    // assign express to a constant called app
    const app = express();
    // ROUTER
    // Next we will define express.Router. We use the express.Router class to create modular,
    // mountable route handlers. A Router instance is a complete middleware and routing system; 
    // for this reason, it is often referred to as a “mini-app”.
    const router = express.Router();

    router.get('/todos', (req, res) => { // Method type GET
        // find: The filter are cast to their respective SchemaTypes before the command is sent.
        // left side our model and . find
        Data.find((err, data) => { // if no error, err is null and data contains data
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true, data });
        })
    })

    router.post('/todos', (req, res) => { // Method type POST
        const { todoItem } = req.body;

        if (todoItem.length === 0) {
            return res.json({ // two properties
                success: false,
                error: 'INVALID INPUTS',
            });
        }

        let data = new Data();
        data.todoItem = todoItem;
        data.save((err) => { //saves as the name says 'saves' our document
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    });

    router.put('/todos/:id', (req, res) => { // Method type PUT
        const { todoItem } = req.body;
        // findByIdAndUpdate issues a mongodb findAndModify update command by a document's _id field.
        Data.findByIdAndUpdate(req.params.id, { todoItem }, (err) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    });

    router.delete('/todos/:id', (req, res) => { // Method type DELETE
        // findByIdAndRemove issue a mongodb findAndModify remove command by a document's _id field.
        Data.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.send(err);
            return res.json({ success: true })
        });
    });

    //MIDDLEWARE
    app.use(cors()); //Enable All CORS Requests
    app.use(bodyParser.json());
    // Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
    // This parser accepts any Unicode encoding of the body.
    // A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).

    // Load the router module in the app:
    app.use('/api', router);
    // The app will now be able to handle requests to /api/todos

    // Lastly, app.listen starts a UNIX socket and listens for connections on the given path.
    app.listen(3001, () => console.log(`LISTENING ON PORT 3001`));
});