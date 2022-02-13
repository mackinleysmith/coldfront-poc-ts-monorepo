import { Link, useParams } from "react-router-dom";
import { CAUSES } from "../../data/causes";

const CausesPage = () => {
  const { id } = useParams();

  return (
    <div className="hero text-center" style={{ marginTop: 300, maxWidth: 780 }}>
      <h1>Which climate cause matters most to you?</h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        You pick the climate category. ColdFront will fund innovation to match.
        <br />
        <strong>90% of every dollar</strong> goes to climate solutions.
      </p>
      {/* <p
        className="lead"
        style={{ fontWeight: "bold", color: "blue", marginBottom: 32 }}
      >
        Select which innovation area you are most passionate about:
        <br />
      </p> */}
      <table className="table vertical-align">
        <tbody>
          {CAUSES.map((cause) => (
            <tr key={cause.id}>
              <td>{cause.title}</td>
              <td>
                <Link
                  to={`/market/promos/${id}/with_cause/${cause.id}/checkout`}
                >
                  Support it!
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CausesPage;
