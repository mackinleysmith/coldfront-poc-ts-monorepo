import { FC, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const NewWalletPage: FC = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const onNameChange = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const onAddressChange = (e: FormEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = await getAccessTokenSilently();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const response = await fetch(`${serverUrl}/api/wallets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        address,
      }),
    });

    const { id } = await response.json();
    setIsSubmitting(false);
    navigate(`/wallets/${id}`);
  };

  return (
    <div className="mb-5">
      <h1>
        New Wallet
        <Link
          className="btn btn-outline-secondary float-right mt-1"
          type="button"
          to="/wallets"
        >
          Back
        </Link>
      </h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            className="form-control"
            id="name"
            required
            onChange={onNameChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            className="form-control"
            id="address"
            required
            onChange={onAddressChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
