import { Link } from "react-router-dom";
import { PROMOS } from "../../data/promos";
import logo from "../../components/cover.png";

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
      <h1
        className="text-center"
        style={{
          marginTop: -90,
          marginLeft: 138,
          fontWeight: "bold",
          color: "graytext",
        }}
      >
        <small>The Marketplace</small>
      </h1>
      <table className="table mt-5 mx-auto" style={{ maxWidth: 550 }}>
        <tbody>
          {PROMOS.map((promo) => (
            <tr key={promo.id}>
              <td>
                <strong>{promo.supplier}</strong>
              </td>
              <td className="text-center">{promo.title}</td>
              <td className="text-center">{promo.price_in_caps} CAPs</td>
              <td className="text-center">
                <Link
                  className="btn btn-success btn-sm"
                  type="button"
                  to={`/market/promos/${promo.id}`}
                  style={{ margin: "-6px 0", position: "relative", top: -2 }}
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
