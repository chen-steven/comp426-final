import {getAxiosInstance} from "./Axios.js";
const axios = getAxiosInstance('/user');

export async function postImage(file, labels) {
    let promise = getCount();
    let num;
    promise.then(async (result ) => {
        num = result.data.result.count;
           
        let res = await axios.post('/post/', {
            data: {file: file, labels: labels, id:num},
            type: 'merge'
        });
        setCount(num+1);
        
    }).catch(() => {
        setCount(0);
    });
    
    
    
    
}

export async function updatePosts(list) {
    let res = await axios.post('/post', {
        data: list
    })
}

export async function setCount(n) {
    let res = await axios.post('/count/', {
        data:{count: n}
    })
}

export async function getCount() {
    let res = await axios.get('/count');
    return res;
}
export async function getPosts() {
    let res = await axios.get('/post');
    return res.data.result;
}




