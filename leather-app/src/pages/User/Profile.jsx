import React, { useState } from "react";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import "../../assets/styles/Profile.css";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "John",
    gender: "Male",
    mobile: "9874561230",
    email: "Samplemail@gmail.com",
  });

  const [tempData, setTempData] = useState({ ...formData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...formData });
  };

  const handleSave = () => {
    setIsEditing(false);
    setFormData({ ...tempData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  return (
    <>
      <Navbar />
      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block">
            <ProfileSideNav />
          </div>
          <div className="col-lg-8 col-md-7">
            <div className="profile-details-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="fw-bold mb-0">Profile</h4>

                {!isEditing ? (
                  <button className="btn edit-profile-btn" onClick={handleEdit}>
                    <MdEdit className="me-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn cancel-profile-btn"
                      onClick={handleCancel}
                    >
                      <MdCancel className="me-1" />
                      Cancel
                    </button>
                    <button
                      className="btn edit-profile-btn"
                      onClick={handleSave}
                    >
                      <MdSave className="me-2" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <form>
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={tempData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={{ backgroundColor: !isEditing ? "#f8f9fa" : "#fff" }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select custom-form-select"
                    name="gender"
                    value={tempData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ backgroundColor: !isEditing ? "#f8f9fa" : "#fff" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile"
                    maxLength={10}
                    value={tempData.mobile}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={{ backgroundColor: !isEditing ? "#f8f9fa" : "#fff" }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={{ backgroundColor: !isEditing ? "#f8f9fa" : "#fff" }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
