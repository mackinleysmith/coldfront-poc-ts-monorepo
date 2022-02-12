import { Link, useParams } from "react-router-dom";

interface DonationOption {
  id: string;
  title: string;
}

const DONATION_OPTIONS: DonationOption[] = [
  {
    id: "regenerative-farming",
    title: "Regenerative Farming",
  },
  {
    id: "circular-economy",
    title: "Circular Economy",
  },
  {
    id: "new-food",
    title: "New Food",
  },
];

const DonationOptionsPage = () => {
  const { id } = useParams();

  return (
    <div className="hero text-center" style={{ marginTop: 300, maxWidth: 680 }}>
      <h1>What do you stand for?</h1>
      <p className="lead" style={{ marginBottom: 32 }}>
        When you buy a promo code, <strong>90% of the money</strong> goes
        towards entreprenuers creating climate solutions. The best part, you get
        to decide where the money goes.
      </p>
      <p
        className="lead"
        style={{ fontWeight: "bold", color: "blue", marginBottom: 32 }}
      >
        Select which innovation area you are most passionate about:
        <br />
      </p>
      <table className="table vertical-align">
        <tbody>
          {DONATION_OPTIONS.map((option) => (
            <tr key={option.id}>
              <td>{option.title}</td>
              <td>
                <Link
                  to={`/market/promos/${id}/checkout?donation_option=${option.id}`}
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

export default DonationOptionsPage;
