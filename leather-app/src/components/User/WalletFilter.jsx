import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HomeProduct from "./HomeProduct";
// FIX: Imported cleanly from the centralized data file to protect Vite HMR compilation cycles
import { allProductsData } from "../../pages/User/Allproducts";

const WalletFilter = () => {
  const navigate = useNavigate();

  // Isolates items matching the wallet category criteria directly
  const walletProducts = allProductsData.filter(
    (product) => product.category?.toLowerCase() === "wallet"
  );

  const handleViewAllWallets = () => {
    // FIX: Navigates using the exact lowercase path to match your layout router rules
    navigate("/all-products", {
      state: {
        filters: {
          category: "wallet",
        },
      },
    });
  };

  return (
    <section className="my-4">
      <div className="container d-flex justify-content-between align-items-center mb-2">
        <h3 style={{ fontWeight: "600", margin: 0 }}>Wallets</h3>
        <span 
          onClick={handleViewAllWallets}
          className="text-decoration-none"
          style={{ color: "var(--levender, #8B5CF6)", cursor: "pointer", fontWeight: "500" }}
        >
          View All <FaArrowRight />
        </span>
      </div>

      {/* Renders data seamlessly using our updated multi-card composite lookup logic */}
      {walletProducts.length > 0 ? (
        <HomeProduct products={walletProducts} />
      ) : (
        <div className="container">
          <p className="text-muted py-3">No matching premium wallets available.</p>
        </div>
      )}
    </section>
  );
};

export default WalletFilter;