const https = require('https');

const apiKey = 'AIzaSyAUDv4QeJ6jrHL_r7z2uh4QrdB49W6BhKo';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const models = JSON.parse(data);
            if (models.models) {
                const fs = require('fs');
                const list = models.models.map(m => `- ${m.name} (${m.supportedGenerationMethods.join(', ')})`).join('\n');
                fs.writeFileSync('models-list.txt', list);
                console.log("Saved to models-list.txt");
            } else {
                console.log("Response:", data);
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request Error:", e.message);
});
