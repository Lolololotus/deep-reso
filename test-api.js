const fetch = require('node-fetch');

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "테스트입니다", lang: "ko" })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Body:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testApi();
