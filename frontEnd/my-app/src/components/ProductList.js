import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10; // Number of items per page
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products', {
                params: { search, month, page, perPage }
            });
            setProducts(response.data.products);
            setTotalPages(Math.ceil(response.data.total / perPage));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, month, page]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); 
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div>
            <h1>Product List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product._id} className="card">
                        <img src={product.image} alt={product.title} />
                        <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">Description: {product.description}</p>
                            <p className="card-text">Price: ${product.price}</p>
                            <p className="card-text">Category: {product.category}</p>
                            <p className="card-text">Sold: {product.sold ? 'Yes' : 'No'}</p>
                            <p className="card-text">Date of Sale: {new Date(product.dateOfSale).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button disabled={page === 1 || totalPages === 0} onClick={() => handlePageChange(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages || totalPages === 0} onClick={() => handlePageChange(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default ProductList;
