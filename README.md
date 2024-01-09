## SpotifyAPI
I created a web app that uses the Spotify API to first authenticate the site using an API Key, connect to an exisiting device, then give the user the ability to adjust playback features. These features include selecting and playing a song, volume adjustment for desktops, skipping songs, and pausing/resuming currently playing songs.

<img width="1200" alt="Screen Shot 2024-01-08 at 14 41 21" src="https://github.com/KabrG/Spotify-Web-API/assets/130770806/ae5defdd-fac8-47da-8dee-390434c6d176">

<img width="1200" alt="Screen Shot 2024-01-08 at 22 19 51" src="https://github.com/KabrG/Spotify-Web-API/assets/130770806/2f2b3f30-c7fc-419c-8e40-287e15e859f9">

### Setup
1. The application only works for users that have a Spotify Premium account. Go to the "Spotify for Developers" dashboard, or follow this link: https://developer.spotify.com/dashboard
2. Select "Create app" and fill-in the necessary fields. Ensure that the Redirect URI is "http://127.0.0.1:5500/HomePage.html". As the program authenticates your profile, Spotify must redirect the user back to the original web page.

<img width="700" alt="Screen Shot 2024-01-08 at 22 40 06" src="https://github.com/KabrG/Spotify-Web-API/assets/130770806/405c8901-bf0e-46be-a2fd-7529b5894d99">

3. After creating your app, enter settings where you can view your Client ID and Client. **Your Client ID and Client Secret are identifiers for your profile and should remain private**. 
4. Obtain the code from the "SpotifyAPI" folder.
5. In the same folder, create a file labelled `sensitive_info.json`. Edit the JSON object accordingly:

<img width="518" alt="Screen Shot 2024-01-08 at 22 57 54" src="https://github.com/KabrG/Spotify-Web-API/assets/130770806/c9c9238a-658d-4c90-a34f-85a2af8b269c">

6. Enjoy your Spotify Web Player!

A quick note: if your device names are not appearing in the drop-down menu, ensure that your devices are active before searching for them. In other words, Spotify should be opened on your phone/laptop/ps4/ps5/Echo etc. 
