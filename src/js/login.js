window.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".login-form");

    class User {
        constructor(username, password) {
            this.username = username;
            this.password = password;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form),
              user = new User(formData.get("username"), formData.get("password")),
              request = new XMLHttpRequest();
        request.open("POST", "http://178.172.235.232/demo/auth");
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(user));
        request.addEventListener("load", () => {
            if(request.status === 200) {
                const response = JSON.parse(request.response),
                      jwtToken = response.token;
                console.log(jwtToken);
                localStorage.setItem("jwtToken", jwtToken);
                window.location.href = `index.html`;
            }
        });
    });

});