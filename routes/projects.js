const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/", (req, res) => {
})

module.exports = router