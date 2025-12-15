import './ExplorePage.css';

const ExplorePage = () => {
    return (
        <div className="explore-page">
            <div className="container">
                <div className="explore-header">
                    <h1>Explore Wildlife Photography</h1>
                    <p>Browse through our collection of stunning wildlife photos from Sri Lanka</p>
                </div>

                <div className="explore-filters">
                    <div className="filter-group">
                        <label>Category</label>
                        <select className="filter-select">
                            <option>All Categories</option>
                            <option>Mammals</option>
                            <option>Birds</option>
                            <option>Reptiles</option>
                            <option>Landscapes</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select className="filter-select">
                            <option>Newest</option>
                            <option>Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Price Range</label>
                        <select className="filter-select">
                            <option>All Prices</option>
                            <option>Under $100</option>
                            <option>$100 - $200</option>
                            <option>Over $200</option>
                        </select>
                    </div>
                </div>

                <div className="explore-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                        <div key={item} className="explore-card glass hover-lift">
                            <div className="explore-image-wrapper">
                                <div className="explore-image-placeholder">
                                    <span>Photo {item}</span>
                                </div>
                            </div>
                            <div className="explore-info">
                                <h3>Wildlife Photo {item}</h3>
                                <p className="explore-photographer">by Photographer Name</p>
                                <div className="explore-footer">
                                    <span className="explore-price">${99 + item * 10}</span>
                                    <button className="btn btn-primary btn-sm">View</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="explore-pagination">
                    <button className="btn btn-ghost">Previous</button>
                    <div className="pagination-numbers">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <span>...</span>
                        <button className="page-btn">10</button>
                    </div>
                    <button className="btn btn-ghost">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
