import ProductList from "./ProductList";
import Cart from "./Cart";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>SmartCart 🛒</h1>
      
      <ProductList />
      <Cart />   {/* 👈 ADD THIS */}
    </div>
  );
}

export default App;