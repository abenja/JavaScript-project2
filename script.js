// Defining global variables
var jsonObj;
var artist;
var url;
var albums;
let albumData;


//loads album data with artist.getTopAlbums -method
function loadAlbums() {
    url = "https://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=" + artist + "&limit=10&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            albums = JSON.parse(xmlhttp.responseText);
            console.log(albums);
            albumData = albums.topalbums.album[0].name;
            console.log(albumData);
        }
    }
}


// Adds an eventListener to the search box and adds makes the search button clicked
document.getElementById("inputField").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        if (document.getElementById("inputField").value == "") {
            document.getElementById('inputField').style.backgroundColor = "#f06e66";
            alert("You need to write something!");
        } else {
            document.getElementById("searchButton").click();
        }
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
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("content").innerHTML = xmlhttp.responseText;
            jsonObj = JSON.parse(xmlhttp.responseText);
            printData(jsonObj);
            loadAlbums();
        }
    }

}

// Function that retrieves data from last.fm
function loadFromSearch() {
    // Artist variable gets its value from the dropdown menu
    artist = document.getElementById("inputField").value;
    // Checks whether the input field is empty
    if (artist == "") {
        document.getElementById('inputField').style.backgroundColor = "#f06e66";
        alert("You need to write something!");
    } else {
        url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // Checks whether the responseText is the error message given when a query is not found and alerts the user accordingly
                if (xmlhttp.responseText == '{"error":6,"message":"The artist you supplied could not be found","links":[]}') {
                    alert("The artist you searched for is not found!");
                    document.getElementById('inputField').style.backgroundColor = "#f06e66";


                } else {
                    document.getElementById("content").innerHTML = xmlhttp.responseText;
                    jsonObj = JSON.parse(xmlhttp.responseText);
                    printData(jsonObj);
                    loadAlbums();
                    document.getElementById('inputField').style.backgroundColor = "#ffffff";

                }
            }

        }
    }
}




// Prints the retrieved data into a table
function printData() {
    var data = jsonObj;
    // Link to the image page of the artist
    var picUrl = data.artist.url + "/+images";

    var out = "<table id='infoTable'>";
    out += '<tr>';
    out += '<td>' + 'Artist: ' + data.artist.name + '</td>';
    out += '<td id="bio">' + 'Bio: ' + data.artist.bio.summary + '</td>';
    out += '<td><img src="' + data.artist.image[2]['#text'] + '"></td>';
    out += '<td> <a id="pictureLink" href=' + picUrl + ' target="_blank" rel="noopener noreferrer" >Click here for artist pictures</a>';
    out += '</tr>';
    out += '</tr>';
    out += "</table>";
    document.getElementById('content').innerHTML = out;
    console.log(data);
    return false;
}
