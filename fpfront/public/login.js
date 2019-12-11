import {createAccount} from "./assets/js/account.js";

$(function() {
    alert('test');
    $('#login-sign-up-box').append(getLoginDiv());
    $("#signup").on("click",signUpButton);
    

});

function signUpUser() {
    let fname = $('#su-fname').text();
    let lname = $('#su-lname').text();
    let username = $('#su-username').text();
    let password = $('#su-password').text();
    createAccount(fname, lname, username, password);

}

function signUpButton(){
    alert('asdf')
    $("#login-sign-up-box").replaceWith(getSignUpDiv());
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
                    <div class="field">
                      <label class="checkbox">
                         <input type="checkbox">
                              Remember me
                      </label>
                    </div>
                        <button class="button is-block is-info is-large is-fullwidth">Login <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                </form>
            </div>`;
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
                        <input id="su-username" class="input is-large" type="email" placeholder="Username">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <input id="su-password" class="input is-large" type="password" placeholder="Your Password">
                        </div>
                    </div>
                    
                        <button class="button is-block is-info is-large is-fullwidth">Sign-up <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                </form>
            </div>`;    
    return html;
}