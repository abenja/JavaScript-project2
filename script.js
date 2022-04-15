// Defining global variables
var jsonObj;
var jsonAlbumObj;
var artist;
var url;

// Adds an eventListener to the search box and adds makes the search button clicked
document.getElementById("inputField").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        if (document.getElementById("inputField").value == "") {
            //If the input field is empty, the background color changes to red. The user is also alerted with an instructional message
            document.getElementById('inputField').style.backgroundColor = "#f06e66";
            alert("You need to write something!");
            // If the field is NOT empty, the search button is "clicked"
        } else {
            document.getElementById("searchButton").click();
        }
    }
}, false);

//Adds an eventListener to the search button
document.getElementById('searchButton').addEventListener("click", loadFromSearch);

// Adds an eventListener to the dropdown menu
document.getElementById("artistList").addEventListener('change', loadFromList);

// Function that retrieves data from last.fm from the dropdown menu, or "artistList"
function loadFromList() {
    // Artist variable gets its value from the dropdown menu
    artist = document.getElementById("artistList").value;
    //Defines the url, where the artist's name is added to the url
    url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
    // we create and send an XMLHttpRequest with the url we created above
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        // if conditions are met, the html-element "artistContent" is given the xmlhttp.responseText as its value. JSON is used to parse the text neatly.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("artistContent").innerHTML = xmlhttp.responseText;
            //The jsonObj variable is given the responseText as value
            jsonObj = JSON.parse(xmlhttp.responseText);
            //Calls the printArtistData()-function, with the variable "jsonObj" as its parameter
            printArtistData(jsonObj);
            // the loadAlbums() -function is used to load album data
            loadAlbums();
            //empties the search bar and clears the styling from the possible error message
            document.getElementById('inputField').style.backgroundColor = "#ffffff";
            document.getElementById('inputField').value = "";
            document.getElementById('notFoundMessage').innerHTML = "";
            document.getElementById('notFoundMessage').style.padding = 'initial';
        }
    }

}
// Function that retrieves data from last.fm from the search bar, or "inputField"
function loadFromSearch() {
    // Artist variable gets its value from the dropdown menu
    artist = document.getElementById("inputField").value;
    // Checks whether the input field is empty and alerts the user accordingly
    if (artist == "") {
        document.getElementById('inputField').style.backgroundColor = "#f06e66";
        alert("You need to write something!");
    } else {
        // Works similarly to the loadFromList()-function
        url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=32d0ed841fc10576e713bdf8c08166aa&format=json";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // Checks whether the responseText is the error message given when a query is not found and informs the user accordingly
                // This is done to check if the searched name exists in the last.fm database
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
                    //empties the search bar and clears the styling from the possible error message
                    document.getElementById('inputField').style.backgroundColor = "#ffffff";
                    document.getElementById('inputField').value = "";
                    document.getElementById('notFoundMessage').innerHTML = "";
                    document.getElementById('notFoundMessage').style.padding = 'initial';
                    document.getElementById("artistList").value = "initial";
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
    // Creates a table for the header, ie the artist's name. This additional table is needed to get the header styling aligned properly
    var infoTableHeader = '<table id="infoTableHeader"><thead><tr><th>' + 'Artist: ' + data.artist.name + '</th></tr></thead></table>';
    //Creates a new table for the actual data
    var out = "<table id='infoTable'>";
    out += '<tr>';
    out += '<td id="bio">' + 'Bio: ' + data.artist.bio.summary + '</td>';
    out += '<td id="pictureLink"> <a href=' + picUrl + ' target="_blank" rel="noopener noreferrer" >Click here for artist pictures</a>';
    out += '</tr>';
    out += "</table>";
    //The innerHTML of the html elements are set
    document.getElementById('infoTableHead').innerHTML = infoTableHeader;
    document.getElementById('artistContent').innerHTML = out;
    //the data is also made visible into the console
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
            // Calls for the printAlbumData(), with jsonAlbumObj as its parameter
            printAlbumData(jsonAlbumObj);
        }
    }
}

//Similar to the printArtistData, only this time we print the album data
function printAlbumData() {
    var albumData = jsonAlbumObj;
    var albumTableHeader = '<table id="albumTableHeader"><thead><tr><th>' + 'Top albums: ' + '</th></tr></thead></table>';
    var albumOut = "<table id='albumTable'>";

    // a for-loop that goes through the album-array and adds to the element with each iteration
    for (var i = 0; i < albumData.topalbums.album.length; i++) {
        var albumPic = albumData.topalbums.album[i].image[3]['#text'];
        albumOut += '<tr><td id="albumName">' + albumData.topalbums.album[i].name + '<br>' + '<a id="albumLink" href="' +
            albumData.topalbums.album[i].url + '" target="_blank" rel="noopener noreferrer" >Click here for album songs' + '</td>';
        albumOut += '<td>' + '<img src="' + albumPic + '"' + '</td></tr>';
    }
    albumOut += "</table>";
    //The innerHTML of the html elements are set
    document.getElementById('albumTableHead').innerHTML = albumTableHeader;
    document.getElementById('albumContent').innerHTML = albumOut;
    // We also make album data visible in the console
    console.log(albumData);
}
