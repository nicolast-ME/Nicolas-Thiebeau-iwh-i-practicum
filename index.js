// Importing required modules
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file

const app = express();

// Set up pug as the templating engine
app.set('view engine', 'pug');

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route 1: Homepage to fetch and display custom object data
app.get("/", async (req, res) => {
  const customObjectUrl = 'https://api.hubspot.com/crm/v3/objects/2-49265538';  // Replace 'it_assets' with your custom object
  const headers = {
      Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
      const response = await axios.get(customObjectUrl, { headers });
      const customObjects = response.data.results;

      res.render('homepage', { title: 'Custom Object List', customObjects: customObjects });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving data from HubSpot API');
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data.
// Route 2: Render the form to create or update custom object data

app.get("/update-cobj", (req, res) => {
  res.render('update_form', { title: 'Create or Update Custom Object' });
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here

// Route 3: Handle form submission to create or update custom object data
app.post("/update-cobj", async (req, res) => {
  const { name, make, model, serial_number, purchase_date, warranty_end_date, description } = req.body;  // Get form data

  // Format the date fields to ensure they are in YYYY-MM-DD format (HubSpot API requires ISO 8601 format)
  const formattedPurchaseDate = new Date(purchase_date).toISOString().split('T')[0];
  const formattedWarrantyEndDate = new Date(warranty_end_date).toISOString().split('T')[0];

  // Create the custom object payload
  const newCustomObject = {
    properties: {
      name: name,
      make: make,
      model: model,
      serial_number: serial_number,
      purchase_date: formattedPurchaseDate,  // Use formatted date
      warranty_end_date: formattedWarrantyEndDate,  // Use formatted date
      description: description
    }
  };

  // Replace with the correct custom object API URL
  const createCustomObjectUrl = 'https://api.hubspot.com/crm/v3/objects/2-49265538';  // Replace 'it_assets' with your custom object name
  const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    // Make a POST request to create a new custom object
    const response = await axios.post(createCustomObjectUrl, newCustomObject, { headers });

    // Redirect to the homepage after successful creation
    res.redirect('/');
  } catch (error) {
    console.error("Error creating custom object:", error.response ? error.response.data : error.message);
    res.status(500).send('Error creating custom object');
  }
});
