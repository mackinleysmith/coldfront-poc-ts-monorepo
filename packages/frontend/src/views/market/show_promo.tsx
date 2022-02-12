import { Link, useParams } from "react-router-dom";
import { PROMOS_BY_ID } from "../../data/promos";

const PromoShowPage = () => {
  const params = useParams();
  const id = params.id!;
  const promo = PROMOS_BY_ID[id];

  return (
    <div className="hero text-center" style={{ marginTop: 300, maxWidth: 800 }}>
      <h1>
        <strong>{promo.supplier}:</strong> {promo.title}
      </h1>

      <p className="lead">
        You sure you wanna buy this shit?
        <br />
        <br />
        <Link
          className="btn btn-success btn-lg"
          type="button"
          to={`/market/promos/${promo.id}/donation_options`}
        >
          Yeah, buy that shit!
        </Link>
        <Link className="btn ml-2 btn-lg" type="button" to="/market">
          Nah nevermind
        </Link>
      </p>
    </div>
  );
};

export default PromoShowPage;
