import { useState } from "react";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";
const CheckoutPage = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const checkOut = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/orders", {
        shippingAddress: {
          street: street,
          city: city,
          state: state,
          zip: zip,
        },
      });
      const orderId = res.data._id;
      toast.success("Order created!");
      //payment process
      const paymentRes = await api.post("/payment/initiate", { orderId });
      const {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        hash,
        payuUrl,
      } = paymentRes.data;

      // step 3 — create form and submit to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payuUrl;

      const fields = {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        hash,
        surl: "https://ecommerce-backend-0gl4.onrender.com/api/payment/success",
        furl: "https://ecommerce-backend-0gl4.onrender.com/api/payment/success",
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={checkOut} className="flex flex-col gap-4">
          <input
            type="text"
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
            placeholder="Street"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            placeholder="City"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
            }}
            placeholder="State"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value);
            }}
            placeholder="Zip"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white
                     py-2 rounded-lg text-sm font-medium transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
