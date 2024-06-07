import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors'; 

dotenv.config();

const app = express();

app.use(cors());

const productSchema = new mongoose.Schema({
    id: { type: Number, index: true },
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.get('/data', async (req, res) => {
    try {
        const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = await response.json();

        // Clear the collection before inserting new data
        await Product.deleteMany({});

        // Insert data into MongoDB
        await Product.insertMany(data);

        res.json(data);
    } catch (error) {
        console.error('Error fetching or storing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/products', async (req, res) => {
    const { search, month, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    if (month) {
        const monthIndex = new Date(Date.parse(`${month} 1, 2021`)).getMonth();
        query.dateOfSale = {
            $gte: new Date(2021, monthIndex, 1),
            $lt: new Date(2021, monthIndex + 1, 1)
        };
    }

    const options = {
        skip: (page - 1) * perPage,
        limit: parseInt(perPage)
    };

    try {
        const products = await Product.find(query, null, options);
        const total = await Product.countDocuments(query);
        res.json({ products, total });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/sales-statistics', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
    }

    const monthIndex = new Date(Date.parse(`${month} 1, 2021`)).getMonth();
    const startOfMonth = new Date(2021, monthIndex, 1);
    const endOfMonth = new Date(2021, monthIndex + 1, 1);

    try {
        const totalSaleAmount = await Product.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const totalSoldItems = await Product.countDocuments({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }, sold: true });
        const totalNotSoldItems = await Product.countDocuments({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }, sold: false });

        res.json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/bar-chart-data', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
    }

    try {
        // Query the database to count the products in each price range for the selected month
        const barChartData = await Product.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: new Date(`${month} 1, 2021`),
                        $lt: new Date(`${month} 1, 2021`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$price', 100] }, then: '0 - 100' },
                                { case: { $lte: ['$price', 200] }, then: '101 - 200' },
                                { case: { $lte: ['$price', 300] }, then: '201 - 300' },
                            ],
                            default: 'Others'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    range: '$_id',
                    count: 1
                }
            }
        ]);

        res.json(barChartData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to my Express API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
