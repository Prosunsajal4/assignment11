import { useState } from "react";

import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UpdateBookModal = ({ isOpen, closeModal, book }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (book) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: book?.title || "",
        author: book?.author || "",
        category: book?.category || "",
        price: book?.price ?? "",
        quantity: book?.quantity ?? "",
        description: book?.description || "",
        image: book?.image || "",
      });
    }
  }, [book]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosSecure.patch(`/books/${book?._id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      closeModal();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      description: formData.description.trim(),
      image: formData.image.trim(),
    };
    await mutateAsync(payload);
  };

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
              <Dialog.Panel className="w-full max-w-xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-lg font-semibold">
                  Update Book
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Title</span>
                      </div>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Author</span>
                      </div>
                      <input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Category</span>
                      </div>
                      <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </label>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Price</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Quantity</span>
                      </div>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control md:col-span-2">
                      <div className="label">
                        <span className="label-text">Image URL</span>
                      </div>
                      <input
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </label>
                    <label className="form-control md:col-span-2">
                      <div className="label">
                        <span className="label-text">Description</span>
                      </div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered"
                        rows={3}
                      />
                    </label>
                  </div>

                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn"
                      onClick={closeModal}
                      disabled={isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isPending}
                    >
                      {isPending ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateBookModal;
