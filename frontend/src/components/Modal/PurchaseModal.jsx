import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";

const PurchaseModal = ({ closeModal, isOpen, book }) => {
  const { user } = useAuth();
  const { _id, name, category, price, description, image, seller } = book || {};
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const paymentInfo = {
      bookId: _id,
      name,
      category,
      price,
      description,
      image,
      quantity: 1,
      seller,
      customer: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      },
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/create-checkout-session`,
      paymentInfo,
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      },
    );
    window.location.href = data.url;
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 focus:outline-none"
      onClose={closeModal}
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md p-8 rounded-2xl bg-white/90">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Confirm Purchase</h3>
              <p className="text-sm text-gray-600 mt-2">
                You will be redirected to payment.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
