import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddBookForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // useMutation hook useCase (POST || PUT || PATCH || DELETE)
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => await axiosSecure.post(`/books`, payload),
    onSuccess: (data) => {
      console.log(data);
      // show toast
      toast.success("Book Added successfully");
      // navigate to my inventory page
      mutationReset();
      // Query key invalidate
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: (payload) => {
      console.log("I will post this data--->", payload);
    },
    onSettled: (data, error) => {
      console.log("I am from onSettled--->", data);
      if (error) console.log(error);
    },
    retry: 3,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, description, quantity, price, category, image } = data;
    const imageFile = image[0];

    try {
      const imageUrl = await imageUpload(imageFile);
      const bookData = {
        image: imageUrl,
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        category,
        seller: {
          image: user?.photoURL,
          name: user?.displayName,
          email: user?.email,
        },
      };
      await mutateAsync(bookData);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Book Name</span>
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="e.g. The Pragmatic Programmer"
          className="input input-bordered w-full"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Short description about the book"
          className="textarea textarea-bordered w-full"
          rows={4}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Quantity</span>
          </label>
          <input
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Minimum 1" },
            })}
            type="number"
            placeholder="e.g. 10"
            className="input input-bordered w-full"
          />
          {errors.quantity && (
            <span className="text-red-500 text-sm">
              {errors.quantity.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Price ($)</span>
          </label>
          <input
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Minimum 0" },
            })}
            type="number"
            step="0.01"
            placeholder="e.g. 19.99"
            className="input input-bordered w-full"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Category</span>
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          className="select select-bordered w-full"
          defaultValue=""
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Programming">Programming</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Science">Science</option>
          <option value="Business">Business</option>
        </select>
        {errors.category && (
          <span className="text-red-500 text-sm">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Cover Image</span>
        </label>
        <input
          {...register("image", { required: "Image is required" })}
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
        />
        {errors.image && (
          <span className="text-red-500 text-sm">{errors.image.message}</span>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        {isPending ? <TbFidgetSpinner className="animate-spin" /> : "Add Book"}
      </button>
    </form>
  );
};

export default AddBookForm;
