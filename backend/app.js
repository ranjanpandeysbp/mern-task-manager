const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 4000

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myapp')

mongoose.connection.on('connected', function () {
    console.log("db connected")
})

mongoose.connection.on('error', function () {
    console.log("db connection error")
})

app.use(express.json())
app.use(cors())

require('./model/taskModel')
const TaskModel = mongoose.model("TaskModel")

app.get('/hello/:name', function (req, res) {
    res.send(req.params.name)
})
app.get('/tasks', function (req, res) {
    TaskModel.find()
        .then(function (alltasks) {
            res.json({ alltasks: alltasks })
        })
        .catch(function (err) {
            console.log(err)
        })
})
app.post('/tasks', function (req, res) {

    if (!req.body.title) {
        return res.status(400).json({ error: "Title cannot be empty" })
    }
    const taskModel = new TaskModel({
        title: req.body.title
    })
    taskModel.save()
        .then(function (savedTask) {
            res.status(201).json({ task: savedTask })
        })
        .catch(function (err) {
            console.log(err)
        })

})

app.delete('/tasks/:taskId', function (req, res) {

    TaskModel.findOne({ _id: req.params.taskId })
        .exec(function (err, task) {
            if (err || !task) {
                return res.status(400).json({ error: error });
            }
            task.remove()
                .then((data) => {
                    res.json({ result: data });
                }
                )
                .catch((e) => {
                    console.log(e);
                })
        })
})

app.listen(PORT, function () {
    console.log("Server started on port " + PORT)
})