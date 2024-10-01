document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            document.getElementById('uploadedImage').src = imageData;
            document.getElementById('uploadedImage').style.display = 'block';
            document.getElementById('imageBase64').value = imageData.split(',')[1]; // Only the base64 part
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('detectButton').addEventListener('click', function() {
    const imageBase64 = document.getElementById('imageBase64').value;
    if (imageBase64) {
        detectGender(imageBase64);
    } else {
        alert('Please upload an image first.');
    }
});

async function detectGender(imageBase64) {
    const apiKey = 'bg0GMWYSvDpcEKsrTWP7yL54AgW41CGy';
    const apiSecret = '4EVCgbOqxTxUeX4nfP2FMklm7K0fhzhh';
    const formData = new FormData();
    formData.append('api_key', apiKey);
    formData.append('api_secret', apiSecret);
    formData.append('image_base64', imageBase64);
    formData.append('return_attributes', 'gender');

    try {
        const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('API Response:', result); // Log the full response for debugging
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error detecting gender.';
    }
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    if (result.faces && result.faces.length > 0) {
        const gender = result.faces[0].attributes.gender.value;
        resultDiv.innerHTML = `Detected gender: ${gender}`;
    } else {
        resultDiv.innerHTML = 'No faces detected or unable to determine gender.';
    }
}
