class Errorhandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
        Error.captureStackTrace(this,this.constructure)
    }
}
module.exports=Errorhandler
