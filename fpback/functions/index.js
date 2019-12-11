const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const myParser = require("body-parser");
const qs = require("querystring");
var admin = require('firebase-admin');
var numberRecycled = 0;
var serviceAccount = require("./database_admin.json");




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cycle-final-project.firebaseio.com"
});

//app.use(myParser.urlencoded({extended : true}));
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.


exports.textBasedSearch = functions.https.onRequest(async (req, res) => {

    cors(req, res, async () => {
        /*
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    */
    let searching = req.query.text;
    console.log(searching);

    
    let ref = admin
        .database()
        .ref('recyclables/');
    console.log("main")
    let main_query_list =  await ref.orderByChild('name').once("value");
    let recycleMap = main_query_list.val();
    console.log(recycleMap)
    
    let main_is_recyclable = false;

    if((typeof recycleMap[searching]) !== 'undefined'){
        console.log(recycleMap[searching]['recyclable']);
    if(recycleMap[searching]['recyclable']){
        main_is_recyclable = true;
        numberRecycled++;
    }
}
    //console.log(main_number);
    
    res.json({
        test: "main"
        /*
        labels : [searching],
        recyclable: main_is_recyclable,
        main_number : numberRecycled
        */
    });
});
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    
    cors(req, res, async () => {
        res.set({'Access-Control-Allow-Origin':"*"})
        let testing = req.body;
        let fileName = testing.main_image.split(',')[1];
        /*
        let ref = admin
        .database()
        .ref('recyclables/');
        //console.log(testing);
        //console.log(fileName);        
*/
        
         console.log("loc 1");
         let main_response = await getVisionLabels(fileName);
         console.log(main_response);
         let database = {
            "Bottle": {
               name: "Bottle",
               recyclable : true
            },
            "Book": {
               name: "Book",
               recyclable : true
            },
            "Paper bag": {
                name: "Paper bag",
                recyclable: true
            },
            "Box": {
               name: "Box",
               recyclable : true
            },
            "Glass": {
                name: "Glass",
                recyclable: true
            },
            "Cardboard": {
               name: "Cardboard",
               recyclable : true
            },
            "Plastic": {
                name: "Plastic",
                recyclable: true
            },
            "Can": {
               name: "Can",
               recyclable : true
            },
            "Carton": {
                name: "Carton",
                recyclable: true
            },
           "Aluminum": {
               name: "Aluminum",
               recyclable: true
           },
           "Metal": {
               name: "Metal",
               recyclable : true
            },
            "Cup": {
                name: "Cup",
                recyclable: true
            },
            "Steel": {
               name: "Steel",
               recyclable : true
            },
            "Paper": {
                name: "Paper",
                recyclable: true
            },
           "Plate": {
               name: "plate",
               recyclable: true
           },
           "Bowl": {
               name: "Bowl",
               recyclable : true
            },
            "Compost": {
                name: "Compost",
                recyclable: true
            },
            "Tin": {
               name: "Tin",
               recyclable : true
            },
            "Lead": {
                name: "Lead",
                recyclable: true
            },
           "Foam": {
               name: "Foam",
               recyclable: true
           }
         }
         let isRecyclable = false;
         let itemList = []
         let labeledData = main_response[0].labelAnnotations;
         for(let i = 0; i < labeledData.length; i++){
            let main_current = labeledData[i].description
            itemList.push(main_current)
            if((typeof database[main_current]) !== 'undefined'){
                console.log(database[main_current]['recyclable']);
            if(database[main_current]['recyclable']){
                isRecyclable = true;
                numberRecycled++;
            }
        }
         }
         /*
         let main_query_list =  await ref.orderByChild('name').once("value");
         let recycleMap = main_query_list.val();
         console.log(recycleMap);

         let isRecyclable = false;
         let itemList = []
         for(let i = 0; i<labeledData.length; i++) {
            let main_current = labeledData[i].description;
            console.log(main_current);
            itemList.push(main_current);

            console.log(typeof recycleMap[main_current]);
            if((typeof recycleMap[main_current]) !== 'undefined'){
                console.log(recycleMap[main_current]['recyclable']);
            if(recycleMap[main_current]['recyclable']){
                isRecyclable = true;
                numberRecycled++;
            }
            }
            
         }
         console.log("loc 3");
         */

        //console.log(ref);
        //console.log(recycleMap);
        /*
        ref
           .orderByChild('name')
           .equalTo('plastic_bag')
           .on("child");
           //.toJSON();
        */
            //console.log(main_query_list);
            res.json({
                labels: itemList,
                recyclable: isRecyclable,
                main_number: numberRecycled
            });
        
    });
});
async function getVisionLabels(fileName) {
    
    console.log("loc 2");
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient({
        keyFilename: './APIKey.json'
    });
    const request = {
        image: {content: fileName},
        features: [{
            "type":"LABEL_DETECTION",
            "maxResults":10
          }],
    };
    console.log("reached here");
    let response = await client.annotateImage(request);
    return response;
}
