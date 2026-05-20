import { GiPartyPopper } from "react-icons/gi";

const OrderSummary = ({
  totalItemsCount,
  rawTotal,        // Sum of (oldPrice * qty)
  discountTotal,   // Sum of product price savings
  subTotal,        // total items value after standard retail discount deduction
  couponDiscount,  // Value computed from applied coupon code percentage
  couponPercentageLabel,
  gstTotal,
  finalTotal,
  isBillingPage = false,
  handleCheckout,
}) => {
  return (
    <div className="summary-box">
      <h3 className="summary-title">Order Summary</h3>
      <div className="summary-row">
        <span>Items Price ({totalItemsCount})</span>
        <span>₹{rawTotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Discount</span>
        <span className="discount-price">-₹{discountTotal.toFixed(2)}</span>
      </div>

      {couponDiscount > 0 && (
        <div className="summary-row coupon-discount-row">
          <span className="fw-bold text-success">Coupon Applied ({couponPercentageLabel})</span>
          <span className="text-success fw-bold">-₹{couponDiscount.toFixed(2)}</span>
        </div>
      )}

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
      
      {!isBillingPage ? (
        <button onClick={handleCheckout} className="checkout-btn w-100">
          Proceed to checkout →
        </button>
      ) : (
        (discountTotal > 0 || couponDiscount > 0) && (
          <h4 className="save-content btn w-100 text-center m-0 mt-3">
            <GiPartyPopper /> Yay! you saved ₹{(discountTotal + couponDiscount).toFixed(2)}
          </h4>
        )
      )}
    </div>
  );
};

export default OrderSummary;