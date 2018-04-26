var validUserID = null;


$(function () {
    //check if there is cookie
    var idcookie=getCookie("userid");
    if(idcookie) {
        validUserID=idcookie;
        enteraccount();
    }



    var loginRegisterMenu = $("#loginregister").first();
    $('body').delegate('#loginbutton', 'click', function () {
        //popup login/register menu
        if (loginRegisterMenu.css("display") == "none")
            loginRegisterMenu.show(500, "swing");
        else loginRegisterMenu.hide(500, "swing");
    });
    //logout when you press logout button
    $('body').delegate('#logoutbutton', 'click', leaveAccount);
    //show user info page
    $('body').delegate('#username', 'click', showUserInfo);
    //close user info page
    $('body').delegate('#closeUserInfo','click', showUserInfo);

    var loginForm = loginRegisterMenu.children().first();
    var loginToRegisterButton = loginForm.children().first().children().last().children().first();
    var registerForm = loginRegisterMenu.children().last();
    var registerToLoginButton = registerForm.children().first().children().last().children().first();
//show register form and hide login form
    loginToRegisterButton.bind('click', function () {
        loginForm.css("display", "none");
        registerForm.css("display", "block");
    });
//show login form and hide register form
    registerToLoginButton.bind('click', function () {
        registerForm.css("display", "none");
        loginForm.css("display", "block");
    });

    var loginButton = loginForm.children().first().children().eq(2).children().first();
    loginButton.bind('click', pressLogin);


    var registerButton = registerForm.children().first().children().eq(4).children().first();
    registerButton.bind('click', pressRegister);


    function pressLogin() {
        var login = loginForm.children().first().children().eq(0).children().first().val();
        var password = loginForm.children().first().children().eq(1).children().first().val();
        $.post('php/login.php', {login: login, password: password}, function (data) {
            var loginphpdata = JSON.parse(data);
            if (loginphpdata.state == "wronglogin") {
                loginForm.children().first().children().eq(0).children().last().text("Login is wrong!");
                loginForm.children().first().children().eq(1).children().last().text("");
            }
            if (loginphpdata.state == "wrongpassword") {
                loginForm.children().first().children().eq(0).children().last().text("");
                loginForm.children().first().children().eq(1).children().last().text("Password is wrong!");
            }
            if (loginphpdata.state == "successfull") {
                loginForm.children().first().children().eq(0).children().last().text("");
                loginForm.children().first().children().eq(1).children().last().text("");
                validUserID = loginphpdata.userid["$oid"];
                enteraccount();
            }


        })
    }

    function pressRegister() {
        var email = registerForm.children().first().children().eq(0).children().first().val();
        var login = registerForm.children().first().children().eq(1).children().first().val();
        var password = registerForm.children().first().children().eq(2).children().first().val();
        var password2 = registerForm.children().first().children().eq(3).children().first().val();
        if (password != password2) {
            registerForm.children().first().children().eq(3).children().last().text("Passwords are not equal!");
        }
        else {
            registerForm.children().first().children().eq(3).children().last().text("");
        }
        $.post('php/register.php', {email: email, login: login, password: password}, function (data) {
            var registerphpdata = JSON.parse(data);
            if (registerphpdata.state == "usedlogin") {
                registerForm.children().first().children().eq(0).children().last().text("");
                registerForm.children().first().children().eq(1).children().last().text("Login is used!");
            }
            if (registerphpdata.state == "usedemail") {
                registerForm.children().first().children().eq(0).children().last().text("E-mail is used!");
                registerForm.children().first().children().eq(1).children().last().text("");
            }
            if (registerphpdata.state == "registered") {
                registerForm.children().first().children().eq(0).children().last().text("");
                registerForm.children().first().children().eq(1).children().last().text("");
                validUserID = registerphpdata.userid["$oid"];
                enteraccount();
            }


        })
    }


    function enteraccount() {
        var loginRegisterMenu = $("#loginregister").first();
        loginRegisterMenu.hide(500, "swing");
        $("#loginbutton").first().remove();
        $.post('php/user.php', {size: "cut", userid: validUserID}, function (data) {
            var userdata = JSON.parse(data);
            var authMenu = $('<div id="authmenu"></div>');
            authMenu.append('<div id="username">'+userdata.login +'</div>');
            authMenu.append('<div id="logoutbutton">Logout</div>');

            $("#header").append(authMenu);

            setCookie("userid", validUserID, {expires: 0});
        })
    }

    function leaveAccount() {
        $("#authmenu").first().remove();
        $("#header").append('<div id="loginbutton">Login/Register</div>');
        var main=$('#main').first();
        main.html('bla bla bla');
        validUserID = null;
        setCookie("userid", "", {expires: -1});
    }

    function showUserInfo() {
        var main=$('#main').first();
        if(main.children().length)
        {
            main.html('bla bla bla');
        } else {
            main.html(' ');
            userInfo();
            function userInfo() {
                $.post('php/user.php', {size: "full", userid: validUserID}, function (data) {
                    var userdata = JSON.parse(data);
                    var userInfo = $('<div id="userInfo"></div>');
                    main.html(' ');
                    main.append(userInfo);
                    userInfo.append('<div id="userInfoLogin"><div>'+userdata.login+'</div></div>');

                    var userInfoShow=$('<div id='+'"userInfoShow"'+'></div>');
                    userInfo.append(userInfoShow);
                    if(userdata.hasOwnProperty('male'))
                        userInfoShow.append('<div>Male: '+userdata.male+'</div>');
                    else
                        userInfoShow.append('<div>Male:  </div>');
                    if(userdata.hasOwnProperty('dob'))
                        var dobStr=''+userdata.dob.d+'.'+userdata.dob.m+'.'+userdata.dob.y+'.';
                    else
                        var dobStr='    ';
                    userInfoShow.append('<div>Date of birth: '+dobStr+'</div>');
                    if(userdata.hasOwnProperty('address')) {
                        if(userdata.address.hasOwnProperty('country'))
                            var addressStr='Country: '+userdata.address.country+'   ';
                        else
                            var addressStr='';
                        if(userdata.address.hasOwnProperty('city'))
                            addressStr+='City: '+userdata.address.city;
                        else
                            addressStr+='';
                    } else
                        var addressStr='    ';
                    userInfoShow.append('<div>'+'Address:  '+addressStr+'</div>');
                    userInfoShow.append('<div id="userInfoBtns"><button id="changeUserInfoBtn">Change your info</button><button id="closeUserInfo">Close</button></div>');
                    //show changing user info form
                    $('body').delegate('#changeUserInfoBtn','click', function() {
                        $('#userInfo').first().remove();
                        userInfoChanged();
                    });
                });
            }

            function userInfoChanged() {
                $.post('php/user.php', {size: "full", userid: validUserID}, function (data) {
                    var userdata = JSON.parse(data);
                    var userInfoDiv = $('<div id="userInfo"></div>');
                    main.html(' ');
                    main.append(userInfoDiv);
                    userInfoDiv.append('<div id="userInfoLogin"><div>'+userdata.login+'</div></div>');

                    var userInfoChange=$('<div id="userInfoChange"></div>');
                    var maleStr='<div><label for="male">Male:</label>'+
                        '<select id="male" size="1" name="male"><option disabled>Choose your male...</option>';
                    if(userdata.hasOwnProperty('male')) {
                        if(userdata.male=='m') {
                            maleStr+='<option selected value="m">m</option><option value="w">w</option></option></select></div>';
                        } else {
                            maleStr+='<option value="m">m</option><option selected value="w">w</option></option></select></div>';
                        }
                    } else {
                        maleStr+='<option value="m">m</option><option value="w">w</option></option></select></div>';
                    }
                    userInfoChange.append(maleStr);

                    var dobStr='<div><label for="dob">Date of birth:</label><input';
                    if(userdata.hasOwnProperty('dob')) {
                        dobStr+=' value="'+userdata.dob.y+'-'+userdata.dob.m+'-'+userdata.dob.d+'"';
                    }
                    dobStr+=' type="date" id="dob"/></div>';
                    userInfoChange.append(dobStr);

                    var countryStr='<div><label for="country">Country:</label><input';
                    var cityStr='<div><label for="city">City:</label><input';
                    if(userdata.hasOwnProperty('address')) {
                        if(userdata.address.hasOwnProperty('country'))
                            countryStr+=' value="'+userdata.address.country+'"';
                        if(userdata.address.hasOwnProperty('city'))
                            cityStr+=' value="'+userdata.address.city+'"';
                    }
                    countryStr+=' type="text" id="country" name="country"/></div>';
                    cityStr+=' type="text" id="city" name="city"/></div>';

                    userInfoChange.append(countryStr);
                    userInfoChange.append(cityStr);
                    userInfoChange.append('<div id="userInfoBtns"><button id="saveChangedInfo">Save</button><button id="resetChangedInfo">Reset</button></div>');
                    userInfoDiv.append(userInfoChange);
                    main.append(userInfoDiv);

                    $('body').delegate('#saveChangedInfo', 'click', function() {
                        var male=$('#male').first().val();
                        var dob=$('#dob').val().split("-");
                        var dobObj={
                            d: dob[2],
                            m: dob[1],
                            y: dob[0]
                        };
                        var country=$('#country').val();
                        var city=$('#city').val();
                        if(male&&dob&&country&&city) {
                            $.post('php/saveuser.php', {
                                "userid": validUserID,
                                "male": male,
                                "dob": dobObj,
                                "country": country,
                                "city": city
                            }, function (data) {
                                console.log('User data is saved');
                            });
                            main.html(' ');
                            userInfo();
                        }
                        else alert('Not all data is entered!');
                    });
                    $('body').delegate('#resetChangedInfo', 'click', function() {
                        main.html(' ');
                        userInfo();
                    });
                });
            }





        }
    }
});






function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}