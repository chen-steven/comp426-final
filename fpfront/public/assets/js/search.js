import {getAxiosInstance} from "./Axios.js";
const axios = getAxiosInstance('/private/Database');

export async function getFilteredResults(str) {
    const res = await axios.get('');
    let list = res.data.result;
    let words = Object.keys(list);
    let temp = words.filter( (word) => {
        return word.toLowerCase().startsWith(str);
    });
    console.log(temp);
    return temp;
}

export async function getDatabase() {
    const res = await axios.get('');
    let list = res.data.result;
    let words = Object.keys(list);
    return words;
}
