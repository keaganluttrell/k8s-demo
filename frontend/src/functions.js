const url = "" //"http://localhost:3001";

export function getProducts(setFn) {
  fetch(url + "/api/products")
    .then((res) => res.json())
    .then((data) => {
      console.log("getProdcuts", data);
      setFn(data);
    });
}

export function getCart(setFn) {
  fetch(url + "/api/cart")
    .then((res) => res.json())
    .then((data) => {
      console.log("getCart", data);
      setFn(data);
    });
}

export function getUser(id, setFn) {
  fetch(url + "/api/users/" + id)
    .then((res) => res.json())
    .then((data) => {
      console.log("getUser", data);
      setFn(data);
    });
}

export function addItemToCart(item, setFn) {

  const cartItem = {
    product_id: item.id,
    title: item.title
  }

  fetch(url + "/api/cart", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartItem),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("addItemToCart", data)
      getCart(setFn);
    });
}

export function removeItemFromCart(item, setFn) {
  const { id } = item;

  fetch(url + "/api/cart/" + id, {
    method: "DELETE"
  })
    .then(() => {
      console.log("removeItemFromCart")
      getCart(setFn)
    })
    .catch(e => console.log("removeItemFromCart Error:", e));
}
