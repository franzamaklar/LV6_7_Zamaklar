const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/", (req, res) => {
    res.render('index.ejs')
})

module.exports = router