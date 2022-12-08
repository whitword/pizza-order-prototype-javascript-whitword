const header = document.createElement("div");
header.setAttribute("id", "header");
document.body.appendChild(header);

const rootElement = document.createElement("div");
rootElement.setAttribute("id", "root");
document.body.appendChild(rootElement);

const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;
const createLink = (url, text) => `<a class="btnLikeLink" href="${url}">${text}</a>`;
const inputComponent = (id, plch) => `<input id="${id}" placeholder = "${plch}"></input>`;

function loadHeader() {
  header.insertAdjacentHTML("beforeend", createLink("http://127.0.0.1:9001/pizza/list", "Our Pizzas \n"));
  header.insertAdjacentHTML("beforeend", createLink("http://127.0.0.1:9001/", "NONNA PIZZA \n"));
  header.insertAdjacentHTML("beforeend", createLink("http://127.0.0.1:9001/pizza/allergens", "Allergens \n"));
  //header.insertAdjacentHTML("beforeend", createLink("http://127.0.0.1:9001/order", "Your Cart \n"));
}

function loadMainPage() {
  const siteTitle = document.createElement('h1');
  siteTitle.innerText = "Welcome to Nonna Pizza";
  document.body.insertAdjacentElement("beforeend", siteTitle);
}

if (document.URL == 'http://127.0.0.1:9001/') {
  loadHeader();
  loadMainPage();
}

if (document.URL == 'http://127.0.0.1:9001/pizza/list') {
  loadHeader();
  loadPizzaList()
}

if (document.URL == 'http://127.0.0.1:9001/pizza/allergens') {
  loadHeader();
  loadAllergens();
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
      <h2>Your order</h2>
      <div id="yourOrder"></div>
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

function loadAllergens() {
  fetch('/../api/allergens')
    .then((response) => {
      response.json()
        .then((data) => {
          data.allergens.map(i => {
            const allergen = document.createElement("div")
            rootElement.appendChild(allergen)
            allergen.setAttribute("id", "allergenContainer")

            for (const [key, value] of Object.entries(i)) {
              const div = document.createElement("div")
              div.setAttribute("id", "allergens")
              div.innerHTML = `${key}: ${value}`
              allergen.appendChild(div)
            }
          })
        })
    })
};

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
            img.setAttribute("id", `${key}`)
            img.setAttribute("src", `${value}`)
          } else {
            const div = document.createElement("div")
            pizzaDiv.appendChild(div)

            div.setAttribute("id", `${key}`)

            div.innerHTML = `${key}: ${value}`
          }
        }

        pizzaDiv.insertAdjacentHTML("beforeend", inputComponent(`${pizzaID.id}`, "Order amount"));
        pizzaDiv.insertAdjacentHTML("beforeend", buttonComponent(`orderBtn${pizzaID.id}`, "Add to cart"));
        document.getElementById(`orderBtn${pizzaID.id}`).disabled = true;

        document.getElementById(`${pizzaID.id}`).addEventListener('input', function (e) {
          const pizzaToOrder = transferObj.pizzas.find(i => i.id == e.target.id)
          if (e.target.value > 0) {
            document.getElementById(`orderBtn${pizzaID.id}`).disabled = false;
          }
          
        });

        document.getElementById(`orderBtn${pizzaID.id}`).addEventListener('click', function () {
          document.getElementById('orderForm').style.display = "block"

          const inputField = document.getElementById(`${pizzaID.id}`)

          const pizzaToOrder = transferObj.pizzas.find(i => i.id == pizzaID.id)

          const yourOrder = document.getElementById("yourOrder");

          if (!pizzaToOrder) {
            const p = document.createElement("p")
            p.setAttribute("id", `orderOf${pizzaID.id}`)
            yourOrder.appendChild(p)
            const yourPizza = document.getElementById(`orderOf${pizzaID.id}`)
            transferObj.pizzas.push({ id: +pizzaID.id, amount: inputField.value })

            yourPizza.innerText += `${pizzaID.name}: ${inputField.value}`
            addButtons()
          } else {
            const yourPizza = document.getElementById(`orderOf${pizzaID.id}`)

            pizzaToOrder.amount = +inputField.value

            yourPizza.innerText = `${pizzaID.name}: ${inputField.value}`
            addButtons()
          }

          const yourPizza = document.getElementById(`orderOf${pizzaID.id}`)

          checkIfDelete()
          function checkIfDelete() {
            const pizzaToOrder = transferObj.pizzas.find(i => i.id == pizzaID.id)
            
            if ((inputField.value == 0 || pizzaToOrder.amount == 0) && pizzaToOrder) {
              let pizzaToDelete = transferObj.pizzas.findIndex(i => i.id == inputField.id)
              transferObj.pizzas.splice(pizzaToDelete, 1);

              yourOrder.removeChild(yourPizza)
            }

            if (transferObj.pizzas.length < 1) {
              document.getElementById('orderForm').style.display = "none";
              document.getElementById(`orderBtn${pizzaID.id}`).disabled = true;
            }
          }

          function addButtons() {
            const yourPizza = document.getElementById(`orderOf${pizzaID.id}`)
            const minusButton = document.createElement("button")
            const pizzaToOrder = transferObj.pizzas.find(i => i.id == pizzaID.id)

            minusButton.setAttribute("id", `minus${pizzaID.id}`)
            minusButton.innerText = '-'
            yourPizza.appendChild(minusButton)

            const plusButton = document.createElement("button")
            plusButton.setAttribute("id", `plus${pizzaID.id}`)
            plusButton.innerText = '+'
            yourPizza.appendChild(plusButton)

            minusButton.addEventListener("click", function (event) {
              event.preventDefault();

              pizzaToOrder.amount--
              yourPizza.innerText = `${pizzaID.name}: ${pizzaToOrder.amount}`
              inputField.value = pizzaToOrder.amount
              addButtons()
              checkIfDelete()
            })
  
            plusButton.addEventListener("click", function (event) {
              event.preventDefault();
  
              pizzaToOrder.amount++
              yourPizza.innerText = `${pizzaID.name}: ${pizzaToOrder.amount}`
              inputField.value = pizzaToOrder.amount
              addButtons()
              checkIfDelete()
            })
          }

        })
      })
    })
  })
}

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
      transferObj.date.time = utc.slice(11, 16);
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
    .then(data => {
      //console.log(data);
    })
    .catch(err => console.log(err));
}

