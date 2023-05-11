const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/register", (req, res) => {
    res.render('register.ejs')
})

module.exports = router