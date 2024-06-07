import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/statistics">Statistics</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/transactionsbar">Bar Chart</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;
