import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import Card from '../component/Card';
import Carousel from '../component/Carousel';

const Home = () => {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    console.log("1. Starting to load data...");
    setLoading(true);
    try {
  const response = await fetch("https://gofood-mern-pjgu.onrender.com/api/foodData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
      console.log("2. API response received:", response.status);
      const data = await response.json();
      console.log("3. Data parsed. Items:", data[0]?.length, "Categories:", data[1]?.length);
      setFoodItem(data[0]);
      setFoodCat(data[1]);
    } catch (err) {
      setError("Failed to load food items");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
      console.log("4. Finished loading data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredItems = foodItem.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{background: 'var(--surface)', minHeight: '100vh'}}>
      <Navbar />

      {/* Carousel with Search Bar Overlay */}
      <div className="position-relative mb-5">
        {/* Search Bar Centered Over Carousel */}
        <div className="position-absolute top-50 start-50 translate-middle z-2 w-100 d-flex justify-content-center">
          <form onSubmit={handleSearch} className="d-flex w-50 bg-dark rounded-4 shadow-soft p-3" style={{maxWidth: '520px', minWidth: '320px', border: '1px solid rgba(255,255,255,0.08)'}}>
            <input
              className="form-control me-2 search-elevated rounded-3"
              type="search"
              placeholder="Search delicious food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{fontSize: '1.1rem', background: 'rgba(24,24,27,0.85)', color: '#fff', border: 'none'}}
            />
            <button
              className="btn btn-brand fw-bold px-4"
              type="submit"
              style={{fontSize: '1.1rem'}}
            >
              Search
            </button>
          </form>
        </div>

        {/* Carousel Component (without its internal search bar) */}
        <Carousel />
      </div>

      {/* Content Area */}
      <div className="container mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : search.trim() ? (
          <>
            <div className="bg-dark rounded-4 shadow-soft p-4 mb-4">
              <h3 className="fw-bold mb-2 text-success">Search Results for "{search}"</h3>
              <hr />
              <div className="row">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-4">
                      <Card
                        foodName={item.name}
                        options={item.options?.[0] || {}}
                        imgsrc={item.img}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <span className="fs-5 text-muted">No results found for "{search}"</span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          foodCat.map(category => (
            <div key={category._id} className="mb-5">
              <div className="bg-dark rounded-4 shadow-soft p-4 mb-3 category-section" style={{borderLeft: '6px solid var(--brand-accent)', boxShadow: '0 6px 24px rgba(34,197,94,0.08)'}}>
                <h3 className="section-title fw-bold text-success mb-2" style={{fontSize: '2rem'}}>{category.CategoryName}</h3>
                <hr />
                <div className="row">
                  {foodItem
                    .filter(item => item.CategoryName === category.CategoryName)
                    .map(item => (
                      <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-4">
                        <Card
                          foodItem={item}
                          options={item.options?.[0] || {}}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))

        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;