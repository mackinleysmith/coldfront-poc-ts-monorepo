import { Link } from "react-router-dom";
import logo from "../components/cover.png";

const Home = () => (
  <div className="text-center hero" style={{ maxWidth: 550, marginTop: 200 }}>
    <img
      className="app-logo"
      src={logo}
      alt="React logo"
      width="550"
      style={{ maxWidth: 550, marginTop: -50 }}
    />
    <h1 className="mb-4" style={{ marginTop: -50 }}>
      Rewarding Climate Action
    </h1>
    <p className="lead">
      Help cool the planet. Earn Climate Action Points (CAPs). Save money.
      Welcome to the ColdFront.
      <br />
      <br />
      <Link className="btn btn-primary btn-lg" type="button" to="/market">
        Earn CAPs
      </Link>
      <Link className="btn btn-primary btn-lg ml-3" type="button" to="/market">
        Use CAPs
      </Link>
    </p>
    <p></p>
  </div>
);

export default Home;
