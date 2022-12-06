const rootElement = document.createElement("div");
rootElement.setAttribute("id", "root");
document.body.appendChild(rootElement);

if (document.URL == 'http://127.0.0.1:9001/') {
    const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;
    const createLink = (url, text) => `<a class="btnLikeLink" href="${url}">${text}</a>`;

    function loadSite() {
        rootElement.insertAdjacentHTML("afterbegin", createLink("http://127.0.0.1:9001/pizza/list", "Our Pizzas"));
    }
    loadSite();
}

if (document.URL == 'http://127.0.0.1:9001/pizza/list') {
    console.log('pizza list');

    fetch('/../api/pizza').then((response) => {
        response.json().then((data) => {
            data.map(pizzaID => {
                console.log(pizzaID);

                const pizzaDiv = document.createElement("div")
                rootElement.appendChild(pizzaDiv)

                pizzaDiv.setAttribute("id", `${pizzaID.name}`)

                for (const [key, value] of Object.entries(pizzaID)) {
                    console.log(value);
                    const div = document.createElement("div")
                    pizzaDiv.appendChild(div)

                    div.setAttribute("id", `${key}`)

                    div.innerHTML = `${key}: ${value}`
                }
            })
        });
    });
}