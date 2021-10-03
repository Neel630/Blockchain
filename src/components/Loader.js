import React from "react";
export default () => {
  return (
    <div
      className="spinner-border text-info"
      role="status"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
