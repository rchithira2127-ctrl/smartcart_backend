import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setProducts(data);
      })
      .catch(err => console.log(err));
  }, []);

  // ✅ ADD THIS FUNCTION
  const addToCart = (productId) => {
    fetch("http://127.0.0.1:8000/api/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: productId,
        quantity: 1
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Added to cart:", data);
      alert("Product added to cart 🛒");
    })
    .catch(err => console.log("Error:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map(product => (
          <div key={product.id} style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
          }}>
            <h4>{product.name}</h4>
            <p>Price: ₹{product.price}</p>

            {/* ✅ ADD BUTTON HERE */}
            <button onClick={() => addToCart(product.id)}>
              Add to Cart 🛒
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default ProductList;