export const ScrollBanner = () => {
  return (
    <div
      className="p-2  d-flex align-items-center"
      style={{
        color: "var(--white-color)",
        background: "var(--levender)",
        fontSize: "1.35rem",
      }}
    >
      <marquee scrollamount="13">
        Fashion meets function — grab your Star Bag today.”
      </marquee>
    </div>
  );
};
