import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ReviewForm from "../Book/ReviewForm";

const ReviewModal = ({ isOpen, closeModal, bookId, onReviewed }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform rounded-xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-lg font-semibold">
                  Write a Review
                </Dialog.Title>
                <div className="mt-4">
                  <ReviewForm
                    bookId={bookId}
                    onReviewAdded={() => {
                      if (onReviewed) onReviewed();
                      closeModal();
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReviewModal;
