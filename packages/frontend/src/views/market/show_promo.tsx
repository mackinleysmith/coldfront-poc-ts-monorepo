import { Link, useParams } from "react-router-dom";
import { PROMOS_BY_ID } from "../../data/promos";

const PromoShowPage = () => {
  const params = useParams();
  const id = params.id!;
  const promo = PROMOS_BY_ID[id];

  return (
    <div className="hero text-center" style={{ marginTop: 300, maxWidth: 800 }}>
      <h1>Confirm transaction</h1>

      <p className="lead">
        Spend ${promo.price_in_caps} in CAPs to receive {promo.title} your
        purchase at {promo.supplier}?
        <br />
        <br />
        <Link
          className="btn btn-success btn-lg"
          type="button"
          to={`/market/promos/${promo.id}/causes`}
        >
          Select a cause
        </Link>
        <Link className="btn ml-2 btn-lg" type="button" to="/market">
          Go back
        </Link>
      </p>
    </div>
  );
};

export default PromoShowPage;
