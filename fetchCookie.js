const axios = require("axios");
const fs = require("fs");

async function getSessionCookie() {
    try {
        // Replace with your actual login URL and credentials
        const response = await axios.post("http://localhost:3000/login", {
            username: "testuser",
            password: "password123"
        }, { withCredentials: true });

        // Extract the session cookie from headers
        const cookies = response.headers["set-cookie"];
        if (!cookies || cookies.length === 0) {
            console.error("Failed to fetch session cookie");
            process.exit(1);
        }

        // Assuming the cookie format is "connect.sid=SESSION_ID; Path=/; HttpOnly"
        const sessionCookie = cookies.find(cookie => cookie.startsWith("connect.sid"));
        if (!sessionCookie) {
            console.error("Session cookie not found in response");
            process.exit(1);
        }

        // Extract the actual cookie value
        const cookieValue = sessionCookie.split(";")[0]; // "connect.sid=SESSION_ID"

        // Save it to a file (to be used by the Bash script)
        fs.writeFileSync("session_cookie.txt", cookieValue);
        console.log("Session cookie saved successfully!");
    } catch (error) {
        console.error("Error fetching session cookie:", error.response?.data || error.message);
        process.exit(1);
    }
}

getSessionCookie();

