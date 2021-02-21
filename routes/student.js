const express = require('express');
const router = express.Router();

module.exports = function(client){

    async function findOneStudentByName(client, studentName){
        const result = await client.db("Student_Stats").collection("Students").findOne({name:studentName});
        if(result){
            console.log(`Here's the students information '${studentName}'`);
            console.log(result);
        } else {
            console.log(`No students found with the name '${studentName}'`);
        }
        return result;
    }

    async function findOneGradeByStudent(client, studentName){
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
    //Get information about one student
    router.get('/:name', async (req,res) => {
        const result = await findOneStudentByName(client, req.params.name);
        res.send(result);
    });
    //Get the overall grade for one student 
    router.get('/:name/grades', async (req,res) => {
        const result = await findOneGradeByStudent(client, req.params.name);

        res.send(result);
    });
    //display the graphs or stats of a student
    router.get('/:name/stats', async (req,res) => {
        const result = await findOneStatByStudent(client, req.params.name);
        res.send(result);
    });
    return router;
}

