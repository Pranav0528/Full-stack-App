import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

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
        setPage(1); // Reset page to 1 when search term changes
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
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Date of Sale</th>
                        <th>Image</th> {/* New column for the image */}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.sold ? 'Yes' : 'No'}</td>
                            <td>{new Date(product.dateOfSale).toLocaleDateString()}</td>
                            <td><img src={product.image} alt={product.title} /></td> {/* Image column */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button disabled={page === 1 || totalPages === 0} onClick={() => handlePageChange(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages || totalPages === 0} onClick={() => handlePageChange(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default ProductList;
