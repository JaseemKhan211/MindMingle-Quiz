const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    options: { 
        type: [String], 
        required: true 
    },
    correct: { 
        type: String, 
        required: true 
    },
});

const QA = mongoose.model("QA", qaSchema);
module.exports = QA;