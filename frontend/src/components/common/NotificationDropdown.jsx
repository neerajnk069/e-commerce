// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const token = user?.token;

//       try {
//         const res = await axios.get(
//           "http://localhost:8000/api/getNotification",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (res.data.success) setNotifications(res.data.body);
//       } catch (err) {
//         console.error(err);
//       }
//       setLoading(false);
//     };

//     fetchNotifications();
//   }, []);

//   return (
//     <li className="nav-item dropdown pe-3 d-flex align-items-center">
//       <a
//         href="#"
//         className="nav-link text-body p-0"
//         id="dropdownMenuButton"
//         data-bs-toggle="dropdown"
//         aria-expanded="false"
//       >
//         <i className="material-symbols-rounded">notifications</i>
//         {/* Optional: unread count */}
//         {notifications.filter((n) => !n.isRead).length > 0 && (
//           <span className="badge bg-danger rounded-circle">
//             {notifications.filter((n) => !n.isRead).length}
//           </span>
//         )}
//       </a>

//       <ul
//         className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4"
//         aria-labelledby="dropdownMenuButton"
//       >
//         {loading ? (
//           <li className="dropdown-item">Loading...</li>
//         ) : notifications.length === 0 ? (
//           <li className="dropdown-item">No notifications</li>
//         ) : (
//           notifications.map((n) => (
//             <li className="mb-2" key={n._id}>
//               <a className="dropdown-item border-radius-md" href="#">
//                 <div className="d-flex py-1">
//                   <div className="my-auto">
//                     <img
//                       src={n.image || "../assets/img/team-2.jpg"}
//                       className="avatar avatar-sm me-3"
//                       alt="avatar"
//                     />
//                   </div>
//                   <div className="d-flex flex-column justify-content-center">
//                     <h6
//                       className={`text-sm font-weight-normal mb-1 ${
//                         !n.isRead ? "fw-bold" : ""
//                       }`}
//                     >
//                       <span className="font-weight-bold">{n.title}</span>{" "}
//                       {n.message}
//                     </h6>
//                     <p className="text-xs text-secondary mb-0">
//                       <i className="fa fa-clock me-1"></i>
//                       {new Date(n.createdAt).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//               </a>
//             </li>
//           ))
//         )}
//       </ul>
//     </li>
//   );
// };

// export default NotificationDropdown;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const NotificationDropdown = () => {
// //   const [notifications, setNotifications] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchNotifications = async () => {
// //       const user = JSON.parse(localStorage.getItem("user"));
// //       const token = user?.token;

// //       try {
// //         const res = await axios.get(
// //           "http://localhost:8000/api/getNotification",
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );
// //         if (res.data.success) setNotifications(res.data.body);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchNotifications();
// //   }, []);

// //   const markAllRead = async () => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     const token = user?.token;

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:8000/api/markRead",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   if (loading) return <div>Loading...</div>;

// //   return (
// //     <ul className="dropdown-menu dropdown-menu-end px-2 py-3">
// //       {notifications.length === 0 && <li>No notifications</li>}
// //       {notifications.map((n) => (
// //         <li key={n._id} className="mb-2">
// //           <div
// //             className={`dropdown-item border-radius-md ${
// //               n.isRead ? "" : "bg-light"
// //             }`}
// //           >
// //             <div className="d-flex py-1">
// //               <div className="d-flex flex-column justify-content-center">
// //                 <span>{n.message}</span>
// //                 <small className="text-secondary">
// //                   {new Date(n.createdAt).toLocaleString()}
// //                 </small>
// //               </div>
// //             </div>
// //           </div>
// //         </li>
// //       ))}
// //       {notifications.length > 0 && (
// //         <li>
// //           <button className="btn btn-sm w-100 mt-2" onClick={markAllRead}>
// //             Mark all as read
// //           </button>
// //         </li>
// //       )}
// //     </ul>
// //   );
// // };

// // export default NotificationDropdown;

// NotificationDropdown.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getNotification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.body);
        setUnreadCount(res.data.body.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark all as read
  const markAllRead = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/markRead",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking notifications read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <li className="nav-item dropdown pe-3 d-flex align-items-center">
      <a
        href="#!"
        className="nav-link text-body p-0"
        id="dropdownMenuButton"
        onClick={() => {
          setOpen(!open);
          if (unreadCount > 0) markAllRead();
        }}
      >
        <i className="material-symbols-rounded">notifications</i>
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-circle">{unreadCount}</span>
        )}
      </a>

      {open && (
        <ul
          className="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4 show"
          aria-labelledby="dropdownMenuButton"
        >
          {notifications.length === 0 && (
            <li className="text-center text-muted">No notifications</li>
          )}

          {notifications.map((n) => (
            <li key={n._id} className="mb-2">
              <div
                className={`dropdown-item border-radius-md d-flex py-1 ${
                  !n.isRead ? "bg-light" : ""
                }`}
              >
                <div className="d-flex flex-column justify-content-center">
                  <p className="text-sm mb-0">{n.message}</p>
                  <p className="text-xs text-secondary mb-0">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NotificationDropdown;
