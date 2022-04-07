
module.exports = {
    components:{
        schemas:{
            User:{
                type:'object',
                properties:{
                    id:{
                        type:'string',
                        description:"Todo identification number",
                        example:"1"
                    },
                    first_name:{
                        type:'string',
                        description:"User's First Name",
                        example:"John"
                    },
                }
            }
        }
    }
}