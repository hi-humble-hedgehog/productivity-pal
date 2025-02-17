import './credentials.css';

const aiModelEl = document.getElementById('aiModel') as HTMLInputElement;
const apiKeyEl = document.getElementById('apiKey') as HTMLInputElement;

const urlParams = new URLSearchParams(window.location.search);
  const keyParam = urlParams.get('key');

if(keyParam) {

    apiKeyEl.value = keyParam;
}

document.getElementById('credentialsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    window.electronAPI.credentialMessage(apiKeyEl.value);
});