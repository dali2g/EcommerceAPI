const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./db.js');
const fs = require('fs');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Insert data into products collection
app.get('/insert-data', async (req, res) => {
  const productsCollection = await connectDB();

  // Read data.json file
  const data = fs.readFileSync('data.json', 'utf8');
  console.log("Data read from file:", data);

  // Parse data as JSON
  const jsonData = JSON.parse(data);
  console.log("Parsed JSON data:", jsonData);

  // Process each object and insert into database
  for (let obj of jsonData) {
    // Create document to insert into database
    const doc = {
      category: obj.category ? obj.category.trim() : '',
      link: obj.link ? obj.link.trim() : '',
      name: obj.name ? obj.name.trim() : '',
      price: obj.price ? obj.price.trim() : '',
      image: obj.image ? obj.image.trim() : '',
      ref: obj.ref ? obj.ref.trim() : '',
      description: obj.description ? obj.description.trim() : ''
    };
    // Insert document into database
    const result = await productsCollection.insertOne(doc);
    console.log("Document inserted:", result.ops);
  }
  res.send('Data inserted into database');
});
// Get all products from products collection
app.get('/products', async (req, res) => {
  const productsCollection = await connectDB();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const products = await productsCollection.find({}).skip(skip).limit(limit).toArray();
  const count = await productsCollection.countDocuments({});
  res.json({
    products,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
