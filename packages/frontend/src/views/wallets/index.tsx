import { Route, Routes } from "react-router-dom";
import WalletsListPage from "./list";
import { NewWalletPage } from "./new";
import { WalletPage } from "./show";

const WalletsApp = () => {
  return (
    <Routes>
      <Route path="/" element={<WalletsListPage />} />
      <Route path="/new" element={<NewWalletPage />} />
      <Route path="/:id" element={<WalletPage />} />
    </Routes>
  );
};

export default WalletsApp;
