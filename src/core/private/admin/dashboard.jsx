import AdminSideBar from "../../../components/navigation/admin_side_bar";
import "../../css_files/private/admin/dashboard.css";

function Dashboard() {
    return(
        <>
            <div className="dashboard-main-window">
                <div className="admin-side-bar-div">
                    <AdminSideBar/>
                </div>
            </div>
        </>
    )
}

export default Dashboard;