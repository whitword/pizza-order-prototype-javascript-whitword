const rootElement = document.createElement("div");
rootElement.setAttribute("id", "root");
document.body.appendChild(rootElement);
const siteTitle = document.createElement('h1');
siteTitle.innerText = "Welcome to Nonna Pizza";
document.body.insertAdjacentElement("afterbegin", siteTitle);

const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;
const createLink = (url, text) => `<a class="btnLikeLink" href="${url}">${text}</a>`;
const inputComponent = (id, plch) => `<input id="${id}" placeholder = "${plch}"></input>`;

function loadSite() {
  rootElement.insertAdjacentHTML("afterbegin", createLink("http://127.0.0.1:9001/pizza/list", "Our Pizzas"));
}

if (document.URL == 'http://127.0.0.1:9001/') {
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

        pizzaDiv.insertAdjacentHTML("afterbegin", buttonComponent(`orderBtn${pizzaID.id}`, "Add to cart"));
        document.getElementById(`orderBtn${pizzaID.id}`).addEventListener('click', function () {
          document.getElementById('orderForm').style.display = "block"
        })
        pizzaDiv.insertAdjacentHTML("afterbegin", inputComponent(`${pizzaID.id}`, "Order amount"));
        document.getElementById(`${pizzaID.id}`).addEventListener('input', function (e) {
          const pizzaToOrder = transferObj.pizzas.find(i => i.id == e.target.id)
          if(e.target.value>0){
          if (pizzaToOrder) {
            pizzaToOrder.amount = +e.target.value
            console.log(transferObj.pizzas);
          } else {
            transferObj.pizzas.push({ id: +e.target.id, amount: e.target.value })
            console.log(transferObj.pizzas);
          }}else if (e.target.value == 0 && pizzaToOrder){
           let pizzaToDelete = transferObj.pizzas.findIndex(i => i.id == e.target.id)
              console.log(pizzaToDelete); 
              transferObj.pizzas.splice(pizzaToDelete, 1);
              console.log(transferObj.pizzas);
      })
    });
  })
    .catch(err => console.log(err));
}


let orderSchema = {
  id: 0,
  pizzas: [
    {
      id: 0,
      amount: 0
    }
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
      console.log(transferObj);
      console.log(JSON.stringify(transferObj));
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

