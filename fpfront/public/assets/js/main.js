import RecycleClassifier from "./model.js"; 
import {getStatus} from "./account.js";
import {postImage} from "./user.js";
import {getFilteredResults, getDatabase} from "./search.js";
$(document).ready(async () => {

    
    let isMobile = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        isMobile = true;
    
    } 
    console.log(isMobile);

    if (isMobile) {
        $('#image-upload').append(renderMobileImageUpload());
    } else {
        $('#image-upload').append(renderFileUpload());
    }

    let user = await getStatus();
    console.log()
    $("#user-welcome").html('Welcome '+user.user.data.first+'!');

   

    

    

    //TODO: add separate script to handle animations just for index.html
    let classifier = new RecycleClassifier();
   
    $("#isrecyclable").on('click', function(event) {
        let result = classifier.isRecyclable($('#searchbar').val());
        let text = result[0];
        let num = result[1];
            if (text != '') {
                let result = classifier.isRecyclable($('#searchbar').val());
                let str = (result) ? "Recyclable" : "Non-recyclable";
                $('#ranked-labels').replaceWith(`<ol type="1" id="ranked-labels"></ol>`);
                $("#modal").toggleClass("is-active");
                
                $('#num-items').html("Cycle users have collectively recycled "+num+" items!");
            }
    });

    
    //render file upload

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {

    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

    });

    $(".delete").on('click', function(event) {
        $("#modal").toggleClass("is-active");
    });

    $("#searchbar").on('keyup', async function(e) {

            debounce(searchDatabase, 200);
            
           // if (text != '') {
                //let promise = classifier.isRecyclable(text);
               // promise.then(function(result) {
                    //let num = result[1];
                    
                  //  let res = getFilteredResults(text);

                    /*if (result[0]) {
                        $('#r-label').html("Recyclable");
                        $('#r-label').addClass('has-text-success');
                        $('#r-label').removeClass('has-text-danger');
    
                    } else {
                        $('#r-label').html("Non-recyclable");
                        $('#r-label').removeClass('has-text-success');
                        $('#r-label').addClass('has-text-danger');
                    }*/
                    //$('#modal').toggleClass('is-active');
    
                    //$('#num-items').html("Cycle users have collectively recycled "+num+" items!");
               // });
                
            
           // }
            
        
    });

    $('input[type="file"]').change(function(e){
        let file = e.target.files[0];
        let fileName = e.target.files[0].name;
        $('#uploaded-filename').html(fileName);
        this.val = '';
    });
    
    $('#upload-button').on('click', function(e) {
        var files = $('#imagefileupload').prop("files")
        if(files.length == 1) {
            $('#upload-button').toggleClass('is-loading');
            let promise = classifier.uploadImage(files[0]);
            promise.then(function(result) {
                //successful classification
                if (result.recyclable) {
                    $('#r-label').html("Recyclable");
                    $('#r-label').toggleClass('has-text-success');

                } else {
                    $('#r-label').html("Non-recyclable");
                    $('#r-label').toggleClass('has-text-success');
                }
                

                
                
                $('#ranked-labels').replaceWith(`<ol type="1" id="ranked-labels"></ol>`);
                console.log(result.labels);
                renderModalCard(result.labels);
                $('#modal').toggleClass('is-active');
                $('#upload-button').toggleClass('is-loading');


                //upload to database
                postImage(files[0], result.labels);

                //$('#num-items').html('Cycle users have collectively recycled '+result.main_number+' items!');
            });
            
            

        }
    });


});
let timeout;
function debounce(fn, timeDelay) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fn();
    }, timeDelay);

}

async function searchDatabase() {
    let text = $('#searchbar').val();
    $('#search-results').empty();
    if (text != '') {
        let res = await getFilteredResults(text);
    
        
        let num = Math.min(res.length, 10);
        for(let i = 0; i<num; i++) {
            console.log(res[i]);
            $('#search-results').append('<li>'+res[i]+'</li>');
        }
    } 
    
}

function handleKeyPress(e) {
    let classifier = e.data;
    if(e.which == 13) {
        alert(classifier.isRecyclable($('#searchbar').val()));
    }
}
function handleSearchPress(e) {
    let classifier = e.data;
    
}


function renderMobileImageUpload() {


    let html = `<div class="image-container"><div class="file has-name is-boxed is-centered">
                    <label class="file-label">
                    <input id="imagefileupload" class="file-input" type="file" accept="image/*" capture="environment" name="image">
                    <span class="file-cta">
                        <span class="file-icon">
                        <i class="fa fa-camera"></i>
                        </span>
                        <span class="file-label">
                        Open Camera...
                        </span>
                    </span>
                    
                    </label>
                   
                </div class="upload-container">
                    </br>
                    <button id= "upload-button" class="button is-large is-fullwidth is-info" >Upload</button>
                </div>`
    /*let html = `<div>
                   
                        <input type="file" accept="image/*" capture="environment"/>
                        
                    
                    <button id= "upload-button" class="button is-info" >Upload</button>
                </div>`;*/
    return html;
}
function renderFileUpload() {
   /* let html = `<div>
                    <input id="imagefileupload" type="file" accept="image/*" capture="environment"/>
                    <button id= "upload-button" class="button is-info" >Upload</button>
                </div>`
    return html;*/
    let html =`<div><div class="file is-large has-name is-boxed is-centered">
                    <label class="file-label">
                    <input id="imagefileupload" class="file-input" type="file" accept="image/*" capture="environment" name="image">
                    <span class="file-cta">
                        <span class="file-icon">
                        <i class="fa fa-upload"></i>
                        </span>
                        <span class="file-label">
                        Choose a file…
                        </span>
                    </span>
                    <span id="uploaded-filename" class="file-name has-text-centered">
                        
                    </span>
                    </label>
                   
                </div>
                    </br>
                    <button id= "upload-button" class="button is-large is-info" >Upload</button>
                </div>`;
    return html;
}

function renderModalCard(data) {

    for(let i = 0; i<data.length; i++) {
        $('#ranked-labels').append(`<li>${data[i]}</li>`);
    }
    
}

