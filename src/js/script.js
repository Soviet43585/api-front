window.addEventListener("DOMContentLoaded", () => {

    const adress = "http://178.172.235.232";

    loadCallbacks(false);
    initListeners();


    class Contact {
        constructor(id, name, email, phone, isProcessed) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.isProcessed = isProcessed;
        }
    }

    function toggleProcessedById(id, e) {
        const request = new XMLHttpRequest();
        request.open("POST", `${adress}/api/secured/contacts/toggleprocessed/${id}`)
        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwtToken"));
        request.send();
        request.addEventListener("load", () => {
            if (request.status === 200) {
                e.target.parentNode.remove();
            } else if(request.status === 401) {
                console.log(request.status);
                window.location.href = `login.html`;
            }
        });
    }

    function loadCallbacks(isProcessed) {
        const request = new XMLHttpRequest();
        console.log("click");
        request.open("GET", `${adress}/api/secured/contacts/getbyprocessed/${isProcessed}`);
        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwtToken"));
        request.send();
        request.addEventListener("load", () => {
            if(request.status === 200) {
                const response = JSON.parse(request.response),
                      callbackList = document.querySelector(".callback__list");
                if(callbackList.querySelectorAll(".callback__item").length > 0) {
                    callbackList.querySelectorAll(".callback__item").forEach(item => {
                        item.remove(); 
                    });
                }
                response.forEach(item => {
                    const viewItem = document.createElement("li"),
                          btn = document.createElement("button");
                    btn.addEventListener("click", (e) => {
                        toggleProcessedById(item.id, e);
                    });
                    btn.classList.add("callback__archive-btn");
                    btn.innerHTML = isProcessed ? "Вернуть" : "Обработано";
                    viewItem.classList.add("left-wrapper__callback-item", "callback__item");
                    viewItem.innerHTML = `<p class="callback__name callback__data" >${item.name}</p>
                    <p class="callback__phone callback__data">${item.phone}</p>
                    <p class="callback__email callback__data">${item.email}</p>`
                    //<button class="callback__archive-btn" onclick="toggleProcessedById(${item.id})">${isProcessed ? "Вернуть" : "Обработано"}</button>`
                    viewItem.append(btn);
                    callbackList.append(viewItem);
                });
            } else if(request.status === 401){
                console.log(request.status);
                window.location.href = `login.html`;
            }
        });
    }
    


    function initListeners() {
        const updateBtn = document.querySelector(".update-btn"),
              activeContactsItem = document.querySelector(".callback__active"),
              archiveContactsItem = document.querySelector(".callback__archive");
        
        activeContactsItem.addEventListener("click", () => loadCallbacks(false));
        archiveContactsItem.addEventListener("click", () => loadCallbacks(true));

        updateBtn.addEventListener("click", () => {
            loadCallbacks(false);
        });
    }
});