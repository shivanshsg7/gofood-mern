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
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setFoodItem(data[0]);
      setFoodCat(data[1]);
    } catch (err) {
      setError("Failed to load food items");
      console.error(err);
    } finally {
      setLoading(false);
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
    <div>
      <Navbar />

      {/* Carousel with Search Bar Overlay */}
      <div className="position-relative">
        {/* Search Bar Centered Over Carousel */}
        <div className="position-absolute top-50 start-50 translate-middle z-1 w-100 d-flex justify-content-center">
          <form onSubmit={handleSearch} className="d-flex w-50">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search food items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            />
            <button
              className="btn btn-outline-light"
              type="submit"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
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
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : search.trim() ? (
          <>
            <h3>Search Results for "{search}"</h3>
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
                <div className="text-center">
                  No results found for "{search}"
                </div>
              )}
            </div>
          </>
        ) : (
          foodCat.map(category => (
            <div key={category._id} className="mb-5">
              <h3>{category.CategoryName}</h3>
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
          ))

        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;