// Defining global variables
var jsonObj;
var artist;
var url;

// Adds an eventListener to the search box and adds makes the search button clicked
document.getElementById("inputField").addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
}, false);

//Adds an eventListener to the search button
document.getElementById('searchButton').addEventListener("click", loadFromSearch);


// Adds an eventListener to the dropdown menu
document.getElementById("artistList").addEventListener('change', loadFromList);


// Function that retrieves data from last.fm
function loadFromList() {
    // Artist variable gets its value from the dropdown menu
    artist = document.getElementById("artistList").value;
    url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true)
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("content").innerHTML = xmlhttp.responseText;
            jsonObj = JSON.parse(xmlhttp.responseText);
            printData(jsonObj);
        }
    }
    return false
}

// Function that retrieves data from last.fm
function loadFromSearch() {
    // Artist variable gets its value from the dropdown menu
    artist = document.getElementById("inputField").value;
    url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true)
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("content").innerHTML = xmlhttp.responseText;
            jsonObj = JSON.parse(xmlhttp.responseText);
            printData(jsonObj);
        }
    }
    return false;
}

// Prints the retrieved data into a table
function printData() {
    var data = jsonObj;
    var out = "<table>";
        out += '<tr>';
        out += '<td>' + 'Artist: ' + data.artist.name + '</td>';
        out += '<td>' + 'Bio: ' + data.artist.bio.summary + '</td>';
        out += '<td><img src="'+ data.artist.image[4]['#text'] + '"></td>';
        out += '</tr>';
        out += '<tr>';
        out += '</tr>';
    out += "</table>";
    document.getElementById('content').innerHTML = out;
    console.log(data);
    return false;
}
