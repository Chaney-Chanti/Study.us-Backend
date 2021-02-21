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
    async function findOneStatsByName(client, studentName){
        var list = [];
        const result = await client.db("Student_Stats").collection("Students").findOne({name:studentName});
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
            list = list.slice(0, 3);
            console.log(list);
                // result.assignment.sort();
            // console.log(`${studentName}' lowest grade is assignment: `);
            // console.log(result.assignment[0]);
        } else {
            console.log(`No students found with the name '${studentName}'`);
        }
        return list;
    }

    //------------------------------------------------------------------------------------

    //Get information about one student
    router.get('/:name', async (req,res) => {
        const result = await findOneStudentByName(client, req.params.name);
        res.send(result);
    });
    //Get the overall grade for one student 
    router.get('/:name/grade', async (req,res) => {
        const result = await findOneGradeByName(client, req.params.name);
        res.send(result);
    });
    //display the graphs or stats of a student
    router.get('/:name/stats', async (req,res) => {
        const result = await findOneStatsByName(client, req.params.name);
        res.send(result);
    });
    return router;
}

