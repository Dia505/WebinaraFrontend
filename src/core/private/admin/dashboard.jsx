import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth_context";

import CreateAdminForm from "../../../components/dashboard/create_admin_form";
import AdminSideBar from "../../../components/navigation/admin_side_bar";
import "../../css_files/private/admin/dashboard.css";
const VITE_API_URL = import.meta.env.VITE_API_URL;  

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [webinarCount, setWebinarCount] = useState(0);
    const { authToken } = useAuth();
    const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
    const [userLog, setUserLog] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                    withCredentials: true
                });
                setUsers(response.data);
                setUserCount(response.data.length);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [authToken]);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/webinar`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                    withCredentials: true
                });

                setWebinarCount(response.data.length);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
            }
        };

        fetchWebinars();
    }, [authToken]);

    useEffect(() => {
        const fetchUserLog = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/user-log`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                    withCredentials: true
                });
                setUserLog(response.data);
            } catch (error) {
                console.error("Failed to fetch user log:", error);
            }
        };

        fetchUserLog();
    }, [authToken]);

    return (
        <>
            <div className="dashboard-main-window">
                <div className="admin-side-bar-div">
                    <AdminSideBar />
                </div>

                <div className="dashboard-main-div">
                    <p className="dashboard-title">Dashboard</p>

                    <div className="dashboard-create-admin-btn-div">
                        <p className="dashboard-welcome-back-text">Welcome back👋</p>
                        <button className="dashboard-create-admin-btn" onClick={() => setShowCreateAdminForm(true)}>Create new admin +</button>
                    </div>

                    <div className="dashboard-insights-div">
                        <div className="dashboard-insight">
                            <p className="dashboard-insight-title">Total users</p>
                            <p className="dashboard-insight-stats">{userCount}</p>
                        </div>
                        <div className="dashboard-insight">
                            <p className="dashboard-insight-title">Total active webinars</p>
                            <p className="dashboard-insight-stats">{webinarCount}</p>
                        </div>
                    </div>

                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    return (
                                        <tr key={user?._id}>
                                            <td>{index + 1}</td>
                                            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <img
                                                    src={user.profilePicture}
                                                    alt="profile"
                                                    className="dashboard-table-user-img"
                                                />
                                                {user.fullName}
                                            </td>
                                            <td>{user.mobileNumber}</td>
                                            <td>{user.email}</td>
                                            <td>{user.address}</td>
                                            <td>{user.city}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <p className="user-log-text">User Log</p>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User ID</th>
                                        <th>URL</th>
                                        <th>Method</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userLog.map((ul, index) => {
                                        const methodClass = `method-${ul.method.toLowerCase()}`;
                                        return (
                                            <tr key={ul?._id} className={methodClass}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {ul.userId}
                                                </td>
                                                <td>{ul.url}</td>
                                                <td>{ul.method}</td>
                                                <td>{ul.timestamp}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {showCreateAdminForm && (
                        <>
                            <div className="dashboard-overlay" onClick={() => setShowCreateAdminForm(false)}></div>
                            <div className="dashboard-form-modal">
                                <CreateAdminForm closeForm={() => setShowCreateAdminForm(false)} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Dashboard;