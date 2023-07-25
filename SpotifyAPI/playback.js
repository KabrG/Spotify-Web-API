async function refresher() {
  if (JSON.parse(sessionStorage.getItem("device_selected")) == true) {
    try {
      await currently_playing();
    } catch (error) {
      const response = await api_call('GET', '/me/player/currently-playing', false);
      if (response.status == 401) {
        sessionStorage.setItem("device_selected", false);
      }
    }
  }
}

async function play() {
    currently_playing();
    var playback = '';
    let device_selected = JSON.parse(localStorage.getItem('selected_device'));
    let device_id = device_selected.id;
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');

    if (await is_playing_status()) {
        playback = 'pause';
    }
    else {
        playback = 'play';
    }
    // Try To play
    var result = await fetch('https://api.spotify.com/v1/me/player/' + playback + '?device_id=' + device_id, {
        method: 'PUT',
        headers: {
            'Authorization' : 'Bearer ' + temp_refresh_token,
            'Content-Type' : 'application/json'
        }
    })

}
async function play_new_song () {
    let device_selected = JSON.parse(localStorage.getItem('selected_device'));
    let device_id = device_selected.id;
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');        

    let track_uri = await get_track();

    console.log('here');
        var result = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + temp_refresh_token,
          'Content-Type': 'application/json', 
        } ,
        body: JSON.stringify({
            'uris': [track_uri]
        })
      });
}

async function get_track() {
    let device_selected = JSON.parse(localStorage.getItem('selected_device'));
    let device_id = device_selected.id;
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');        

    let track_query = encodeURIComponent(document.getElementById('track_choice').value);

    const result = await fetch (`https://api.spotify.com/v1/search?q=${track_query}&type=track`, {// COME BACk, SWITCH TO THIS STYLE
        headers: {
            'Authorization': `Bearer ${temp_refresh_token}`
        },
        }); 
    const data = await result.json();
    console.log(data.tracks.items[0].uri);
    let first_track = data.tracks.items[0].uri; 
    return first_track;
}



// Returns if it is unpaused
async function is_playing_status() { 
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');

    // Try To play
    var result = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + temp_refresh_token,
        }
    })
    const data = await result.json();
    // console.log(data.is_playing);
    return data.is_playing;
}


async function currently_playing() {
    await show_album_cover();
    let artists_string = '';
    const data = await api_call('GET', '/me/player/currently-playing', true);
    // console.log(data.item.name);

    // console.log(data.item.artists.length);
    for (let i=0; i < data.item.artists.length; i++) {
        if (data.item.artists.length == 2) {
            artists_string += data.item.artists[0].name + ' and ' + data.item.artists[1].name ;
            i = 2;
        }
        else if (i == data.item.artists.length -1 && data.item.artists.length != 1) {
            artists_string += ' and ' + data.item.artists[i].name;
        }
        else if (data.item.artists.length != 1) {
            artists_string += data.item.artists[i].name + ', ';
        }    
        else if (data.item.artists.length == 1) {
            artists_string += data.item.artists[i].name;
        }    
    }
    document.getElementById('currently_playing_HTML').innerHTML = data.item.name + '<br>By ' + artists_string;
}

async function api_call(_method, url_query, to_call = false) {
    let device_selected = JSON.parse(localStorage.getItem('selected_device'));
    let device_id = device_selected.id;
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');

    var result = await fetch('https://api.spotify.com/v1' + url_query + '?device_id=' + device_id, {
        method: _method,
        headers: {
            'Authorization' : 'Bearer ' + temp_refresh_token,
        }
    })
    if (to_call==true) {
        const data = await result.json();
        return data;
    }
    return result;
}

async function show_album_cover() {
    const data = await api_call('GET', '/me/player/currently-playing', true);
    const image_url = data.item.album.images[1].url;
    // console.log(image_url);
    let print_string = "<img src=" + image_url + ">";
    document.getElementById('album_cover').innerHTML = print_string;
    
}


async function next() {
    await api_call('POST', '/me/player/next');
    await currently_playing();
}

async function previous() {
    await api_call('POST', '/me/player/previous');
    await currently_playing();
}

// NOT POSSIBLE WITH IOS 
// async function set_volume() {
//     let device_selected = JSON.parse(localStorage.getItem('selected_device'));
//     let device_id = device_selected.id;
//     let temp_refresh_token = localStorage.getItem('temp_refresh_token');
  
//     const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=50&${device_id}`;
  
//     var result = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Authorization': 'Bearer ' + temp_refresh_token,
//       },
//     });

//     console.log(result);
// }



