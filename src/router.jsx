import { createHashRouter } from 'react-router-dom';

import FrontendLayout from './layout/FrontendLayout';
import Cart from './views/front/Cart';
import Home from './views/front/Home';
import Products from './views/front/Products';
import SingleProduct from './views/front/SingleProduct';
import NotFound from './views/front/NotFound';
import Checkout from './views/front/CheckOut';
import Login from './views/front/Login';

export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true, // Home is the default route
        element: <Home />,
      },
      {
        path: 'singleproduct/:id',
        element: <SingleProduct />,
      },
      { path: 'products', element: <Products /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
