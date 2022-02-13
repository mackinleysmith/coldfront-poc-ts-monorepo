import { Link } from "react-router-dom";
import logo from "../components/cover.png";

const Home = () => (
  <div className="text-center hero" style={{ maxWidth: 700, marginTop: 200 }}>
    <img
      className="app-logo"
      src={logo}
      alt="React logo"
      width="550"
      style={{ maxWidth: 550, marginTop: -50, width: "100%" }}
    />
    <h1 className="mb-4" style={{ marginTop: -56, fontWeight: 300 }}>
      Help the planet, get rewarded.
    </h1>
    <p className="lead">
      ColdFront is a new model for climate action. We sell promo codes from
      brands passionate about decarbonization. Ninety-percent of proceeds go
      directly to entrepreneurs inventing climate solutions.
      <br />
      <br />
      <Link className="btn btn-primary btn-lg" type="button" to="/market">
        See Deals
      </Link>
      <Link
        className="btn btn-outline-primary btn-lg ml-3"
        type="button"
        to="/"
        onClick={() => alert("Coming soon!")}
      >
        Earn CAPs
      </Link>
    </p>
    <p></p>
  </div>
);

export default Home;
