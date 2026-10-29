const mongoose = require("mongoose");


const attributeSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },


    inputType:{
        type:String,
        required:true,
        enum:[
            "text",
            "dropdown",
            "multi-select"
        ]
    },


    values:[
        {
            type:String
        }
    ],


    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }
    ],


    status:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
}
);


module.exports = mongoose.model(
    "Attribute",
    attributeSchema
);