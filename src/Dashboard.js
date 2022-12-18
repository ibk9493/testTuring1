import React from "react";
import CustomTable from "./CustomTable";
import { getUser, removeUserSession } from "./Utils/Common";

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };

  return (
    <div className="p-2">
      <CustomTable />
      <br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;
