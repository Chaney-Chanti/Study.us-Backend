const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

module.exports = function (client){
    // References to database and collections
    const database = client.db("Student_Stats");
    const Students = database.collection("Students");

    async function getAllStudents() {
        const result = await Students.find().toArray();
        return result;
    }

    async function findOneStudentByName(client, studentId){
        const result = await Students.findOne({_id: ObjectID(studentId)});
        if (result){
            console.log(`Here's the students information '${studentId}'`);
            console.log(result);
        } else {
            console.log(`No students found with the id '${studentId}'`);
        }
        return result;
    }

    async function findOneGradeByName(client, studentName){
        const result = await client.db("Student_Stats").collection("Students").findOne({name:studentName});
        var grade = 0;
        if(result){
            console.log(`Here's the grade of '${studentName}'`);
            console.log(result);
            for (const assignmentId of result.assignments) {
                const assignment = await client.db("Student_Stats").collection("Assignments").findOne({_id: assignmentId});
                console.log(assignment);
                grade += assignment.grade; 
            }
            result.grade = (grade/3);
        } else {
            console.log(`No students found with the name '${studentName}'`);
        }
        return result;
    }
    async function findOneStatsByName(client, id){
        var list = [];
        const result = await client.db("Student_Stats").collection("Students").findOne({_id:ObjectID(id)});
        if(result){
            console.log(result.assignments);
            for (const assignmentId of result.assignments) {
                const assignment = await client.db("Student_Stats").collection("Assignments").findOne({_id: assignmentId});
                if(assignment.is_test === false){
                    list.push(assignment);
                }
            }
            list.sort((a1, a2) => {
                return a1.grade - a2.grade;
            });
            console.log(list);
        } else {
            console.log(`No students found with the name '${id}'`);
        }
        return list;
    }

    async function getStatsOfStudentForClass(id, classId){
        var list = [];
        const result = await Students.findOne({_id:ObjectID(id)});
        if(result){
            for (const assignmentId of result.assignments) {
                const assignment = await client.db("Student_Stats").collection("Assignments").findOne({_id: assignmentId});
                if (assignment.is_test === false && assignment.class === classId){
                    list.push(assignment);
                    console.log(assignment)
                }
            }
            list.sort((a1, a2) => {
                return a1.grade - a2.grade;
            });
            console.log(list);
        } else {
            console.log(`No students found with the name '${id}'`);
        }
        return list;
    }
    //------------------------------------------------------------------------------------

    router.get('/', async (_req, res) => {
        const result = await getAllStudents();
        res.send(result);
    });
    //Get information about one student
    router.get('/:id', async (req,res) => {
        console.log(req.params.id);
        const result = await findOneStudentByName(client, req.params.id);
        res.send(result);
    });
    //Get the overall grade for one student 
    router.get('/:id/grade', async (req,res) => {
        const result = await findOneGradeByName(client, req.params.id);
        res.send(result);
    });
    //display the graphs or stats of a student
    router.get('/:id/stats', async (req,res) => {
        const result = await findOneStatsByName(client, req.params.id);
        res.send(result);
    });
    // display stats for a specific class
    router.get('/:id/stats/:classId', async (req,res) => {
        const result = await getStatsOfStudentForClass(req.params.id, req.params.classId);
        res.send(result);
    });
    return router;
}

