const client_id = '';
const client_secret = '';

const redirect_uri = 'http://127.0.0.1:5500/SpotifyAPI/HomePage.html';
const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const state_value = '';
var authorization_code = '';
var authorization_refresh_token = '';

var temp_refresh_token = '';

function request_authorization(){
    let url = AUTHORIZE; // https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-playback-state&state=YOUR_STATE_VALUE
    // alert('Work 1');
    url += '?client_id=' + client_id;
    url += '&response_type=code&redirect_uri=' + encodeURI(redirect_uri);
    url += '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
    url += '&state=' + state_value;
    url += "&show_dialog=false"; // Originally true
    // alert(url);
    window.location.href = url; // Show screen
    // alert('Work 3');

}

function onload_page(){

  sessionStorage.setItem("device_selected", false);
  if (window.location.search.length > 0){ // window.location. search is the Query (characters at the end of URL)
    // alert('reached here');
    redirect_post_authorization();
  }
}

async function redirect_post_authorization(){ // After it has been authorized, what occurs next
  authorization_code = get_code();
  localStorage.setItem('authorization_code', authorization_code);

  // alert('Le code is ' + code)
  temp_refresh_token = await get_access_token(authorization_code); // Grabs Access token 
  localStorage.setItem('temp_refresh_token', temp_refresh_token);
  // await get_devices(token);
} 

function get_code(){
  let code = null;
  if (window.location.search.length > 0){ // window.location. search is the Query (characters at the end of URL)
    let query = window.location.search;
    let params = new URLSearchParams(query)
    code = params.get('code');
  }
  else{
    alert('Query was empty');
  }
  return code;
}

async function get_access_token(code) {
  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'authorization_code');
  requestBody.append('code', code);
  requestBody.append('redirect_uri', redirect_uri);

  const results = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization' : 'Basic ' + btoa(client_id + ":" + client_secret),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    body: requestBody.toString()
  })
  
  const data = await results.json();
  console.log(data);
  const formattedData = JSON.stringify(data, null, 2);
  console.log(formattedData);

  authorization_refresh_token = data.refresh_token;
  return data.access_token;
}

async function refresh_access_token() {
  // alert(authorization_refresh_token);
  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'refresh_token');
  requestBody.append('refresh_token', authorization_refresh_token);

  const results = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization' : 'Basic ' + btoa(client_id + ":" + client_secret),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    body: requestBody.toString()
  })

    // Check the response status
    if (!results.ok) {
      throw new Error('Failed to refresh token. Status: ' + results.status);
    }  
  
  const data = await results.json();
  console.log(data);
  const formattedData = JSON.stringify(data, null, 2);
  console.log(formattedData);
  localStorage.setItem('temp_refresh_token', data.access_token);
  return data.access_token;

}

async function get_devices(){
    // alert('get devices 1')
    let temp_refresh_token = localStorage.getItem('temp_refresh_token');
    // alert('from get devices: ' + temp_refresh_token);
    
    const results = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + temp_refresh_token,
      }
    })

     // Check the response status
     if (!results.ok) {
      alert('NOT OK');
      throw new Error('Failed to fetch device data. Status: ' + results.status);
    }

    const data = await results.json();

    localStorage.setItem("device_list", JSON.stringify(data));
    console.log(results.status); // Check the response status
    const readable = JSON.stringify(data, null, 2);
    console.log(readable);
    html_display_devices();

  }

function html_display_devices() {
  let device_list = JSON.parse(localStorage.getItem('device_list'));
  let display_html = '';

  for (let i=0; i<device_list.devices.length; i++) {
    if (i ==device_list.devices.length-1)
      display_html += device_list.devices[i].name;
    else{
      display_html += device_list.devices[i].name + '<br>';
    }
  }
  display_html += '<br>';
  document.getElementById('show_devices_HTML').innerHTML = display_html;
}

async function select_device(){
  let selected_device_name = document.getElementById('device_choice').value;
  let device_list = JSON.parse(localStorage.getItem("device_list"));

  console.log(device_list.devices[0].name);

  for(let i=0; i < device_list.devices.length; i++) {
    if (device_list.devices[i].name == selected_device_name) {
      localStorage.setItem('selected_device', JSON.stringify(device_list.devices[i]));
      document.getElementById('selected_device_HTML').innerHTML = device_list.devices[i].name + ' is your selected device.';
    }
  }
  sessionStorage.setItem("device_selected", true); // Useful for Refresh Function
}
