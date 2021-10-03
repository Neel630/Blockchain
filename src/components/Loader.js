import React from "react";
export default () => {
  return (
    <div
      class="spinner-border text-info"
      role="status"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
      }}
    >
      <span class="sr-only">Loading...</span>
    </div>
  );
};
