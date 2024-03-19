const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
// router.use('/api',(req,res)=>{
//     console.log("secret")
//     res.json('secret')
// })
module.exports = router;
