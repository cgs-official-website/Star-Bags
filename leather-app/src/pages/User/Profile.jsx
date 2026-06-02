import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import "../../assets/styles/Profile.css";
import "../../assets/styles/Skeleton.css";
import { MdEdit, MdSave, MdCancel, MdPhotoCamera } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Profile() {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    mobile: "",
    email: "",
    photo: "",
  });

  const [tempData, setTempData] = useState({ ...formData });

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    } else if (userData) {
      const data = {
        name: userData.name || "",
        gender: userData.gender || "Male",
        mobile: userData.mobile || "",
        email: userData.email || currentUser?.email || "",
        photo: userData.photo || "",
      };
      setFormData(data);
      setTempData(data);
    }
  }, [userData, currentUser, loading, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...formData });
  };

  const handleSave = async () => {
    setIsEditing(false);
    setFormData({ ...tempData });
    try {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          name: tempData.name,
          gender: tempData.gender,
          mobile: tempData.mobile,
          email: tempData.email,
          photo: tempData.photo || "",
          updatedAt: new Date().toISOString()
        });
        
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({
          ...storedUser,
          name: tempData.name,
          gender: tempData.gender,
          mobile: tempData.mobile,
          email: tempData.email,
          photo: tempData.photo || ""
        }));
      }
    } catch (error) {
      console.error("Error updating profile in DB:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("Please upload a photo smaller than 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>

        {/* Layout matching SavedAddress and Myreviews */}
        <div className="row justify-content-center align-items-start">

          {/* Sidebar — hidden on tablet & mobile, sticky on desktop */}
          <div className="col-lg-4 mb-3 d-none d-lg-block sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main content — full width on mobile/tablet, 8-col on desktop */}
          <div className="col-lg-8 col-12">
            <div className="profile-details-card">
              
              {loading ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="skeleton-shimmer skeleton-block" style={{ width: '120px', height: '24px' }} />
                    <div className="skeleton-shimmer skeleton-block" style={{ width: '100px', height: '36px', borderRadius: '6px' }} />
                  </div>
                  <div className="d-flex flex-column gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="d-flex flex-column gap-2">
                        <div className="skeleton-shimmer skeleton-block" style={{ width: '80px', height: '14px' }} />
                        <div className="skeleton-shimmer skeleton-block" style={{ height: '42px', borderRadius: '6px' }} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Profile</h4>

                    {!isEditing ? (
                      <button 
                        className="btn edit-profile-btn d-flex align-items-center gap-2 text-white px-3 fw-bold small"
                        style={{ backgroundColor: "#8b5cf6", borderRadius: "6px", fontSize: "0.82rem" }} 
                        onClick={handleEdit}
                      >
                        <MdEdit /> Edit Profile
                      </button>
                    ) : (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn cancel-profile-btn d-flex align-items-center gap-2 px-3 fw-bold small"
                          style={{ borderRadius: "6px", fontSize: "0.82rem" }} 
                          onClick={handleCancel}
                        >
                          <MdCancel /> Cancel
                        </button>
                        <button 
                          className="btn text-white d-flex align-items-center gap-2 px-3 fw-bold small"
                          style={{ backgroundColor: "#8b5cf6", borderRadius: "6px", fontSize: "0.82rem" }} 
                          onClick={handleSave}
                        >
                          <MdSave /> Save
                        </button>
                      </div>
                    )}
                  </div>

                  <form>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={tempData.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        style={{ 
                          backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", 
                          borderRadius: "8px", 
                          height: "42px", 
                          borderColor: "#e5e7eb" 
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={tempData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", 
                          borderRadius: "8px", 
                          height: "42px", 
                          borderColor: "#e5e7eb" 
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="mobile"
                        maxLength={10}
                        value={tempData.mobile}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        style={{ 
                          backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", 
                          borderRadius: "8px", 
                          height: "42px", 
                          borderColor: "#e5e7eb" 
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={tempData.email}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        style={{ 
                          backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", 
                          borderRadius: "8px", 
                          height: "42px", 
                          borderColor: "#e5e7eb" 
                        }}
                      />
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProfileSideNav from "../../components/User/Profile-Side-Nav";
// import "../../assets/styles/Profile.css";
// import "../../assets/styles/Skeleton.css";
// import { MdEdit, MdSave, MdCancel, MdPhotoCamera } from "react-icons/md";
// import { useAuth } from "../../context/AuthContext";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase";

// function Profile() {
//   const { currentUser, userData, loading } = useAuth();
//   const navigate = useNavigate();

//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "Male",
//     mobile: "",
//     email: "",
//     photo: "",
//   });

//   const [tempData, setTempData] = useState({ ...formData });

//   useEffect(() => {
//     if (!loading && !currentUser) {
//       navigate("/login");
//     } else if (userData) {
//       const data = {
//         name: userData.name || "",
//         gender: userData.gender || "Male",
//         mobile: userData.mobile || "",
//         email: userData.email || currentUser?.email || "",
//         photo: userData.photo || "",
//       };
//       setFormData(data);
//       setTempData(data);
//     }
//   }, [userData, currentUser, loading, navigate]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...formData });
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setTempData({ ...formData });
//   };

//   const handleSave = async () => {
//     setIsEditing(false);
//     setFormData({ ...tempData });
//     try {
//       if (currentUser) {
//         const userDocRef = doc(db, "users", currentUser.uid);
//         await updateDoc(userDocRef, {
//           name: tempData.name,
//           gender: tempData.gender,
//           mobile: tempData.mobile,
//           email: tempData.email,
//           photo: tempData.photo || "",
//           updatedAt: new Date().toISOString()
//         });
        
//         const storedUser = JSON.parse(localStorage.getItem("user")) || {};
//         localStorage.setItem("user", JSON.stringify({
//           ...storedUser,
//           name: tempData.name,
//           gender: tempData.gender,
//           mobile: tempData.mobile,
//           email: tempData.email,
//           photo: tempData.photo || ""
//         }));
//       }
//     } catch (error) {
//       console.error("Error updating profile in DB:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTempData({ ...tempData, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Limit base64 photo size to 800KB to fit easily in Firestore document limits (1MB max document limit is strict, but 800KB is safe)
//       if (file.size > 800 * 1024) {
//         alert("Please upload a photo smaller than 800KB.");
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setTempData((prev) => ({ ...prev, photo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="profile-page-app-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
//       <Navbar />
      
//       {/* FIXED BOOTSTRAP GRID MESH LAYOUT TO MATCH UNIFORM COLUMN WIDTH */}
//       <main className="orders-container container py-3 my-2">
//         <h4 className="mb-4 fw-bold">Settings and Profile</h4>
        
//         <div className="row justify-content-center">
//           {/* Sidebar - Consistent width configuration matching other dashboard modules */}
//           <div className="col-lg-3 col-md-5 mb-4 sidebar-column-view wl-sidebar-sticky">
//             <ProfileSideNav />
//           </div>

//           <div className="col-lg-8 col-md-7">
//             {loading ? (
//               <div className="profile-details-card">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div className="skeleton-shimmer skeleton-block" style={{ width: '120px', height: '24px' }} />
//                   <div className="skeleton-shimmer skeleton-block" style={{ width: '100px', height: '36px', borderRadius: '6px' }} />
//                 </div>
//                 <div className="d-flex flex-column gap-3">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div key={i} className="d-flex flex-column gap-2">
//                       <div className="skeleton-shimmer skeleton-block" style={{ width: '80px', height: '14px' }} />
//                       <div className="skeleton-shimmer skeleton-block" style={{ height: '42px', borderRadius: '6px' }} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="profile-details-card">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h4 className="fw-bold mb-0">Profile</h4>

//                 {!isEditing ? (
//                   <button className="btn edit-profile-btn border px-3 fw-bold small text-white" style={{ backgroundColor: "#8b5cf6", borderRadius: "6px", fontSize: "0.82rem" }} onClick={handleEdit}>
//                     <MdEdit className="me-1" /> Edit Profile
//                   </button>
//                 ) : (
//                   <div className="d-flex gap-2">
//                     <button className="btn btn-light border px-3 fw-bold small" style={{ borderRadius: "6px", fontSize: "0.82rem" }} onClick={handleCancel}>
//                       <MdCancel className="me-1" /> Cancel
//                     </button>
//                     <button className="btn text-white px-3 fw-bold small" style={{ backgroundColor: "#8b5cf6", borderRadius: "6px", fontSize: "0.82rem" }} onClick={handleSave}>
//                       <MdSave className="me-1" /> Save
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <form>
//                 <div className="mb-2">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={tempData.name}
//                     onChange={handleChange}
//                     readOnly={!isEditing}
//                     style={{ backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", borderRadius: "8px", height: "42px", borderColor: "#e5e7eb" }}
//                   />
//                 </div>

//                 <div>
//                   <label className="form-label fw-semibold text-secondary small mb-1">Gender</label>
//                   <select
//                     className="form-select custom-form-select"
//                     name="gender"
//                     value={tempData.gender}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     style={{ backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", borderRadius: "8px", height: "42px", borderColor: "#e5e7eb" }}
//                   >
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="form-label fw-semibold text-secondary small mb-1">Mobile Number</label>
//                   <input
//                     type="tel"
//                     className="form-control"
//                     name="mobile"
//                     maxLength={10}
//                     value={tempData.mobile}
//                     onChange={handleChange}
//                     readOnly={!isEditing}
//                     style={{ backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", borderRadius: "8px", height: "42px", borderColor: "#e5e7eb" }}
//                   />
//                 </div>

//                 <div>
//                   <label className="form-label fw-semibold text-secondary small mb-1">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={tempData.email}
//                     onChange={handleChange}
//                     readOnly={!isEditing}
//                     style={{ backgroundColor: !isEditing ? "#f9fafb" : "#ffffff", borderRadius: "8px", height: "42px", borderColor: "#e5e7eb" }}
//                   />
//                 </div>
//               </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default Profile;