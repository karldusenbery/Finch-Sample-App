// app.js
const clientId = 'YOUR_FINCH_CLIENT_ID'; // Replace with your actual client ID
const redirectUri = 'http://localhost:3000/callback'; // Update if your callback URL is different

function redirectToFinchConnect() {
  const provider = document.getElementById('provider').value;
  if (!provider) {
    alert('Please select a provider.');
    return;
  }

  const products = encodeURIComponent('employment,identity,pay_statement');
  const connectUrl = `https://connect.tryfinch.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&products=${products}&sandbox=true&provider=${provider}`;
  window.location.href = connectUrl;
}

async function getAccessToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      const tokenResponse = await fetch('/api/auth/token', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          client_id: clientId,
          redirect_uri: redirectUri
        })
      });

      const data = await tokenResponse.json();
      const accessToken = data.access_token;

      if (accessToken) {
        localStorage.setItem('finchAccessToken', accessToken);

        try {
          getCompanyInfo(accessToken);
          getEmployeeDirectory(accessToken);
        } catch (error) {
          displayError('Error fetching data:', error);
        }
      } else {
        displayError('Failed to get access token.');
      }
    } catch (error) {
      displayError('Error during token exchange:', error);
    }
  }
}

function getCompanyInfo(accessToken) {
  fetch('/api/company', { 
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      displayData('Company Info', data);
    })
    .catch(error => {
      displayError('Error fetching company info:', error);
    });
}

function getEmployeeDirectory(accessToken) {
  fetch('/api/directory', { 
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      displayEmployeeDirectory(data);
    })
    .catch(error => {
      displayError('Error fetching employee directory:', error);
    });
}

function displayData(title, data) {
  const resultDiv = document.getElementById('result');
  const section = document.createElement('div');
  section.innerHTML = `<h2>${title}</h2>`;

  if (data.error) {
    section.innerHTML += `<p class="error">${data.error.message}</p>`;
  } else {
    const dataDisplay = document.createElement('div');
    for (const key in data) {
      dataDisplay.innerHTML += `<p><b>${key}:</b> ${data[key]}</p>`;
    }
    section.appendChild(dataDisplay);
  }

  resultDiv.appendChild(section);
}

function displayEmployeeDirectory(data) {
  const resultDiv = document.getElementById('result');
  const section = document.createElement('div');
  section.innerHTML = `<h2>Employee Directory</h2>`;

  if (data.error) {
    section.innerHTML += `<p class="error">${data.error.message}</p>`;
  } else {
    const employeeList = document.createElement('ul');
    data.employees.forEach(employee => {
      const employeeItem = document.createElement('li');
      employeeItem.innerHTML = `${employee.first_name} ${employee.last_name}`;
      employeeItem.addEventListener('click', () => {
        displayData(`${employee.first_name} ${employee.last_name}`, employee);
      });
      employeeList.appendChild(employeeItem);
    });
    section.appendChild(employeeList);
  }

  resultDiv.appendChild(section);
}

function displayError(message, error = null) {
  const resultDiv = document.getElementById('result');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `<p>${message}</p>`;
  if (error) {
    errorDiv.innerHTML += `<p>Error details: ${error}</p>`;
  }
  resultDiv.appendChild(errorDiv);
}