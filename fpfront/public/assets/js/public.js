import {getAxiosInstance} from "./Axios.js";
const axios = getAxiosInstance('/public');

export async function incrementCount() {
    let num = await getGlobalCount();
    let res = await axios.post('/total', {
        data:{count: num['count']+1}
    })
}

export async function getGlobalCount() {
    let res = await axios.get('/total');
    return res.data.result;
}