const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

module.exports = function(client) {
  // References to database and collections
  const database = client.db("Student_Stats");
  const Assignments = database.collection("Assignments");

  async function getAllAssignments() {
    const result = await Assignments.find().toArray();
    if (result) {
      console.log("Fetched all assignments in collection");
      console.log(result);
    } else {
      console.error("Unable to fetch assignments!");
    }
    return result;
  }

  async function getAssignmentById(id) {
    const result = await Assignments.findOne({_id: ObjectID(id)});
    if (result) {
      console.log(result)
    } else {
      console.error(`Unable to fetch assignment with id ${id}`);
    }
    return result;
  }

  // Get all assignments
  router.get('/', async (_req, res) => {
    const result = await getAllAssignments();
    res.send(result);
  });

  router.get('/:id', async (req, res) => {
    const result = await getAssignmentById(req.params.id);
    res.send(result);
  });

  return router;
}