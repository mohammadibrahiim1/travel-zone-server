require('colors')
exports.VerifyAdmin = (req,res,next)=>{
const admin = [
                "RNb4a4EXZDZNYOv0K04jiES0PZv1",
                "1NUrXQg1TzRNp5AJ5175fMTF2qY2",
              ]  
const id = req.query.uid 
if(admin.includes(id)===true) { return next() }
else { res.code(403).send(' unauthorized ') } 
 
}

