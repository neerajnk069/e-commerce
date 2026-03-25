import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const OrderView = () => {
  const location = useLocation();
  const id = location.state?.id;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/getOrderById", {
        id: id,
      });

      if (res.data.success) {
        setOrder(res.data.body);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Order ID missing");
      return;
    }
    fetchOrder();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!order) return <h3>Loading order...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>View Order</h5>
        <Link to="/order" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <p>
          <strong>User Name:</strong> {order?.userId?.name || "N/A"}
        </p>

        <h6>Products:</h6>
        <ul>
          {order.products?.map((item) => (
            <li key={item._id}>
              {item.productId?.productname} - Qty: {item.quantity} - Price: ₹
              {item.price}
            </li>
          ))}
        </ul>

        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>

        <p>
          <strong>Address:</strong>
          {order?.address?.house}, {order?.address?.city},
          {order?.address?.state} - {order?.address?.pincode}
        </p>

        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Order Status:</strong> {order.orderStatus}
        </p>
        <p>
          <strong>Tracking ID:</strong> {order.trackingId}
        </p>
      </div>
    </div>
  );
};

export default OrderView;
