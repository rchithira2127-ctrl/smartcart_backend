import React, { useEffect, useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cart/")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCartItems(data);
      })
      .catch(err => console.log(err));
  }, []);

  // ✅ MOVE FUNCTION HERE (INSIDE)
  const removeItem = (id) => {
    fetch(`http://127.0.0.1:8000/api/cart/${id}/`, {
      method: "DELETE",
    })
    .then(() => {
      alert("Item removed ❌");

      setCartItems(cartItems.filter(item => item.id !== id));
    })
    .catch(err => console.log(err));
  };
  const increaseQuantity = (id, currentQty, productId) => {
  fetch(`http://127.0.0.1:8000/api/cart/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product: productId,   // ✅ IMPORTANT
      quantity: currentQty + 1
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Updated:", data);

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: data.quantity } : item
    ));
  })
  .catch(err => console.log(err));
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id}>
            <h4>{item.product_name}</h4>
            <p>Price: ₹{item.product_price}</p>
            <p>Quantity: {item.quantity}</p>

            {/* ✅ BUTTON */}

        <button onClick={() => removeItem(item.id)}>
          Remove ❌
        </button>

        <button onClick={() => increaseQuantity(item.id, item.quantity)}>
        + Increase ➕
        </button>

          </div>
        ))
      )}
    </div>
  );
}

export default Cart;