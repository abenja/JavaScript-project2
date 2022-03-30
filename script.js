var jsonObj;

function loadData() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Drake&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json", true)
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("content").innerHTML = xmlhttp.responseText;
            jsonObj = JSON.parse(xmlhttp.responseText);
        }
    }

}