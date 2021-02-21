const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

module.exports = function(client) {
  // References to database and collections
  const database = client.db("Student_Stats");
  const Classes = database.collection("Classes");

  async function getClassByCode(code) {
    const result = await Classes.findOne({code});
    return result;
  }

  router.get('/:code', async (req, res) => {
    const result = await getClassByCode(req.params.code);
    res.send(result);
  });

  return router;
}