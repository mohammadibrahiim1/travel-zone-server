const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.send("Travel-zone Server is running") })

module.exports = router