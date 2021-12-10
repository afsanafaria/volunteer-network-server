const express = require('express');
require('dotenv').config()

const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1isfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("volunteerNetwork");
        const eventCollection = database.collection("events");
        const userCollection = database.collection("users");

        //get api
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        })

        //get api by id
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const event = await eventCollection.findOne(query);

            console.log("load event with id:", id)
            res.send(event);
        })

        //post api
        app.post('/events', async (req, res) => {
            const newEvent = req.body;
            const result = await eventCollection.insertOne(newEvent)
            console.log('got new Event', req.body);
            console.log('added a new Event', result);
            res.json(result)
        })
        //get users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //post user
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            console.log('got new user', req.body);
            console.log('added a new user', result);
            res.json(result)
        })
        //get a single user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);

            console.log("load user with id:", id)
            res.send(user);
        })

        //delete user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        // //query search
        // app.get('/users', (req, res) => {
        //     const search = (req.query.search)
        //     if (search) {
        //         const searchResult = users.filter(r => r.name.toLowerCase().includes(search))
        //         res.send(searchResult)
        //     }
        //     else {
        //         res.send(users)
        //     }
        // })
        // app.get('/users', (req, res) => {
        //     const search = (req.query.search)
        //     if (search) {
        //         const searchResult = users.filter(r => r.name.toLowerCase().includes(search))
        //         res.send(searchResult)
        //     }
        //     else {
        //         res.send(users)
        //     }
        // })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my VOLUNTEER server")
})

app.listen(port, () => {
    console.log("Running VOLUNTEER server on the port", port);
})