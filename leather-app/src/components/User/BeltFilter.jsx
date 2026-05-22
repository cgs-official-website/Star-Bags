import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HomeProduct from "./HomeProduct";
// FIX: Import directly from the isolated data file to stop compilation warnings
import { allProductsData } from "../../pages/User/Allproducts";


const BeltFilter = () => {
  const navigate = useNavigate();

  const beltProducts = allProductsData.filter(
    (product) => product.category?.toLowerCase() === "belt"
  );

  const handleViewAllBelts = () => {
    // FIX: Match the lowercase URL slug string exactly as configured in your App App.jsx routing configuration setup
    navigate("/all-products", {
      state: {
        filters: {
          category: "belt",
        },
      },
    });
  };

  return (
    <section className="my-4">
      <div className="container d-flex justify-content-between align-items-center mb-2">
        <h3 style={{ fontWeight: "600", margin: 0 }}>Belts</h3>
        <span 
          onClick={handleViewAllBelts}
          className="text-decoration-none"
          style={{ color: "var(--levender, #8B5CF6)", cursor: "pointer", fontWeight: "500" }}
        >
          View All <FaArrowRight />
        </span>
      </div>

      {beltProducts.length > 0 ? (
        <HomeProduct products={beltProducts} />
      ) : (
        <div className="container">
          <p className="text-muted py-3">No matching premium belts available.</p>
        </div>
      )}
    </section>
  );
};

export default BeltFilter;