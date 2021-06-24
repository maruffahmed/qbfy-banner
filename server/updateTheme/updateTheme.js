import Axios from 'axios';
import fs from 'fs';
import path from 'path';
const themeApi = `admin/api/2021-04`;
// Helper function
const getFile = (fileName) => fs.readFileSync(path.resolve(__dirname,fileName),'utf8');

export async function updateTheme (shop, accessToken) {
    const axios = Axios.create({
        baseURL : `https://${shop}/${themeApi}`,
        headers : {
            'Content-Type' : "application/json",
            'X-Shopify-Access-Token' : accessToken
        }
    })
    const mainThemeId = await getThemeId(axios);
    if(!mainThemeId) return;
    console.log("Main theme id: ", mainThemeId);
    const newPage = await getAssetThemeLiquid(mainThemeId, axios);
    if(newPage){
        await updateAssetTheme(mainThemeId, "layout/theme.liquid", newPage, axios);
    }
    const newSnippet = getFile('../../liquid/banner-app.liquid');
    await updateAssetTheme(mainThemeId, "snippets/banner-app.liquid", newSnippet, axios);
}

async function updateAssetTheme(theme_id, pageName, newPage, axios){
    const body = {
        "asset": {
            "key": pageName,
            "value" : newPage 
        }
    }
    console.log("body ",body);
    try {
        const {data} = await axios.put(`/themes/${theme_id}/assets.json`,body);
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

async function getAssetThemeLiquid (theme_id,axios){
    const {data : {asset}} = await axios.get(`/themes/${theme_id}/assets.json?asset[key]=layout/theme.liquid`);
    if(!asset.value) return;
    const snippet = getFile('../../liquid/theme.liquid');
    let newPage = asset.value;
    if(newPage.includes(snippet)){
        console.log("This snippet is already installed");
        return;
    }
    newPage = asset.value.replace(
        "{% section 'header' %}\n",
        `{% section 'header' %}\n${snippet}`
    )
    console.log(newPage);
    return newPage;

}

async function getThemeId (axios) {
    const {data : {themes}} = await axios.get(`/themes.json`);
    const mainTheme = themes.find(theme => theme.role === 'main');
    if(!mainTheme){
        console.log("No main theme");
        return;
    }
    console.log("Main theme: ", mainTheme);
    return mainTheme.id;
}