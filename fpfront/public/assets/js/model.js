export default class RecycleClassifer {
    constructor() {
        this.url = "https://us-central1-cycle-final-project.cloudfunctions.net/addMessage";
    
    }
    async isRecyclable(label) {
        let result = await axios({
            url: 'https://us-central1-cycle-final-project.cloudfunctions.net/textBasedSearch',
            method: 'GET',
            params: {
                text: label  
            },
            withCredentials: false
            
        });
        
        console.log(result);
        return [result.data.recyclable, result.data.main_number];

    }
    
    async uploadImage(imageFile) {
        let base64str = await toBase64(imageFile);
        console.log(base64str);
        console.log("Uploading image...");
        let result = await axios({
            url: this.url,
            method: 'POST',
            data: {
                main_image: base64str
            }
           
        });
        console.log(result);
        return result.data;
        
    }

   
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

