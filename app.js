require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));


// setting the spotify-api goes here:

const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// spotifyApi
//   .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//   .then((data) => {
//     console.log("The received data from the API: ", data.body);
//     // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch((err) =>
//     console.log("The error while searching artists occurred: ", err)
//   );

//Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
  });

// Add this route after the existing code
app.get('/artist-search', (req, res) => {
    const queryArtist = req.query.artist; 
  
    spotifyApi
      .searchArtists(queryArtist)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('artist-search-results', { artists: data.body.artists.items });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });
  
  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
  
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        res.render('albums', { albums: data.body.items });
      })
      .catch(err => console.log('Error fetching artist albums: ', err));
  });
  
  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        res.render('tracks', { tracks: data.body.items });
      })
      .catch(err => console.log('Error fetching album tracks: ', err));
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
