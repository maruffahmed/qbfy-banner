import { Session } from "@shopify/shopify-api/dist/auth/session";
import Shop from '../models/customSessionStorage_model';

let domain_id;

const storeCallBack = async (session) => {
    let data = session;
    data.onlineAccessInfo = data.onlineAccessInfo && JSON.stringify(data.onlineAccessInfo); // Make onlineAccessInfo to string
    // Check and create domain id
    if(data.id.indexOf(`${data.shop}`) > -1){
        domain_id = data.id;
    }
    // Create a new instance of the shop by Mongo model
    const shop = new Shop({
        shop : data.shop,
        session_id : data.id,
        domain_id,
        accessToken : data.accessToken,
        state : data.state,
        isOnline: data.isOnline,
        onlineAccessInfo : data.onlineAccessInfo,
        scope : data.scope

    })
    try {
        let existShop = await Shop.findOne({shop : session.shop});
        console.log("Find this from StoreCallBack ", existShop);
        if(existShop){
            await Shop.findByIdAndUpdate(existShop.id,{
                session_id : data.id,
                domain_id,
                accessToken : data.accessToken,
                state : data.state,
                isOnline: data.isOnline,
                onlineAccessInfo : data.onlineAccessInfo,
                scope : data.scope
            })
            return true;
        }else{
            // Save the shop info to database
            await shop.save();
            return true;
        }
        
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

const loadCallBack = async (id) =>{
    console.log("LoadCallBack ", id );
    try {
        let session = new Session(id);
        let result = await Shop.findOne( {$or : [{session_id : id}, {domain_id : id}]});
        console.log("Load call back result", result);
        session.shop = result.shop;
        session.state = result.state;
        session.scope = result.scope;
        session.isOnline = result.isOnline;
        session.onlineAccessInfo = result.onlineAccessInfo;
        session.accessToken = result.accessToken;

        let date = new Date();
        date.setDate(date.getDate() + 1);
        session.expires = date;

        if(session.expires && typeof session.expires == 'string'){
            session.expires = new Date(session.expires);
        }
        return session;
    } catch (error) {
        console.log("loadCallBack Error : ", error.message);
        return undefined;
    }
}

const deleteCallBack = async (id) => {
    try {
        return false;
    } catch (error) {
        throw new Error(error);
    }
};

export {storeCallBack, loadCallBack, deleteCallBack};