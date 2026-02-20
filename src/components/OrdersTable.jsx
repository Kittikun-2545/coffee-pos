function OrdersTable({
  orders,
  toggleStatus,
  handleDelete,
  handleEdit,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Menu</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.menu}</td>
            <td>{order.quantity}</td>
            <td>${order.price}</td>
            <td>${order.total}</td>
            <td>
              <span className={`badge ${order.status}`}>
                {order.status}
              </span>
            </td>
            <td>
              <button onClick={() => toggleStatus(order.id)}>
                Toggle
              </button>

              <button
                onClick={() => handleEdit(order)}
                style={{ marginLeft: "8px" }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(order.id)}
                style={{ marginLeft: "8px", color: "red" }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;
