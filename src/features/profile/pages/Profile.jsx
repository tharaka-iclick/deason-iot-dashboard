import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, LogOut } from "lucide-react";
import { Button, Card } from "../../../shared/components/ui";
import { logoutUser } from "../../authentication/store/authSlice";
import "./Profile.css";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="profile">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h2>{user?.displayName}</h2>
            <p className="profile-email">
              <Mail size={16} />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <Button variant="outline">Edit Profile</Button>
          <Button variant="outline">Change Password</Button>
          <Button variant="danger" onClick={handleLogout} icon={LogOut}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};
