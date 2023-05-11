const express = require('express')
const app = express()

const indexRoute = require('./routes/index')
const loginRoute = require('./routes/login')
const registerRoute = require('./routes/register')
const projectsRoute = require('./routes/projects')

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
    const usersCollection = db.collection('users')

    app.set('view engine', 'ejs')
    app.use(express.json());

    //IndexRoute
    app.use("/", indexRoute)

    app.use(express.static('public'))

    app.use(bodyParser.urlencoded({ extended: true }))

    //RegisterRoutes
    app.all("/register", registerRoute);

    app.post("/register", (req, res) => {
      usersCollection
      .insertOne(req.body)
      .then(data => {
        res.redirect('/projects/' + data._id.toString())
      })
    })

    //LoginRoutes
    app.all("/login", loginRoute);

    app.all("/login", (req, res, next) => {
        usersCollection
        .findOne({ email : req.body.email, password : req.body.password } )
        .then(data => {
            res.redirect('/projects/' + data._id.toString())
        })
    })

    //LogoutRoutes

    app.all("/logout", (req, res) => {
      res.redirect('/')
    })

    //ProjectsRoutes
    app.get('/projects/:id', (req, res) => {
      var spath = req.path.split('/')
      var id = spath[2]
      usersCollection
      .find()
      .toArray()
      .then(users => {
      projectsCollection
      .find({userID : id})
      .toArray()
      .then(results => {
        res.render('projects.ejs', { projects: results, userID : id, allUsers: users })
      })
    .catch(error => console.error(error))
    })
  })

    app.all('/projects/:id/edit/:id', (req, res) => {
      var spath = req.path.split('/')
      var id = spath[2]
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(data => {
        res.render('edit-project.ejs', { project: data, userID: id })
      })
    })

    app.get('/projects/:id/details/:id', (req, res) => {
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((data) => {
          res.render('project-details.ejs', { project: data })
      })
    })

    app.post('/projects/:id/add', (req, res) => {
        var spath = req.path.split('/')
        var id = spath[2]
        projectsCollection
        .insertOne(req.body)
        .then(() => {
            res.redirect('/projects/' + id)
        })
        .catch(error => console.error(error))
    })

    app.post('/projects/:id/edit/:id/update', (req, res) => {
      var spath = req.path.split('/')
        var id = spath[2]
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
          res.redirect('/projects/' + id)
        })
    })

    app.get('/projects/:id/delete/:id', (req, res) => {
      var spath = req.path.split('/')
        var id = spath[2]
      projectsCollection
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(() => {
        res.redirect('/projects/' + id)
      })
    })

    app.all('/projects/:id/edit/:id/update_jobs', (req, res) => {
      var spath = req.path.split('/')
        var id = spath[2]
      projectsCollection
      .updateOne(
        { _id: new ObjectId(req.params.id) }, 
        { $set: 
          { 
            jobs: req.body.jobs,
          }
        })
        .then(() => {
          res.redirect('/projects/' + id)
        })
    })

    app.all('/projects/:id/edit_jobs/:id', (req, res) => {
      var spath = req.path.split('/')
      var id = spath[2]
      projectsCollection
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(data => {
        res.render('edit-job-project.ejs', { project: data, userID : id })
      })
    })

    app.listen(3000, () => {
        console.log('Listening on port ' + 3000)
    })
  })
  .catch(error => console.error(error))
