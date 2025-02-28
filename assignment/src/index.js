import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductDetails from './components/ProductDetails';
import Products from './components/Products';

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {path:"/", element:<Products/>},
      {path:"/details/:id", element:<ProductDetails/>}
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
