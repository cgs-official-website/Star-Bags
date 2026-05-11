import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt , FaClock } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";

export const Contact = () => {
  return (
    <div className="container">
        <div className="row my-5 p-4">
            <div className="col-12 col-lg-6 border p-3 ">
                <h3>Contact Us</h3>
                <form action="" className="py-3">
                    <div className="mb-3">
                        <label  className="form-label">E-mail Address</label>
                        <input type="email" className="form-control"  placeholder="Enter your e-mail" />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label  className="form-label">First Name</label>
                            <input type="text" className="form-control" placeholder="First name" aria-label="First name" />
                        </div>
                        <div className="col">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-control" placeholder="Last name" aria-label="Last name" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label  className="form-label">Contact  Number </label>
                        <input type="cel" className="form-control" placeholder="Enter your contact number" />
                    </div>
                    <div className="mb-3">
                        <label  className="form-label">What is your probelm </label>
                        <input type="cel" className="form-control" placeholder="Enter your Product Size" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Write the message</label>
                        <textarea className="form-control" rows="5" placeholder="Enter your address"></textarea>
                    </div>
                    <div className="mb-3 d-grid">
                        <button className="btn btn-primary" type="button">Send Message</button>
                    </div>
                </form>
            </div>
            <div className="col-12 col-lg-5 p-5" >
                <h1>Get in Touch</h1>
                <div className="py-4">
                    <div className="d-flex gap-3">
                        <span><FaLocationDot /></span>
                        <div >
                            <h5 className="p-0">STORE LOCATION</h5>
                            <p>42 Artisan Way, Heritage Quarter Florence, Italy 50123.</p>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <span><FaPhoneAlt /></span>
                        <div >
                            <h5>PHONE</h5>
                            <p>+39 055 123 4567</p>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <span><FaClock /></span>
                        <div >
                            <h5>BUSINESS HOURS</h5>
                            <p>Mon - Fri: 09:00 - 18:00 <br />
                                Sat: 10:00 - 14:00</p>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <span><MdMarkEmailUnread /></span>
                        <div >
                            <h5>EMAIL</h5>
                            <p>demo12@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
