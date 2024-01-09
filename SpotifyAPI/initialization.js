const redirect_uri = 'http://127.0.0.1:5500/HomePage.html';
// const state_value = '';

async function set_client_info() {
    // Get user-related information from sensitive_info.js
   const response = await fetch("./sensitive_info.json");
   const json = await response.json();
 
   client_id = json.client.client_id;
   client_secret = json.client.client_secret;
   console.log(client_id);
   console.log(client_secret);
}

function request_authorization(){
    let url = "https://accounts.spotify.com/authorize"; // https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-playback-state&state=YOUR_STATE_VALUE
    url += '?client_id=' + client_id;
    url += '&response_type=code&redirect_uri=' + encodeURI(redirect_uri);
    url += '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
    // url += '&state=' + state_value;
    url += "&show_dialog=false"; // Originally true to show screen
    window.location.href = url; // Show screen

}

async function onload_page(){
    await set_client_info();
    console.log(client_id);
    console.log(client_secret);
    sessionStorage.setItem("device_selected", false);
    

    // window.location. search is the Query (characters at the end of URL)
    if (window.location.search.length > 0){ 
        redirect_post_authorization();  
    }

    else {
        setTimeout(function() {
            alert("Delay")
            request_authorization();
          }, 1000);       

    }
  }

// After it has been authorized, what occurs next
async function redirect_post_authorization(){ 
    authorization_code = get_code();
    localStorage.setItem('authorization_code', authorization_code);
  
    // alert('Le code is ' + code)
    temp_refresh_token = await get_access_token(authorization_code); // Grabs Access token 
    localStorage.setItem('temp_refresh_token', temp_refresh_token);
    // await get_devices(token);
  } 

function get_code(){
  let code = null;
  // window.location. search is the Query (characters at the end of URL)
  if (window.location.search.length > 0){ 
    let query = window.location.search;
    let params = new URLSearchParams(query)
    code = params.get('code'); // Parses to get the code in URL
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

