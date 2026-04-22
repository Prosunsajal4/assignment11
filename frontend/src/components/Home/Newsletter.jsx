import { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setEmail("");
    toast.success("Subscribed — thanks!");
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Join our Newsletter</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Weekly book picks and exclusive deals.</p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold disabled:opacity-60"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
