import { Categories } from "../../components/User/Categories";
import { Faq } from "../../components/User/Faq";

import Footer from "../../components/User/Footer";
import { Hero } from "../../components/User/Hero";
import Navbar from "../../components/User/Navbar";
import ProductCard from "../../components/User/ProductCard";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <ProductCard />
      <Faq />
      <Footer />
    </div>
  );
};

export default Home;
