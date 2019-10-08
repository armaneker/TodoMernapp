// With Mongoose, everything is derived from a Schema. 
// Let's get a reference to it and define our todo items.
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema(
    {
        todoItem: String
    },
    {
        timestamps: true
    }
)

// So far so good. We've got a schema with two properties.
// The next step is compiling our schema into a Model.
module.exports = mongoose.model('Data', DataSchema);

// A model is a class with which we construct documents.
// In this case, each document will be a todo item with properties
// and behaviors as declared in our schema.