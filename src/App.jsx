import { useState } from "react";
import "./App.css";
import SummaryCard from "./components/SummaryCards";
import OrdersTable from "./components/OrdersTable";
import useOrders from "./useOrders";

function App() {
  const { orders, setOrders, loading, error } = useOrders();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [customer, setCustomer] = useState("");
  const [menu, setMenu] = useState("Latte");
  const [quantity, setQuantity] = useState(1);

  // 🔥 Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editMenu, setEditMenu] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);

  const menuOptions = {
    Latte: 60,
    Americano: 40,
    Mocha: 50,
    Espresso: 30,
  };

  const price = menuOptions[menu];
  const total = price * quantity;

  const toggleStatus = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status:
                order.status === "Pending"
                  ? "Completed"
                  : "Pending",
            }
          : order
      )
    );
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/orders/${id}`, {
      method: "DELETE",
    });
    setOrders(orders.filter((o) => o.id !== id));
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setEditMenu(order.menu);
    setEditQuantity(order.quantity);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const newPrice = menuOptions[editMenu];
    const newTotal = newPrice * editQuantity;

    const res = await fetch(
      `http://localhost:3001/orders/${editingOrder.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu: editMenu,
          quantity: editQuantity,
          price: newPrice,
          total: newTotal,
        }),
      }
    );

    const updatedOrder = await res.json();

    setOrders(
      orders.map((o) =>
        o.id === editingOrder.id ? updatedOrder : o
      )
    );

    setIsModalOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!customer) return;

    const newOrder = {
      customer,
      menu,
      quantity,
      price,
      total,
      status: "Pending",
    };

    const res = await fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    const data = await res.json();
    setOrders([...orders, data]);

    setCustomer("");
    setQuantity(1);
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  return (
    <div className="container">

      {/* ===== Premium Header ===== */}
      <div className="header">
        <div className="logo-section">
          <img src="/logo-80.png" alt="logo" className="logo" />
          <h1>Coffee POS</h1>
        </div>
        <div className="header-line"></div>
      </div>

      {/* ===== Dashboard Cards ===== */}
      <div className="cards">
        <SummaryCard title="Total Orders" value={orders.length} />
        <SummaryCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
        />
        <SummaryCard
          title="Customers"
          value={new Set(orders.map((o) => o.customer)).size}
        />
      </div>

      {/* ===== Create Form ===== */}
      <form className="form" onSubmit={handleCreate}>
        <input
          placeholder="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <select
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
        >
          {Object.keys(menuOptions).map((item) => (
            <option key={item} value={item}>
              {item} (${menuOptions[item]})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
        />

        <div>
          <strong>Total: ${total}</strong>
        </div>

        <button type="submit">Create</button>
      </form>

      {/* ===== Controls ===== */}
      <div className="controls">
        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* ===== Orders Table ===== */}
      <OrdersTable
        orders={filteredOrders}
        toggleStatus={toggleStatus}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* ===== Modal ===== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Order</h2>

            <select
              value={editMenu}
              onChange={(e) => setEditMenu(e.target.value)}
            >
              {Object.keys(menuOptions).map((item) => (
                <option key={item} value={item}>
                  {item} (${menuOptions[item]})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={editQuantity}
              onChange={(e) =>
                setEditQuantity(Number(e.target.value))
              }
            />

            <div style={{ marginTop: "10px" }}>
              Total: $
              {menuOptions[editMenu] * editQuantity}
            </div>

            <div style={{ marginTop: "15px" }}>
              <button onClick={handleSaveEdit}>
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;