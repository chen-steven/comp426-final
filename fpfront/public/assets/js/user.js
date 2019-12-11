import {getAxiosInstance} from "./Axios.js";
const axios = getAxiosInstance('/user/post');

export async function postImage(file, labels) {
    let res = await axios.post('', {
        data: {file: file, labels: labels},
        type: 'merge'
    });
}


