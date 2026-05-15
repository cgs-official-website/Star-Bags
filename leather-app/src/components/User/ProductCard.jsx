import { IoMdCart } from "react-icons/io";

// import '../assets/styles/productCard.css'

import '../../assets/styles/productCard.css'
// >>>>>>>> b2dde8ac3872c5cfcb51a7ade4b0b18d213de40d:leather-app/src/components/User/ProductCard.jsx
import 'bootstrap-icons/font/bootstrap-icons.css';

export const ProductCard = () => {
  const productCard = [
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"},
    {image:"../src/assets/images/leather1.png",name:"leather wallet",rating:4.2,price:"120",realPrice:"120",offer:"20%"}
  ]

  return (
    <>
      <section>
          <div className="ProductCard-section my-3 ">
              <div className="container d-flex gap-3 flex-nowrap">
                {productCard.map((pro,index) => (
                  <div key={index} className="card" style={{width: "15rem"}}>
                    <img src={pro.image} className="card-img-top" alt="..." />
                    <div className="card-body ">
                      <div className="d-flex  justify-content-between pt-2">
                        <h6 className="card-title">{pro.name}</h6>
                        <span>⭐ {pro.rating}</span>
                      </div>
                      <div className="price-details d-flex gap-3 pt-2">
                      <p>${pro.price} <span><del>${pro.realPrice}</del></span></p>    
                      <span><b>{pro.offer}off</b></span>
                      </div>
                      <div className="d-flex gap-3 pt-2">
                        <button className="icon-btn">
                          <IoMdCart />
                        </button>
                        <a href="#" className="btn  ">Buy Now</a>
                      </div>
                      <div className="wishlist"><button><i className="bi bi-heart heart-icon"></i></button></div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
      </section>
    </>
  )
}
