
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);

        const conn = await mongoose.connect('mongodb+srv://Dhruvsingla301:Ncsj4LY9A4JgkTQ9@cluster0.9c4jwum.mongodb.net/?retryWrites=true&w=majority&appName=bookhive', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
