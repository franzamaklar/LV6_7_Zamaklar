const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/projects", (req, res) => {
    res.render('projects.ejs', req)
})

module.exports = router