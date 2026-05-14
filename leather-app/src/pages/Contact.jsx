import { useState } from "react";

import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt, FaClock } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { CgAsterisk } from "react-icons/cg";
import { Navbar } from "../components/User/Navbar";
import Footer from "../components/User/Footer";

import ContactImage from "../assets/images/contact-image.png";

import "../assets/styles/Contact.css";

const Contact = () => {
  const [problemType, setProblemType] = useState("Product Damage");

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div className="contact-image">
        <img src={ContactImage} alt="Contact" />

        <div className="contact-content">
          <h1>Let's Stay Connected</h1>

          <p>
            Crafting enduring stories through leather. Reach out to our workshop
            or visit our flagship studio.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="container py-4">
        <div className="row g-4 align-items-start">
          {/* FORM */}
          <div className="col-12 col-lg-6">
            <div className="contact-form-box">
              <h3>Customer Support</h3>

              <form>
                {/* <div className="mb-3">
                  <label className="form-label">
                    E-mail Address
                    <sup>
                      <CgAsterisk />
                    </sup>
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your e-mail"
                  />

                  <div className="error-message"></div>
                </div> */}

                {/* <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">
                      First Name
                      <sup>
                        <CgAsterisk />
                      </sup>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />

                    <div className="error-message"></div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">
                      Last Name
                      <sup>
                        <CgAsterisk />
                      </sup>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                    />

                    <div className="error-message"></div>
                  </div>
                </div> */}

                <div className="mb-3">
                  <label className="form-label">
                    Product Order Id
                    <sup>
                      <CgAsterisk />
                    </sup>
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter your Order ID"
                  />

                  <div className="error-message"></div>
                </div>

                {/* <div className="mb-3">
                  <label className="form-label">
                    Contact Number
                    <sup>
                      <CgAsterisk />
                    </sup>
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter your contact number"
                  />

                  <div className="error-message"></div>
                </div> */}

                <div className="mb-3">
                  <label className="form-label">
                    What is your problem
                    <sup>
                      <CgAsterisk />
                    </sup>
                  </label>

                  <select
                    className="form-select"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                  >
                    <option>Product Damage</option>
                    <option>Product Mismatch</option>
                    <option>Quality Issues</option>
                    <option>Other</option>
                  </select>

                  {/* SHOW ONLY WHEN OTHER IS SELECTED */}
                  {problemType === "Other" && (
                    <>
                      <label className="form-label mt-2">
                        Other
                        <sup>
                          <CgAsterisk />
                        </sup>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Other Problem"
                      />
                    </>
                  )}

                  <div className="error-message"></div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Write the message</label>

                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Write your message"
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button className="btn btn-dark" type="submit">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* GET IN TOUCH */}
          <div className="col-12 col-lg-5 offset-lg-1  ">
            <div className="get-touch">
              <h1>Get in Touch</h1>

              <div className="contact-info-box">
                <span>
                  <FaLocationDot />
                </span>

                <div>
                  <h5>STORE LOCATION</h5>
                  <p>Perundhurai - Bhavani Rd, Perundurai,<br /> Tamil Nadu-638052</p>
                </div>
              </div>

              <div className="contact-info-box">
                <span>
                  <FaPhoneAlt />
                </span>

                <div>
                  <h5>PHONE</h5>
                  <p>+91 99655 12123</p>
                </div>
              </div>

              <div className="contact-info-box">
                <span>
                  <FaClock />
                </span>

                <div>
                  <h5>BUSINESS HOURS</h5>

                  <p>
                    Mon - Fri: 09:00 - 18:00
                    <br />
                    Sat: 10:00 - 14:00
                  </p>
                </div>
              </div>

              <div className="contact-info-box">
                <span>
                  <MdMarkEmailUnread />
                </span>

                <div>
                  <h5>EMAIL</h5>
                  <p>demo12@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
