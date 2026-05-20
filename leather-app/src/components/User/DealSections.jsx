import '../../assets/styles/DealSections.css';

const DealSections = () => {
  const dealCategories = [
    {
      id: 'school-bags',
      title: 'Deals on school bags',
      products: [
        { id: 1, name: 'Vip', discount: 'Min. 25% off', image: '../../assets/images/school1.svg' },
        { id: 2, name: 'Rubeen', discount: 'Min. 55% off', image: '../../assets/images/school2.svg' },
        { id: 3, name: 'Safari', discount: 'Min. 35% off', image: '../../assets/images/school3.svg' },
        { id: 4, name: 'Sky bags', discount: 'Min. 45% off', image: '../../assets/images/school4.svg' },
      ],
    },
    {
      id: 'travel-bags',
      title: 'Deals on travel bags',
      products: [
        { id: 5, name: 'safari', discount: 'Min. 25% off', image: '../../assets/images/travel1.svg' },
        { id: 6, name: 'Rubeen', discount: 'Min. 55% off', image: '../../assets/images/travel2.svg' },
        { id: 7, name: 'sky Bags', discount: 'Min. 35% off', image: '../../assets/images/travel3.svg' },
        { id: 8, name: 'Rubeen', discount: 'Min. 45% off', image: '../../assets/images/travel4.svg' },
      ],
    },
    {
      id: 'hand-bags',
      title: 'Deals on hand bags',
      products: [
        { id: 9, name: 'hike', discount: 'Min. 25% off', image: '../../assets/images/hand1.svg' },
        { id: 10, name: 'dialyobject', discount: 'Min. 55% off', image: '../../assets/images/hand2.svg' },
        { id: 11, name: 'Lapurso', discount: 'Min. 35% off', image: '../../assets/images/hand3.svg' },
        { id: 12, name: 'Motorola', discount: 'Min. 45% off', image: '../../assets/images/hand4.svg' },
      ],
    },
  ];

  // Helper helper to resolve standard relative assets inside a loop build
  const getImageUrl = (path) => {
    return new URL(path, import.meta.url).href;
  };

  return (
    <div className="dashboard-container container">
      {dealCategories.map((category) => (
        /* WHOLE CONTAINER BORDER */
        <div key={category.id} className="category-card">
          
          {/* Header Row */}
          <div className="category-header">
            <h2 className="category-title">{category.title}</h2>
            <button className="arrow-btn" aria-label="View more">
              <span className="arrow-icon">›</span>
            </button>
          </div>

          {/* 2x2 Product Grid */}
          <div className="products-grid">
            {category.products.map((product) => (
              /* INDIVIDUAL BORDER */
              <div key={product.id} className="product-item">
                <div className="product-image-wrapper">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="product-img" 
                  />
                </div>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-discount">{product.discount}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default DealSections;