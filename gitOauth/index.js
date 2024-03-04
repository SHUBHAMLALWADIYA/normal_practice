const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Home page");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/login", (req, res) => {
    // Process your regular login logic here using req.body.email and req.body.password
    const email = req.body.email;
    const password = req.body.password;

    // For demonstration purposes, let's just print the email and password
    console.log("Email:", email);
    console.log("Password:", password);

    res.send("Regular login logic goes here");
});

app.get("/auth/github", async (req, res) => {
    const { code } = req.query;
    console.log("code : " + code);

    try {
        const accessToken = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                client_id: "d6ea30d372bf6ce982ee",
                client_secret: "d549f911a155ec447a5086df6ef7abf2c1783c67",
                code
            })
        }).then((res) => res.json());

        console.log(accessToken);

        const user = await fetch("https://api.github.com/user/scop", {
            headers: {
                Authorization: `Bearer ${accessToken.access_token}`
            }
        }).then((res) => res.json());

        console.log({ user:user });
        res.send("You are redirected by GitHub OAuth");
    } catch (error) {
        console.error("GitHub OAuth error:", error);
        res.status(500).send("Error during GitHub OAuth");
    }
});
const port = 8080;
app.listen(port, () => {
    console.log("Server is running on port", port);
});

















