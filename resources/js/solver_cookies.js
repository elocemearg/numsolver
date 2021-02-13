/* Warning: these functions don't sanitise the name or the value to remove
 * equals signs, semicolons etc. Don't use untrusted user input in either the
 * name or the value. */
function setCookie(name, value) {
    /* 10 years ought to be enough for anybody */
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + 86400 * 1000 * 365 * 10);

    //console.log("setting cookie: " + name + " = " + value)
    document.cookie = name + "=" + value + ";expires=" + expiry.toUTCString() + ";path=/";
}

function deleteCookie(name) {
    /* Set a cookie's expiry to a past date to delete it. */
    //console.log("deleting cookie: " + name);
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

function readCookies() {
    let cookies = document.cookie.split(";");
    let cookieDict = {};
    for (let i = 0; i < cookies.length; ++i) {
        let cookieString = cookies[i];
        while (cookieString.charAt(0) == ' ') {
            cookieString = cookieString.substring(1);
        }
        if (cookieString.length > 0) {
            let nameValue = cookieString.split("=");
            if (nameValue.length >= 2) {
                cookieDict[nameValue[0]] = nameValue[1];
            }
            else if (nameValue.length == 1) {
                cookieDict[nameValue[0]] = "";
            }
            //console.log("reading cookie: " + nameValue[0] + " = " + cookieDict[nameValue[0]])
        }
    }
    return cookieDict;
}

function getCookieValue(cookieDict, name, defaultValue) {
    if (name in cookieDict) {
        return cookieDict[name];
    }
    else {
        return defaultValue;
    }
}
