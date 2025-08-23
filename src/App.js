import { Route, Routes } from 'react-router-dom';
import ServicesPage from './components/Pages/ServicesPage';
import ServicesDetailsPage from './components/Pages/ServicesDetailsPage';
import ContactPage from './components/Pages/ContactPage';
import ErrorPage from './components/Pages/ErrorPage';
import ProductDetailsPage from './components/Pages/ProductDetailsPage';
import ProductsPage from './components/Pages/ProductsPage';
import HomePage from './components/Pages/HomePage';
import Layout from './components/Layout';
import LegalNoticePage from './components/Pages/LegalNoticePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route
              path="products/:slug"
              element={<ProductDetailsPage/>}></Route>
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:category" element={<ServicesPage />} />
          <Route path="services/:category/:slug" element={<ServicesDetailsPage />} />
          <Route path="services/services-details/:id" element={<ServicesDetailsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="legalnotice" element={<LegalNoticePage />} />
        </Route>
        <Route
          path="/"
          element={<Layout headerVariant="cs-site_header_full_width" />}
        >
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
