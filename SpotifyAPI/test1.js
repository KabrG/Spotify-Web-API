// const client_id = '45420b7bdbd044868beb5c5a9efa8519';
// const client_secret = '3ca1931fd146440698103f2c7f263414';

async function get_token(){
    // alert('completed 1');
    const results = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic ' + btoa(client_id + ":" + client_secret)
        },
        body: 'grant_type=client_credentials',
      })

    const data = await results.json();
    
    // alert('completed 2');
    console.log(data);
    const formattedData = JSON.stringify(data, null, 2);
    console.log(formattedData);

    return data.access_token;
}

// Function that considers the token and waits
async function operation(func) {
  try {
    var token = await get_token();
    // alert(token);
    await func(token);
  }
  
  catch (error) {
    console.log("JS Error: " + error)
  }
}


/*
fetch('url', {
  Method: 'POST',
  Headers: {
    Accept: 'application.json',
    'Content-Type': 'application/json'
  },
  Body: body,
  Cache: 'default'
})

curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"

**/