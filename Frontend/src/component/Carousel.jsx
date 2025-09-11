import React from 'react';

const Carousel = () => {
  return (
    <div className="position-relative">
      {/* 🖼️ Carousel images only - search bar removed */}
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              className="d-block w-100"
              alt="Pizza"
              style={{ objectFit: 'cover', height: '400px' }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
              className="d-block w-100"
              alt="Burger"
              style={{ objectFit: 'cover', height: '400px' }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
              className="d-block w-100"
              alt="Dessert"
              style={{ objectFit: 'cover', height: '400px' }}
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;