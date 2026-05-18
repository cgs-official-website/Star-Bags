import { GiPartyPopper } from "react-icons/gi";
const OrderSummary = ({
  totalItemsCount,
  rawTotal,
  discountTotal,
  subTotal,
  gstTotal,
  finalTotal,
  isBillingPage = false,
  handleCheckout,
}) => {
  return (
    <div className="summary-box">
      <h3 className="summary-title">Order Summary</h3>
      <div className="summary-row">
        <span>Items ({totalItemsCount})</span>
        <span>₹{rawTotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Discount</span>
        <span className="discount-price">-₹{discountTotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Sub total</span>
        <span>₹{subTotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>GST Include (5%)</span>
        <span>₹{gstTotal.toFixed(2)}</span>
      </div>
      <div className="total-row">
        <span>Total</span>
        <span className="total-price">₹{finalTotal.toFixed(2)}</span>
      </div>
      {/* CART PAGE */}
      {!isBillingPage ? (
        <button onClick={handleCheckout} className="checkout-btn w-100">
          Proceed to checkout →
        </button>
      ) : (
        /* BILLING PAGE */
        discountTotal > 0 && (
          <h4 className="save-content btn w-100 text-center m-0">
            <GiPartyPopper /> Yay! you saved ₹{discountTotal.toFixed(2)}
          </h4>
        )
      )}
    </div>
  );
};

export default OrderSummary;
