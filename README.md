A simple app to manage 3D Blu Rays

# Getting Started

First, run the development server:

For the first time running the code for the backend
```bash
cd backend
go build 
```

After successfully running the backend for the first time run the following command
```bash
go build && ./3dblurays
```

In a new terminal run the following commands
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the home page.


To set up the database if one does not already exist with the correct name and location
Open [http://localhost:8080/debug/populate](http://localhost:8080/debug/populate) with your browser to populate the database.

Once the database is populated you can see the data on the fronend 

# Using the app
Open [http://localhost:3000](http://localhost:3000) with your browser to see the home page.

## Home Page
The home page shows a list of all the Blu Rays in the database. 
Clicking on a Blu Ray will take you to a page where you can see more information about the Blu Ray.

## Series Page
The series page shows a list of all the series in the database.
Clicking on a series will take you to a page where you can see all the Blu Rays in that series.

### Blu Rays In Series Page
The Blu Rays In Series page shows a list of all the Blu Rays in the series.
Clicking on a Blu Ray will take you to a page where you can see more information about the Blu Ray.

## Add Page
The add page allows you to add a new Blu Ray to the database.

## 4K Films Page
The 4K Films page shows a list of all the Blu Rays that are 4K Films.
Clicking on a Blu Ray will take you to a page where you can see more information about the Blu Ray.

## Steelbook Films Page
The Steelbook Films page shows a list of all the Blu Rays that are Steelbook editions.
Clicking on a Blu Ray will take you to a page where you can see more information about the Blu Ray.

# Deleting a Blu Ray
To delete a Blu Ray can be done by multiple methods:

1. Clicking on the delete button on the page for the Blu Ray
2. Clicking on the delete button on the page for the series
3. Clicking on the delete button on the page for the home page
4. Clicking on the delete button on the page for the series page

# Adding a Blu Ray
To add a Blu Ray naviaget to the Add page and fill out the form and press Submit. 
It will then be added to the database and will appear in the app. 