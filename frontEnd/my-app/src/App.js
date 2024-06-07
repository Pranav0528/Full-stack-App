import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsPage from './components/TransactionsPage';
import Navigation from './components/Navigation';
import TransactionsBarChart from './components/TransactionsBarChart';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>My Product App</h1>
                    <Navigation />
                </header>
                <Routes> 
                    <Route path="/products" element={<ProductList />} /> 
                    <Route path="/statistics" element={<TransactionsStatistics />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/transactionsbar" element={<TransactionsBarChart />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
