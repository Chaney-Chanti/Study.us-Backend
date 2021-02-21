const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const {MongoClient} = require('mongodb');
const url = process.env.DB_CONNECTION;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

//Connect to DB
async function main() {
    try {
        await client.connect();
        await listDatabases(client);

        //Import Routes
        const studentRoute = require('./routes/student');
        const assignmentRoute = require('./routes/assignment');
        const classRoute = require('./routes/class');

        app.use('/student', studentRoute(client));
        app.use('/assignment', assignmentRoute(client));
        app.use('/class', classRoute(client));

    } catch (e) {
        console.error(e);
    }
}
//Call main and check for errors
main().catch(console.error);

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

//practice create function
// async function createAssignment(client, newAssignment){
//     const result = await client.db("Student_Stats").collection("Assignments").insertOne(newAssignment);
//     console.log(result);
// }

//How do we start listening to the server
app.listen(process.env.PORT || 3000);
