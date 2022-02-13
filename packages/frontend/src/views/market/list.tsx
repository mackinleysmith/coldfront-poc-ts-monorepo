import { Link } from "react-router-dom";
import { PROMOS } from "../../data/promos";
import logo from "../../components/logo_market.png";

const MarketListPage = () => {
  return (
    <div className="py-5">
      <div className="text-center">
        <img
          className="app-logo"
          src={logo}
          alt="React logo"
          width="550"
          style={{ maxWidth: 550, marginTop: 102, width: "100%" }}
        />
      </div>
      <table
        className="table mx-auto vertical-align text-center"
        style={{ maxWidth: 550 }}
      >
        <tbody>
          {PROMOS.map((promo) => (
            <tr key={promo.id}>
              <td className="text-left">
                <strong>{promo.supplier}</strong>
              </td>
              <td>{promo.title}</td>
              <td>for</td>
              <td>${promo.price_in_caps} in CAPs</td>
              <td>
                <Link
                  className="btn btn-success btn-sm"
                  type="button"
                  to={`/market/promos/${promo.id}`}
                  // style={{ margin: "-6px 0", position: "relative", top: -2 }}
                >
                  Unlock Code
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketListPage;
