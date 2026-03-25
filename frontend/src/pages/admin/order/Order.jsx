import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getAllOrders");
      if (res.data.success) {
        setOrders(res.data.body);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await axios.delete("http://localhost:8000/api/deleteOrder", {
        id,
      });

      if (res.data.success) {
        alert("Order deleted successfully");
        fetchOrders();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("API error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <h4>Orders</h4>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Tracking ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{order.userId?.name || "N/A"}</td>
                  <td>
                    {order.products.map((p) => p.productId?.name).join(", ")}
                  </td>
                  <td>{order.products.map((p) => p.quantity).join(", ")}</td>
                  <td>{order.products.map((p) => p.price).join(", ")}</td>
                  <td>{order.totalAmount}</td>
                  <td>
                    {order.address?.house}, {order.address?.city},{" "}
                    {order.address?.state} - {order.address?.pincode}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.trackingId}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate("/orderView", { state: { id: order._id } })
                      }
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="12" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;
