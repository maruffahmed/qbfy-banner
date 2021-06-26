import mongoose,{Schema} from 'mongoose';

const shopSchema = new Schema({
    shop : {type : String},
    session_id: {type : String},
    domain_id : {type : String},
    accessToken : {type : String},
    state : {type : String},
    isOnline : {type : Boolean},
    onlineAccessInfo : {type : String},
    scope : {type : String}
},{
    timestamps : true
})

const Shop = mongoose.model("Shop",shopSchema);

export default Shop;
