import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import user from './models/users.js';  

const app = express();
const port = 3000;  

// Middleware to parse JSON bodies
app.use(express.json());

dotenv.config();

const mongoURL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/users', async (req, res) => {
    try {
        const { name, email, age, isActive } = req.body;
        const newUser = new user({ name, email, age, isActive });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/users/active', async (req, res) => {
    try {
        const activeUsers = await user.find({ isActive: true });
        res.status(200).send(activeUsers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, isActive } = req.body;
        const updatedUser = await user.findByIdAndUpdate(id, { name, email, age, isActive }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.put('/users/:id/deactivate', async (req, res) => {
    try {
        const { id } = req.params;
        const deactivatedUser = await user.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!deactivatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(deactivatedUser);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await user.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
