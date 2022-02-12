import { Route, Routes } from "react-router-dom";
import PromoCheckoutPage from "./checkout";
import DonationOptionsPage from "./donation_options";
import MarketListPage from "./list";
import PromoShowPage from "./show_promo";

const MarketApp = () => {
  return (
    <Routes>
      <Route path="/" element={<MarketListPage />} />
      <Route path="/promos/:id" element={<PromoShowPage />} />
      <Route
        path="/promos/:id/donation_options"
        element={<DonationOptionsPage />}
      />
      <Route path="/promos/:id/checkout" element={<PromoCheckoutPage />} />
    </Routes>
  );
};

export default MarketApp;
