import { Route, Routes } from "react-router-dom";
import PromoCheckoutPage from "./checkout";
import CausesPage from "./causes";
import MarketListPage from "./list";
import PromoShowPage from "./show_promo";

const MarketApp = () => {
  return (
    <Routes>
      <Route path="/" element={<MarketListPage />} />
      <Route path="/promos/:id" element={<PromoShowPage />} />
      <Route path="/promos/:id/causes" element={<CausesPage />} />
      <Route
        path="/promos/:id/with_cause/:cause_id/checkout"
        element={<PromoCheckoutPage />}
      />
    </Routes>
  );
};

export default MarketApp;
