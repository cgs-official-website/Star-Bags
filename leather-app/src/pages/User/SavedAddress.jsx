import React, { useState, useEffect } from "react";
import "../../assets/styles/SavedAddress.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { MdEdit, MdAdd, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

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
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const hasAddresses = savedAddresses.length > 0;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Fetch addresses from Firestore & Sync to LocalStorage for pages fallback
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.addresses && Array.isArray(data.addresses)) {
            setSavedAddresses(data.addresses);
            // FIXED TRICK: Write layout cache immediately to resolve cross-page dependency blockers
            localStorage.setItem("savedAddresses", JSON.stringify(data.addresses));
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!loadingAddresses && savedAddresses.length === 0) {
      setShowForm(true);
    }
  }, [loadingAddresses, savedAddresses.length]);

  const syncAddressesToDB = async (updatedAddresses) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { addresses: updatedAddresses });
        // Keeping LocalCaches fresh as well to protect other views routing switches
        localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
      } catch (err) {
        console.error("Error saving addresses to DB:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let updatedAddresses;
    if (editingId !== null) {
      updatedAddresses = savedAddresses.map((addr) =>
        addr.id === editingId
          ? {
              ...addr,
              ...formData,
              mobile: formData.contact,
            }
          : addr
      );
      setEditingId(null);
    } else {
      const newAddr = {
        id: Date.now(),
        ...formData,
        mobile: formData.contact,
      };
      updatedAddresses = [...savedAddresses, newAddr];
    }
    setSavedAddresses(updatedAddresses);
    await syncAddressesToDB(updatedAddresses);
    
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

  const confirmDeleteAction = async () => {
    const remaining = savedAddresses.filter((addr) => addr.id !== addressToDelete);
    setSavedAddresses(remaining);
    await syncAddressesToDB(remaining);
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
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <Navbar />
      <div className="orders-container container py-3 my-2">
        <h4 className="mb-4 fw-bold">Settings and Profile</h4>
        
        {/* ─── FIXED TRICK: UNIFIED GRID WRAPPER CONTEXT MESH ─── */}
        <div className="row justify-content-center">
          
          {/* SIDEBAR: Enforced strictly to col-lg-3 for persistent desktop framework bounds matching master blueprints */}
          <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* MAIN CONTAINER CONTENT CARD: Enforced strictly to col-lg-9 across dashboard panels */}
          <div className="col-lg-9 col-md-7 list-column-view">
            {hasAddresses && (
              <div className="saved-address-card p-4 bg-white shadow-sm border rounded-3" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0 outfit-font text-dark-theme">Saved Addresses</h4>
                  <button
                    className="btn add-address-btn d-flex align-items-center gap-2 text-white px-3 fw-bold small"
                    style={{ backgroundColor: "#8b5cf6", borderRadius: "6px", fontSize: "0.82rem" }}
                    onClick={handleAddNew}
                    type="button"
                  >
                    {showForm && editingId === null ? (
                      <><IoMdClose /> Close</>
                    ) : (
                      <><MdAdd /> Add a New Address</>
                    )}
                  </button>
                </div>

                <div className={`address-form-collapse ${showForm ? "open" : ""}`}>
                  <div id="address-form-section" className="address-form-box mb-4 p-3 border rounded-3 bg-light">
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

                <div className="address-list d-flex flex-column gap-3">
                  {savedAddresses.map((addr, index) => (
                    <div key={addr.id} className="address-item p-3 border rounded-3 bg-white shadow-sm">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <p className="address-label fw-bold small m-0 mb-1" style={{ color: "#8b5cf6" }}>Address {index + 1}</p>
                          <p className="address-text m-0 mb-1 text-dark fw-semibold" style={{ fontSize: "0.95rem" }}>{addr.name}, {addr.address}</p>
                          <p className="address-text m-0 mb-1 text-muted small">{addr.city}, {addr.state} – {addr.pin}</p>
                          <p className="address-text m-0 text-secondary small fw-bold">Mobile: {addr.mobile || addr.contact}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-light border p-1 px-2 d-flex align-items-center gap-1 small" 
                            style={{ fontSize: "0.78rem", fontWeight: "600" }}
                            onClick={() => handleEdit(addr)} 
                            type="button"
                          >
                            <MdEdit /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-light border text-danger p-1 px-2 d-flex align-items-center gap-1 small" 
                            style={{ fontSize: "0.78rem", fontWeight: "600", borderColor: "#fee2e2" }} 
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
              <div className="saved-address-card p-4 bg-white shadow-sm border rounded-3">
                <h4 className="fw-bold mb-3 outfit-font text-dark-theme">Address</h4>
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

      {showDeleteModal && (
        <div className="modal-overlay-custom" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20000 }}>
          <div className="bg-white p-4 rounded-3 text-center shadow-lg" style={{ width: "90%", maxWidth: "380px" }}>
            <h5 className="fw-bold mb-2">Confirm Deletion</h5>
            <p className="text-muted small">Are you absolutely sure you want to delete this delivery address? This action cannot be reverted.</p>
            <div className="d-flex gap-3 mt-4 justify-content-end">
              <button className="btn btn-light border px-3 small fw-bold" style={{ borderRadius: "6px" }} type="button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger px-3 small fw-bold" style={{ borderRadius: "6px" }} type="button" onClick={confirmDeleteAction}>Delete</button>
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