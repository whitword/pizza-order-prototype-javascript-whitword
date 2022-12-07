const rootElement = document.createElement("div");
rootElement.setAttribute("id", "root");
document.body.appendChild(rootElement);

const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;
const createLink = (url, text) => `<a class="btnLikeLink" href="${url}">${text}</a>`;
const inputComponent = (id, plch) => `<input id="${id}" placeholder = "${plch}"></input>`;

function loadMain() {
  rootElement.insertAdjacentHTML("afterbegin", createLink("http://127.0.0.1:9001/pizza/list", "Our Pizzas"));
  const siteTitle = document.createElement('h1');
  siteTitle.innerText = "Welcome to Nonna Pizza";
  document.body.insertAdjacentElement("afterbegin", siteTitle);
}

if (document.URL == 'http://127.0.0.1:9001/') {
  loadMain();
}

if (document.URL == 'http://127.0.0.1:9001/pizza/list') {
  loadPizzaList()
}

function loadPizzaList() {
  fetch('/../api/pizza').then((response) => {
    response.json().then((data) => {
      data.map(pizzaID => {

        const pizzaDiv = document.createElement("div")
        rootElement.appendChild(pizzaDiv)

        pizzaDiv.setAttribute("id", `${pizzaID.name}`)

        for (const [key, value] of Object.entries(pizzaID)) {
          if (key === "img") {
            const img = document.createElement("img")
            pizzaDiv.appendChild(img)
            img.setAttribute("src", `${value}`)
            img.setAttribute("width", "200")
            img.setAttribute("id", `${key}`)
          } else {
            const div = document.createElement("div")
            pizzaDiv.appendChild(div)

            div.setAttribute("id", `${key}`)

            div.innerHTML = `${key}: ${value}`
          }
        }

        pizzaDiv.insertAdjacentHTML("afterbegin", buttonComponent(`orderBtn${pizzaID.id}`, "Add to cart"));
        document.getElementById(`orderBtn${pizzaID.id}`).disabled = true;
        document.getElementById(`orderBtn${pizzaID.id}`).addEventListener('click', function () {
          document.getElementById('orderForm').style.display = "block"
        })
        pizzaDiv.insertAdjacentHTML("afterbegin", inputComponent(`${pizzaID.id}`, "Order amount"));
        document.getElementById(`${pizzaID.id}`).addEventListener('input', function (e) {
          const pizzaToOrder = transferObj.pizzas.find(i => i.id == e.target.id)
          if (e.target.value > 0) {
            document.getElementById(`orderBtn${pizzaID.id}`).disabled = false;
            if (pizzaToOrder) {
              pizzaToOrder.amount = +e.target.value
            } else {
              transferObj.pizzas.push({ id: +e.target.id, amount: e.target.value })
            }
          } else if (e.target.value == 0 && pizzaToOrder) {
            let pizzaToDelete = transferObj.pizzas.findIndex(i => i.id == e.target.id)
            transferObj.pizzas.splice(pizzaToDelete, 1);
          }
          if (transferObj.pizzas.length < 1) {
            document.getElementById('orderForm').style.display = "none";
            document.getElementById(`orderBtn${pizzaID.id}`).disabled = true;
          }
        });
      })
    });
  })
}


let orderSchema = {
  id: 0,
  pizzas: [

  ],
  date: {
    year: 0000,
    month: 0,
    day: 0,
    time: "00:00"
  },
  customer: {
    name: "",
    email: "",
    address: {
      city: "",
      street: ""
    }
  }
}

let transferObj = JSON.parse(JSON.stringify(orderSchema));

const formComponent = () => `
	<form id="orderForm" style="display:none">     
    <h2>Your personal data</h2>
		<input type=text id="nameInput" placeholder="Your name"></input>
		<input type=text id="email" placeholder="your email"></input>
        <h2>Your Address</h2>
		<input type=text id="city" placeholder="City"></input>
		<input type=text id="street" placeholder="Street"></input>
    <button id="submit">Submit</button>
	</form>
`;
rootElement.insertAdjacentHTML("afterbegin", formComponent());
document.getElementById('nameInput').addEventListener('input', (e) => transferObj.customer.name = e.target.value)
document.getElementById('email').addEventListener('input', (e) => transferObj.customer.email = e.target.value)
document.getElementById('city').addEventListener('input', (e) => transferObj.customer.address.city = e.target.value)
document.getElementById('street').addEventListener('input', (e) => transferObj.customer.address.street = e.target.value)
document.getElementById('submit').addEventListener('click', function (event) {
  event.preventDefault();
  orderGet();
});

function orderGet() {
  fetch('/api/order')
    .then((response) => response.json())
    .then(jsonData => {
      data = jsonData;
      transferObj.id = data.length + 1;
      let utc = new Date().toJSON()
      transferObj.date.year = utc.slice(0, 4);
      transferObj.date.month = utc.slice(5, 7);
      transferObj.date.day = utc.slice(8, 10);
      transferObj.date.time = utc.slice(11, 17);
    })
    .then(x => orderPost())
}
function orderPost() {
  fetch('/api/order', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body:
      JSON.stringify(transferObj)
  })
    // .then((response) => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));
}

