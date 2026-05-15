
import { BiSolidWallet } from "react-icons/bi";
import { GiSchoolBag, GiBelt } from "react-icons/gi";

import "../../../src/assets/styles/Categories.css"

export const Categories = () => {
  const categories = [
    {
      name: "Belts",
      icon: <GiBelt />,
    },
    {
      name: "Bags",
      icon: <GiSchoolBag />,
    },
    {
      name: "Wallets",
      icon: <BiSolidWallet />,
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <h1 className="category-title">Categories</h1>

        <div className="categories-wrapper">
          {categories.map((cat, index) => (
            
            <div key={index} className="category-card">
              {/* ICON */}
              <div className="category-icon">
                <a href="#">{cat.icon}</a>
              </div>
              
              {/* NAME */}
              <h5>{cat.name}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};
