const express = require('express')
const app = express()

const indexRoute = require('./routes/index')

const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fran3mimic:2dax7ralnGmMW9L0@cluster0.evbyhw9.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('projects')
    const projectsCollection = db.collection('projects')

    app.set('view engine', 'ejs')
    app.use(express.json());

    app.use("/", indexRoute)

    app.use(express.static('public'))

    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/projects', (req, res) => {
      projectsCollection
      .find()
      .toArray()
      .then(results => {
        res.render('projects.ejs', { projects: results })
      })
    .catch(error => console.error(error))
    })

    app.get('/projects/edit/:id', (req, res) => {
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(data => {
        res.render('edit-project.ejs', { project: data })
      })
    })

    app.get('/projects/details/:id', (req, res) => {
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((data) => {
          res.render('project-details.ejs', { project: data })
      })
    })

    app.post('/projects', (req, res) => {
        projectsCollection
        .insertOne(req.body)
        .then(() => {
            res.redirect('/projects')
        })
        .catch(error => console.error(error))
    })

    app.post('/projects/edit/:id/update', (req, res) => {
      projectsCollection
      .updateOne(
        { _id: new ObjectId(req.params.id) }, 
        { $set: 
          { 
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            jobs: req.body.jobs,
            start: req.body.start,
            end: req.body.end,
            members : req.body.members,
          }
        })
        .then(() => {
          res.redirect('/projects')
        })
    })

    app.get('/projects/delete/:id', (req, res) => {
      projectsCollection
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(() => {
        res.redirect('/projects')
      })
    })

    app.listen(3000, () => {
        console.log('Listening on port ' + 3000)
    })
  })
  .catch(error => console.error(error))
