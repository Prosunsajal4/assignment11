import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { Link } from "react-router-dom";

const MyWishlist = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { mutateAsync: removeFromWishlist, isPending: removing } = useMutation({
    mutationFn: async (bookId) =>
      axiosSecure.delete(`/wishlist?email=${user.email}&bookId=${bookId}`),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <Heading title="My Wishlist" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.length === 0 && <p>No books in wishlist.</p>}
        {wishlist.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded shadow p-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 hover:shadow-lg transition-all duration-200 border border-transparent"
          >
            <Link
              to={`/book/${book._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
              className="flex flex-col items-center"
            >
              <img
                src={book.image}
                alt={book.name}
                className="h-40 w-32 object-cover mb-2 rounded"
              />
              <h3 className="font-bold text-black text-lg mb-1">{book.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{book.category}</p>
              <span className="font-semibold text-primary mb-2">
                ${book.price}
              </span>
            </Link>
            <button
              className="btn btn-outline btn-error btn-sm"
              disabled={removing}
              onClick={async () => {
                await removeFromWishlist(book._id);
                // Invalidate and refetch wishlist
                queryClient.invalidateQueries({
                  queryKey: ["wishlist", user?.email],
                });
              }}
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default MyWishlist;
