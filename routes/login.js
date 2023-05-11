const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/login", (req, res) => {
    res.render('login.ejs')
})

module.exports = router