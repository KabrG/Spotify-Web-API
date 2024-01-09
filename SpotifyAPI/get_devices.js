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
      // alert('NOT OK');
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
  
function update_device_dropdown(){
    // Get Element of Dropdown Menu
    get_devices();
     // using the function:

    let device_list = JSON.parse(localStorage.getItem("device_list"));
    dropdown_device_element = document.getElementById('device_choice');
    
    // Remove Elements in Dropdown Menu First
    var i, j = dropdown_device_element.options.length - 1; 
    for(i = j; i >= 0; i--) {
       dropdown_device_element.remove(i);
    }
    
    for(let i=0; i < device_list.devices.length; i++) {
        var option = document.createElement('option');
        option.textContent = device_list.devices[i].name;
        option.value = device_list.devices[i].name;
        dropdown_device_element.appendChild(option);
      }
    
}
