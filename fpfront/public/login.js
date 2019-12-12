import {createAccount} from "./assets/js/account.js";
import {setCount} from "./assets/js/user.js";
import {setToken} from "./assets/js/token.js";

$(function() {
    $('#login-sign-up-box').append(getLoginDiv());
    $("#signup").on("click",signUpButton);
    $("#login-sign-up-box").on('click', '#su-button', null, signUpUser);
    $("#login-sign-up-box").on('click', '#li-button', null, loginUser);

    
});
async function loginUser(event) {
    event.preventDefault();
    let username = $('#li-username').val();
    let password = $('#li-password').val();

    const pubRoot = new axios.create({
        baseURL: "http://localhost:3000/account"
    });
    const res = await pubRoot.post(`/login/`, {'name':username, 'pass':password});
    console.log(res);
    setToken(res.data.jwt);

    window.location.href = "/index.html";
    return res;

}

async function signUpUser(event) {
    event.preventDefault();
    let fname = $('#su-fname').val();
    let lname = $('#su-lname').val();
    let username = $('#su-username').val();
    let password = $('#su-password').val();
    //console.log("test");
   // createAccount(username, password);
    /*const res = await axios({
        method: "POST",
        baseURL: "http://localhost:3000/account/create",
        body: { "name" : username,
                 "pass" : password,
                "data": {}},
        
    });
    return res;*/
    const pubRoot = new axios.create({
        baseURL: "http://localhost:3000/account"
    });

    const userAxios = new axios.create({
        baseURL: "http://localhost:3000/"
    });
    //await userAxios.post('/user/users', {"name":username});
    let res =  await pubRoot.post(`/create/`, {'name':username, 'pass':password, data:{'first':fname, 'last':lname}});
    location.reload();
    return res;
    


}

function signUpButton() {
    $("#login-sign-up-box").empty();
    $("#login-sign-up-box").append(getSignUpDiv());
    
}

function getLoginDiv() {
    let html = `<div class="box">                     
                <form>
                     <div class="field">
                        <div class="control">
                          <input id = "li-username" class="input is-large" placeholder="Username" autofocus="">
                        </div>
                     </div>

                     <div class="field">
                         <div class="control">
                             <input id="li-password" class="input is-large" type="password" placeholder="Your Password">
                         </div>
                    </div>
                    
                        <a id="li-button" class="button is-info is-large" href="/index.html">
                            Log in
                        </a>
                        
                </form>
            </div>`;
          //  <button id="li-button" class="button is-block is-info is-large is-fullwidth">Login <i class="fa fa-sign-in" aria-hidden="true"></i></button>
    return html;
}

function getSignUpDiv() {
    let html;
    html = `<div class="box">                     
                <form>
                    <div class="field">
                        <div class="control">
                            <input id="su-fname" class="input is-large" placeholder="First Name" autofocus="">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <input id="su-lname" class="input is-large" placeholder="Last Name">
                        </div>
                    </div>


                    <div class="field">
                        <div class="control">
                        <input id="su-username" class="input is-large" placeholder="Username">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <input id="su-password" class="input is-large" type="password" placeholder="Your Password">
                        </div>
                    </div>
                        <button id="su-button" class="button is-block is-info is-large is-fullwidth">Sign-up <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                </form>
            </div>`;    
    return html;
}