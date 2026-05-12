import { Categories } from "../components/Categories";
import { Faq } from "../components/Faq";
import Footer from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <ProductCard />
      <Faq/>
      <Footer/>
    </div>
  );
};
