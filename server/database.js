import { Session } from "@shopify/shopify-api/dist/auth/session";
import mysql from 'mysql';

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'qbyt_banner'
})
connection.connect(() => {
    console.log("Connected");
});

let domain_id;
const storeCallBack = async (session) => {
    console.log(session);
    try {
        let data = session;
        data.onlineAccessInfo = JSON.stringify(session.onlineAccessInfo);
        if(data.id.indexOf(`${data.shop}`) > -1){
            domain_id = data.id;
        }
        connection.query(
                `INSERT INTO shops (shop_url,session_id,domain_id,access_token,state,isOnline,onlineAccessInfo,scope) VALUES ('${data.shop}','${data.id}','${domain_id}','${data.accessToken}','${data.state}','${data.isOnline}','${data.onlineAccessInfo}','${data.scope}') ON DUPLICATE KEY UPDATE access_token='${data.accessToken}', state='${data.state}', session_id='${data.id}', domain_id='${domain_id}', scope='${data.scope}', onlineAccessInfo='${data.onlineAccessInfo}'`,
                function(error,results,fields){
                    if(error) throw error;
                    
                }
            )
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

const loadCallBack = async (id) => {
    try {
        let session = new Session(id);
        let query = new Promise((resolve, reject) => {
            connection.query(
                    `SELECT * FROM shops WHERE session_id = '${id}' OR domain_id = '${id}' LIMIT 1`,
                    function(error, results, fields){
                        if(error) throw error;

                        session.shop = results[0].shop_url;
                        session.state = results[0].state;
                        session.scope = results[0].scope;
                        session.isOnline = results[0].isOnline == 'true' ? true : false;
                        session.onlineAccessInfo = results[0].onlineAccessInfo;
                        session.accessToken = results[0].access_token;

                        let date = new Date();
                        date.setDate(date.getDate() + 1);
                        session.expires = date;

                        if(session.expires && typeof session.expires == 'string'){
                            session.expires = new Date(session.expires);
                        }

                        resolve();
                    }
                )
                
            })
        await query;
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteCallBack = async (id) => {
    try {
        return false;
    } catch (error) {
        throw new Error(error);
    }
};

export {storeCallBack, loadCallBack, deleteCallBack};