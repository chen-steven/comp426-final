import RecycleClassifier from "./model.js"; 
import {getStatus} from "./account.js";
import {postImage, getPosts, getCount, updatePosts} from "./user.js";
import {incrementCount, getGlobalCount} from "./public.js";
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

   
    
    //if logged in
    if(user) {
        
        
        renderLoggedIn(user);
        
    } else {
        renderLoggedOut();
    }

    let num = await getGlobalCount();
    $('#total-count').html('<strong>'+num['count']+"</strong> items have been classfied by all users!")
    
    $('#total-count-content').html("Cycle has helped reduce carbon dioxide emissions by <strong>"+Math.ceil(0.08399613*num['count'])+'</strong> pounds');

   

    

    

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
    //FDSJKFLS:DFKL:SDJFSDK:FJSKDFJS:DFJ:KSDJFLKJSDFL:KJSDLK:FJKLS:DJFLK:SDJFL:KSDJFLK:SDJFL:KJSDL:FKJLS:DKFJLS:DKFJDLS:KJFLS:DJFKL:SD
    $(".close-modal-button").on('click', function(event) {
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
        uploadImage(classifier);
    });


});

async function itemIsRecyclable(list) {
    let database = await getDatabase();
    console.log(database);
    for(let i = 0; i<list.length; i++) {
        for(let j = 0; j<database.length; j++) {
            if (database[j].toLowerCase().includes(list[i].toLowerCase())) {
                return true;
            }
        }
    }
    return false;
}

async function uploadImage(classifier) {
    var files = $('#imagefileupload').prop("files")
    if(files.length == 1) {
        $('#upload-button').toggleClass('is-loading');
        let promise = classifier.uploadImage(files[0]);
        promise.then(async function(result) {
            //successful classification

            
            

            
            
            $('#ranked-labels').replaceWith(`<ol type="1" id="ranked-labels"></ol>`);
    
            renderModalCard(result.labels);
            $('#modal').toggleClass('is-active');
            $('#upload-button').toggleClass('is-loading');


            //upload to database

            //if logged in

            let user = await getStatus();
            if(user) {
                let recyclable = await itemIsRecyclable(result.labels);
            
                if (recyclable) {
                    $('#r-label').html("Recyclable");
                    $('#r-label').toggleClass('has-text-success');
    
                } else {
                    $('#r-label').html("Non-recyclable");
                    $('#r-label').toggleClass('has-text-success');
                }

                await postImage(files[0], result.labels);

                await renderPosts();
            }  else {
                $('#r-label').html("Sign in to get a classification");
            }
            
            incrementCount();
            
            //$('#num-items').html('Cycle users have collectively recycled '+result.main_number+' items!');
        });
            
            

        }
}

let timeout;
function debounce(fn, timeDelay) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fn();
    }, timeDelay);

}

function renderLoggedIn(user) {
    renderPosts();
    $('#logout-button').on('click', () => {
        window.localStorage.removeItem('token');
        location.reload();
    });
    $('#login-button').remove();
    $('#welcome-message').html("Welcome to Cycle, "+user.user.data.first+'!');

    
    //add event handler for delete button
    $('#timeline-section').on('click', ".delete-post-button", null, deletePost);
    





}

async function deletePost(event) {
    let data = await getPosts();
    console.log(data);
    let id = parseInt($(event.target).closest("div.post").attr("id").substring(4));

    let $postDiv = $(event.target).closest("div.post");
    let newList = deletePostFromJSON(id, data);
    updatePosts(newList);

    $postDiv.hide("slow", function(){ $postDiv.remove(); })


    
}

function renderLoggedOut() {
    $('#logout-button').remove();
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

async function renderPosts() {

    let data = await getPosts();
    console.log('here');
    let timeline = $('#timeline-section');
    timeline.empty();
    for(let i = 0; i<data.length; i++) {
        console.log(data[i]);
        timeline.append(renderCard(data[i]));
    }
}

function deletePostFromJSON(id, list) {
    return list.filter((post) => {
        return post.id != id;
    });
}

function renderCard(post) {
    let html = `
<div id=${"post"+post.id+'"'} class="post column is-4">
    <div class="card is-shady">

         <header class="card-header">
            <p class="card-header-title">
            ${post.labels[0]}
            </p>
            <span class="card-header-icon">
            <a class="delete delete-post-button" aria-hidden="true"></a>
            
            </a>
            </span>
        </header>

       
        
        <div class="card-content">
            <div class="content" >
                <h4>${post.labels[0]}</h4>
                
                    <ul>
                        <li>${post.labels[0]}</li>
                        <li>${post.labels[1]}</li>
                        <li>${post.labels[2]}</li>
                    <ul>
                    
                
            
            </div>
        </div>
    </div>
</div>`
    return html;
}



function renderModalCard(data) {

    for(let i = 0; i<data.length; i++) {
        $('#ranked-labels').append(`<li>${data[i]}</li>`);
    }
    
}

function renderContribute() {
    let html = `
        <section>
    `;
    return html;
}

