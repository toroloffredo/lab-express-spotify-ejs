require('dotenv').config()

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (request,response) => {
    response.render('index')
    
});

app.get('/artist-search', async (request, response) => {
    
   try{
    const searchResult = await spotifyApi.searchArtists(request.query.artist);
    const results = searchResult.body.artists.items;

    console.log("searchResult:",searchResult);
    console.log("results:", results);
    
    response.render('artist-search-results', { results });
    
   }catch (error) {
    console.log("Error searching artists", error);
   }
});




app.listen(3000, () => console.log('My Spotify project running on port 3000'))
 