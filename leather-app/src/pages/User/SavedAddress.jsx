import React, { useState } from "react";
import "../../assets/styles/SavedAddress.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { MdEdit, MdLocationOn, MdAdd } from "react-icons/md";
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

function SavedAddress() {
  // Mock saved addresses — set to [] to test empty state
  const [savedAddresses, setSavedAddresses] = useState([
    // {
    //   id: 1,
    //   label: "Address 1",
    //   name: "Rahul Sharma",
    //   address: "Flat No. 302, Sai Residency",
    //   city: "Mumbai",
    //   state: "Maharashtra",
    //   pin: "400058",
    //   mobile: "9876543210",
    //   email: "rahul@example.com",
    //   contact: "9876543210",
    // },
    // {
    //   id: 2,
    //   label: "Address 2",
    //   name: "Rahul Sharma",
    //   address: "Flat No. 302, Sai Residency",
    //   city: "Mumbai",
    //   state: "Maharashtra",
    //   pin: "400058",
    //   mobile: "9876543210",
    //   email: "rahul@example.com",
    //   contact: "9876543210",
    // },
  ]);

  const hasAddresses = savedAddresses.length > 0;

  // Show form open by default when no addresses; collapsed otherwise
  const [showForm, setShowForm] = useState(!hasAddresses);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editingId !== null) {
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                ...formData,
                mobile: formData.contact,
                label: addr.label,
              }
            : addr,
        ),
      );
      setEditingId(null);
    } else {
      const newAddr = {
        id: Date.now(),
        label: `Address ${savedAddresses.length + 1}`,
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
    // Only close form if there are addresses to show
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
    // Scroll to form smoothly
    setTimeout(() => {
      document
        .getElementById("address-form-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm((prev) => !prev);
    if (!showForm) {
      setTimeout(() => {
        document
          .getElementById("address-form-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>
        <div className="row justify-content-center align-items-start">
          {/* Sidebar — desktop only, sticky */}
          <div className="col-lg-4 mb-3 d-none d-lg-block sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Content */}
          <div className="col-lg-8 col-12">
            {/* ── When addresses exist: show list + "Add New" toggle button ── */}
            {hasAddresses && (
              <div className="saved-address-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Saved Addresses</h5>
                  <button
                    className="btn add-address-btn d-flex align-items-center gap-2"
                    onClick={handleAddNew}
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

                {/* Slide-down form */}
                <div
                  className={`address-form-collapse ${showForm ? "open" : ""}`}
                >
                  <div
                    id="address-form-section"
                    className="address-form-box mb-4"
                  >
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

                {/* Address list */}
                <div className="address-list">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="address-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="address-label">{addr.label}</p>
                          <p className="address-text">
                            {addr.name}, {addr.address}
                          </p>
                          <p className="address-text">
                            {addr.city}, {addr.state} – {addr.pin}
                          </p>
                          <p className="address-text">Mobile: {addr.mobile}</p>
                        </div>
                        <button
                          className="btn edit-addr-btn d-flex align-items-center gap-1"
                          onClick={() => handleEdit(addr)}
                        >
                          <MdEdit /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── When no addresses: show only the form ── */}
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
      <Footer />
    </>
  );
}

/* ── Reusable form sub-component ── */
function AddressForm({ formData, onChange, onSave, onCancel, noCancel }) {
  return (
    <div className="address-form">
      <div className="mb-3">
        <label className="form-label-sm">E-mail Address</label>
        <input
          type="email"
          className="form-control addr-input"
          name="email"
          placeholder="Enter your e-mail"
          value={formData.email}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Name</label>
        <input
          type="text"
          className="form-control addr-input"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Contact Number</label>
        <input
          type="tel"
          className="form-control addr-input"
          name="contact"
          placeholder="Enter your contact number"
          maxLength={10}
          value={formData.contact}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">State</label>
        <input
          type="text"
          className="form-control addr-input"
          name="state"
          placeholder="Enter your state"
          value={formData.state}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">City</label>
        <input
          type="text"
          className="form-control addr-input"
          name="city"
          placeholder="Enter your city"
          value={formData.city}
          onChange={onChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label-sm">Pincode</label>
        <input
          type="number"
          className="form-control addr-input"
          name="pincode"
          placeholder="Enter your Pincode"
          maxLength={6}
          value={formData.pincode}
          onChange={onChange}
        />
      </div>
      <div className="mb-4">
        <label className="form-label-sm">Address</label>
        <textarea
          className="form-control addr-input"
          name="address"
          placeholder="Enter your address"
          rows={3}
          value={formData.address}
          onChange={onChange}
        />
      </div>
      <div className="d-flex gap-3">
        {!noCancel && (
          <button className="btn btn-addr-cancel flex-fill" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn btn-addr-save flex-fill" onClick={onSave}>
          Save Address
        </button>
      </div>
    </div>
  );
}

export default SavedAddress;
