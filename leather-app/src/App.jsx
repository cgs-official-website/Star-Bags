import { Categories } from "./components/Categories"
import { Faq } from "./components/Faq"
// import { Button } from "./components/Button"
import Footer from "./components/Footer"
import { Hero } from "./components/Hero"
// import { Input } from "./components/Input"
import { Navbar } from "./components/Navbar"  
import { ProductCart } from "./components/ProductCart"
// import { Contact } from "./pages/Contact"
// import ProductCart from "./components/ProductCard"

const App = () => {
  return (
    <>
      {/* <h1>hello</h1> */}
      {/* <ProductCart/> */}
      <Navbar />
      <Hero/>
      {/* <Button/> */}
      {/* <Input/> */}
      <Categories/>
      <ProductCart/>
      <Faq/>
      {/* <Contact/> */}
      <Footer/>
      
    </>
  )
}

export default App