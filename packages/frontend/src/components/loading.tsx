import React from "react";
const loadingImg =
  "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";

const Loading = () => (
  <div className="spinner">
    <img src={loadingImg} alt="Loading..." width={100} />
  </div>
);

export default Loading;