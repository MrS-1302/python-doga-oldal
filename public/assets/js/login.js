function bejelentkezes() {
    name = document.getElementById('name').value
    pass = document.getElementById('pass').value
    document.activeElement.blur()
    
    if (name.length == 0 || pass.length == 0) {
        document.getElementById("hiba2").style.display = "inline-block"
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                valasz = JSON.parse(this.responseText);
                if (valasz.valid == true) {
                    location.href = `/t${valasz.token}/user/`
                } else {
                    document.getElementById("hiba2").style.display = "inline-block"
                }
            }
        };
        xhttp.open("POST", "/api/v1/login/user/" + name + "/" + pass, true);
        xhttp.send();
    }
}