// Defining global variables
var jsonObj;
var jsonAlbumObj;
var artist;
var url;


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
            document.getElementById("artistContent").innerHTML = xmlhttp.responseText;
            jsonObj = JSON.parse(xmlhttp.responseText);
            printArtistData(jsonObj);
            loadAlbums();
            //empties the search bar and clears the styling from the possible error message
            document.getElementById('inputField').style.backgroundColor = "#ffffff";
            document.getElementById('inputField').value = "";
            document.getElementById('notFoundMessage').innerHTML = "";
            document.getElementById('notFoundMessage').style.padding = 'initial';
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
        url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // Checks whether the responseText is the error message given when a query is not found and alerts the user accordingly
                if (xmlhttp.responseText == '{"error":6,"message":"The artist you supplied could not be found","links":[]}') {
                    document.getElementById('notFoundMessage').innerHTML = "The artist you searched for is not found!";
                    document.getElementById('inputField').style.backgroundColor = "#f06e66";
                    document.getElementById('notFoundMessage').style.padding = "5px";
                    document.getElementById('notFoundMessage').style.marginTop = "5px";
                } else {
                    document.getElementById("artistContent").innerHTML = xmlhttp.responseText;
                    jsonObj = JSON.parse(xmlhttp.responseText);
                    printArtistData(jsonObj);
                    loadAlbums();
                    document.getElementById('inputField').style.backgroundColor = "#ffffff";
                    //empties the search bar
                    document.getElementById('inputField').value = "";
                    document.getElementById('notFoundMessage').innerHTML = "";
                    document.getElementById('notFoundMessage').style.padding = 'initial';

                }
            }
        }
    }
}



// Prints the retrieved data into a table
function printArtistData() {
    var data = jsonObj;
    // Link to the image page of the artist
    var picUrl = data.artist.url + "/+images";
    var infoTableHeader = '<table id="infoTableHeader"><thead><tr><th>' + 'Artist: ' + data.artist.name + '</th></tr></thead></table>';
    var out = "<table id='infoTable'>";
    out += '<tr>';
    out += '<td id="bio">' + 'Bio: ' + data.artist.bio.summary + '</td>';
    out += '<td id="pictureLink"> <a href=' + picUrl + ' target="_blank" rel="noopener noreferrer" >Click here for artist pictures</a>';
    out += '</tr>';
    out += "</table>";
    document.getElementById('infoTableHead').innerHTML = infoTableHeader;
    document.getElementById('artistContent').innerHTML = out;
    console.log(data);
    return false;
}

//loads album data with artist.getTopAlbums -method
function loadAlbums() {
    url = "https://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=" + artist + "&limit=10&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            jsonAlbumObj = JSON.parse(xmlhttp.responseText);
            printAlbumData(jsonAlbumObj);
        }
    }
}


function printAlbumData() {
    var albumData = jsonAlbumObj;
    var albumTableHeader = '<table id="albumTableHeader"><thead><tr><th>' + 'Top albums: ' + '</th></tr></thead></table>';
    var albumOut = "<table id='albumTable'>";

    // a for-loop that goes through the album-array and adds the element with each iteration
    for (var i = 0; i < albumData.topalbums.album.length; i++) {
        var albumPic = albumData.topalbums.album[i].image[3]['#text'];
        albumOut += '<tr><td id="albumName">' + albumData.topalbums.album[i].name + '<br>' + '<a id="albumLink" href="' +
            albumData.topalbums.album[i].url + '" target="_blank" rel="noopener noreferrer" >Click here for album songs' + '</td>';
        albumOut += '<td>' + '<img src="' + albumPic + '"' + '</td></tr>';

    }
    albumOut += '</tr>';
    albumOut += "</table>";
    document.getElementById('albumTableHead').innerHTML = albumTableHeader;
    document.getElementById('albumContent').innerHTML = albumOut;
    console.log(albumData);

}

