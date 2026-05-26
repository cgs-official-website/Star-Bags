import React, { useState, useEffect } from "react";
import "../../assets/styles/SavedAddress.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { MdEdit, MdAdd, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const emptyForm = {
  email: "",
  name: "",
  contact: "",
  state: "",
  city: "",
  pin: "",
  address: "",
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function SavedAddress() {
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const data = localStorage.getItem("savedAddresses");
    return data ? JSON.parse(data) : [];
  });

  const hasAddresses = savedAddresses.length > 0;
  const [showForm, setShowForm] = useState(!hasAddresses);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                ...formData,
                mobile: formData.contact,
              }
            : addr
        )
      );
      setEditingId(null);
    } else {
      const newAddr = {
        id: Date.now(),
        ...formData,
        mobile: formData.contact,
      };
      setSavedAddresses((prev) => [...prev, newAddr]);
    }
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    if (savedAddresses.length > 0) setShowForm(false);
  };

  const handleEdit = (addr) => {
    setFormData({
      email: addr.email || "",
      name: addr.name,
      contact: addr.contact || addr.mobile,
      state: addr.state,
      city: addr.city,
      pin: addr.pin,
      address: addr.address,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setTimeout(() => {
      document
        .getElementById("address-form-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const triggerDeletePrompt = (id) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteAction = () => {
    const remaining = savedAddresses.filter((addr) => addr.id !== addressToDelete);
    setSavedAddresses(remaining);
    setShowDeleteModal(false);
    setAddressToDelete(null);

    if (remaining.length === 0) {
      setShowForm(true);
    }
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm((prev) => !prev);
    if (!showForm) {
      setTimeout(() => {
        document
          .getElementById("address-form-section")
          .scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        <div className="row justify-content-center align-items-start">
          <div className="col-lg-4 mb-3 d-none d-lg-block sidebar-sticky">
            <ProfileSideNav />
          </div>

          <div className="col-lg-8 col-12">
            {hasAddresses && (
              <div className="saved-address-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Saved Addresses</h5>
                  <button
                    className="btn add-address-btn d-flex align-items-center gap-2"
                    onClick={handleAddNew}
                    type="button"
                  >
                    {showForm && editingId === null ? (
                      <>
                        <IoMdClose /> Close
                      </>
                    ) : (
                      <>
                        <MdAdd /> Add a New Address
                      </>
                    )}
                  </button>
                </div>

                <div className={`address-form-collapse ${showForm ? "open" : ""}`}>
                  <div id="address-form-section" className="address-form-box mb-4">
                    <h6 className="fw-bold mb-3">
                      {editingId ? "Edit Address" : "New Address"}
                    </h6>
                    <AddressForm
                      formData={formData}
                      onChange={handleChange}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>

                <div className="address-list">
                  {/* FIXED: We calculate the text label based purely on array index runtime position layout mapping rules */}
                  {savedAddresses.map((addr, index) => (
                    <div key={addr.id} className="address-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="address-label">Address {index + 1}</p>
                          <p className="address-text">
                            {addr.name}, {addr.address}
                          </p>
                          <p className="address-text">
                            {addr.city}, {addr.state} – {addr.pin}
                          </p>
                          <p className="address-text">Mobile: {addr.mobile}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn edit-addr-btn d-flex align-items-center gap-1"
                            onClick={() => handleEdit(addr)}
                            type="button"
                          >
                            <MdEdit /> Edit
                          </button>
                          <button
                            className="btn edit-addr-btn text-danger d-flex align-items-center gap-1"
                            style={{ borderColor: "#fee2e2" }}
                            onClick={() => triggerDeletePrompt(addr.id)}
                            type="button"
                          >
                            <MdDelete /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasAddresses && (
              <div className="saved-address-card">
                <h5 className="fw-bold mb-3">Address</h5>
                <AddressForm
                  formData={formData}
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  noCancel
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay-custom">
          <div className="modal-box-custom shadow-lg">
            <h5>Confirm Deletion</h5>
            <p>Are you absolutely sure you want to delete this delivery address? This action cannot be reverted.</p>
            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-modal-cancel"
                type="button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-modal-confirm"
                type="button"
                onClick={confirmDeleteAction}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function AddressForm({ formData, onChange, onSave, onCancel, noCancel }) {
  const starStyle = { color: "var(--levender, #8b5cf6)", marginLeft: "3px" };

  return (
    <form onSubmit={onSave} className="address-form">
      <div className="mb-3">
        <label className="form-label-sm">E-mail Address<span style={starStyle}>*</span></label>
        <input type="email" className="form-control addr-input" name="email" placeholder="Enter your e-mail" value={formData.email} onChange={onChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Name<span style={starStyle}>*</span></label>
        <input type="text" className="form-control addr-input" name="name" placeholder="Enter your name" value={formData.name} onChange={onChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Contact Number<span style={starStyle}>*</span></label>
        <input
          type="text"
          className="form-control addr-input"
          name="contact"
          placeholder="Enter 10 digit number"
          value={formData.contact}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) {
              onChange({ target: { name: "contact", value: val } });
            }
          }}
          pattern="^[6-9][0-9]{9}$"
          maxLength={10}
          required
        />
      </div>
      <div className="mb-3 position-relative">
        <label className="form-label-sm">State<span style={starStyle}>*</span></label>
        <select className="form-select addr-input text-muted" name="state" value={formData.state} onChange={onChange} required>
          <option value="" disabled hidden>Select your state</option>
          {indianStates.map((state, idx) => (
            <option key={idx} value={state} className="text-dark">{state}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label-sm">City<span style={starStyle}>*</span></label>
        <input type="text" className="form-control addr-input" name="city" placeholder="Enter your city" value={formData.city} onChange={onChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Pincode<span style={starStyle}>*</span></label>
        <input
          type="text"
          className="form-control addr-input"
          name="pin"
          placeholder="Enter 6 digit Pincode"
          value={formData.pin}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 6) {
              onChange({ target: { name: "pin", value: val } });
            }
          }}
          pattern="^[0-9]{6}$"
          maxLength={6}
          required
        />
      </div>
      <div className="mb-4">
        <label className="form-label-sm">Address<span style={starStyle}>*</span></label>
        <textarea className="form-control addr-input" name="address" placeholder="Enter flat/house no, landmark, building name" rows={3} value={formData.address} onChange={onChange} required />
      </div>
      <div className="d-flex gap-3">
        {!noCancel && (
          <button type="button" className="btn btn-addr-cancel flex-fill" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn btn-addr-save flex-fill">Save Address</button>
      </div>
    </form>
  );
}

export default SavedAddress;