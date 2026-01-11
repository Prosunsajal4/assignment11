require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");
const port = process.env.PORT || 3000;
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
// middleware
app.use(
  cors({
    origin: [
      "https://assignement11-8c757.web.app",
      "https://assignement11-8c757.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const db = client.db("bookcourierDB");
    const booksCollection = db.collection("books");
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");
    const sellerRequestsCollection = db.collection("sellerRequests");
    // --- Wishlist Collection ---
    const wishlistCollection = db.collection("wishlist");
    // --- Reviews Collection ---
    const reviewsCollection = db.collection("reviews");
    // --- Wishlist Endpoints ---
    // Add to wishlist
    app.post("/wishlist", verifyJWT, async (req, res) => {
      const { email, bookId } = req.body;
      if (!email || !bookId)
        return res.status(400).send({ message: "Missing email or bookId" });
      const exists = await wishlistCollection.findOne({ email, bookId });
      if (exists)
        return res.status(409).send({ message: "Already wishlisted" });
      await wishlistCollection.insertOne({ email, bookId });
      res.send({ success: true });
    });

    // Remove from wishlist
    app.delete("/wishlist", verifyJWT, async (req, res) => {
      const { email, bookId } = req.query;
      if (!email || !bookId)
        return res.status(400).send({ message: "Missing email or bookId" });
      await wishlistCollection.deleteOne({ email, bookId });
      res.send({ success: true });
    });

    // Get user's wishlist
    app.get("/wishlist", verifyJWT, async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ message: "Missing email" });
      const wishlistedBooks = await wishlistCollection
        .find({ email })
        .toArray();
      // Get book details for each wishlisted book
      const bookIds = wishlistedBooks.map((w) => new ObjectId(w.bookId));
      const books = await booksCollection
        .find({ _id: { $in: bookIds } })
        .toArray();
      res.send(books);
    });

    // Check if book is wishlisted
    app.get("/wishlist/check", verifyJWT, async (req, res) => {
      const { email, bookId } = req.query;
      if (!email || !bookId)
        return res.status(400).send({ message: "Missing email or bookId" });
      const exists = await wishlistCollection.findOne({ email, bookId });
      res.send({ wishlisted: !!exists });
    });

    // --- Review Endpoints ---
    // Add review
    app.post("/reviews", verifyJWT, async (req, res) => {
      const { bookId, email, rating, review } = req.body;
      if (!bookId || !email || !rating)
        return res.status(400).send({ message: "Missing fields" });
      // Only allow one review per user per book
      const exists = await reviewsCollection.findOne({ bookId, email });
      if (exists) return res.status(409).send({ message: "Already reviewed" });
      await reviewsCollection.insertOne({ bookId, email, rating, review });
      res.send({ success: true });
    });

    // Get reviews for a book
    app.get("/reviews", async (req, res) => {
      const { bookId } = req.query;
      if (!bookId) return res.status(400).send({ message: "Missing bookId" });
      const reviews = await reviewsCollection.find({ bookId }).toArray();
      res.send(reviews);
    });

    // Check if user ordered a book (for review eligibility)
    app.get("/orders/check", verifyJWT, async (req, res) => {
      const { email, bookId } = req.query;
      if (!email || !bookId)
        return res.status(400).send({ message: "Missing email or bookId" });
      const order = await ordersCollection.findOne({ customer: email, bookId });
      res.send({ ordered: !!order });
    });

    // role middlewares
    const verifyADMIN = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });
      if (user?.role !== "admin")
        return res
          .status(403)
          .send({ message: "Admin only Actions!", role: user?.role });

      next();
    };
    const verifySELLER = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await usersCollection.findOne({ email });
      if (user?.role !== "seller")
        return res
          .status(403)
          .send({ message: "Seller only Actions!", role: user?.role });

      next();
    };

    // Save a book data in db
    app.post("/books", verifyJWT, verifySELLER, async (req, res) => {
      const bookData = req.body;
      console.log(bookData);
      const result = await booksCollection.insertOne(bookData);
      res.send(result);
    });

    // get all books from db
    app.get("/books", async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    // get book details from db
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // delete a book (seller only, must own the book)
    app.delete("/books/:id", verifyJWT, verifySELLER, async (req, res) => {
      const id = req.params.id;
      // Ensure the authenticated seller owns this book
      const book = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (!book) return res.status(404).send({ message: "Book not found" });
      if (book?.seller?.email !== req.tokenEmail) {
        return res
          .status(403)
          .send({ message: "You can delete only your own books" });
      }
      const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: result.deletedCount === 1 });
    });

    // update a book (seller only, must own the book)
    app.patch("/books/:id", verifyJWT, verifySELLER, async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const book = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (!book) return res.status(404).send({ message: "Book not found" });
      if (book?.seller?.email !== req.tokenEmail) {
        return res
          .status(403)
          .send({ message: "You can update only your own books" });
      }
      const result = await booksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
      res.send({ success: result.modifiedCount === 1 });
    });

    // Payment endpoints
    app.post("/create-checkout-session", async (req, res) => {
      const paymentInfo = req.body;
      console.log(paymentInfo);
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: paymentInfo?.name,
                description: paymentInfo?.description,
                images: [paymentInfo.image],
              },
              unit_amount: paymentInfo?.price * 100,
            },
            quantity: paymentInfo?.quantity,
          },
        ],
        customer_email: paymentInfo?.customer?.email,
        mode: "payment",
        metadata: {
          bookId: paymentInfo?.bookId,
          customer: paymentInfo?.customer.email,
        },
        success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/book/${paymentInfo?.bookId}`,
      });
      res.send({ url: session.url });
    });

    app.post("/payment-success", async (req, res) => {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const book = await booksCollection.findOne({
        _id: new ObjectId(session.metadata.bookId),
      });
      const order = await ordersCollection.findOne({
        transactionId: session.payment_intent,
      });

      if (session.status === "complete" && book && !order) {
        // save order data in db
        const orderInfo = {
          bookId: session.metadata.bookId,
          transactionId: session.payment_intent,
          customer: session.metadata.customer,
          status: "pending",
          seller: book.seller,
          name: book.name,
          category: book.category,
          quantity: 1,
          price: session.amount_total / 100,
          image: book?.image,
        };
        const result = await ordersCollection.insertOne(orderInfo);
        // update book quantity
        await booksCollection.updateOne(
          {
            _id: new ObjectId(session.metadata.bookId),
          },
          { $inc: { quantity: -1 } }
        );

        return res.send({
          transactionId: session.payment_intent,
          orderId: result.insertedId,
        });
      }
      res.send({
        transactionId: session.payment_intent,
        orderId: order?._id,
      });
    });

    // get all orders for a customer by email
    app.get("/my-orders", verifyJWT, async (req, res) => {
      const result = await ordersCollection
        .find({ customer: req.tokenEmail })
        .toArray();
      res.send(result);
    });

    // cancel (delete) an order by id (customer only)
    app.delete("/orders/:id", verifyJWT, async (req, res) => {
      const orderId = req.params.id;
      // Only allow the customer who placed the order to delete it
      const order = await ordersCollection.findOne({
        _id: new ObjectId(orderId),
      });
      if (!order) return res.status(404).send({ message: "Order not found" });
      if (order.customer !== req.tokenEmail) {
        return res
          .status(403)
          .send({ message: "You can only cancel your own orders" });
      }
      const result = await ordersCollection.deleteOne({
        _id: new ObjectId(orderId),
      });
      // Optionally, you could also increment the book quantity back if needed
      res.send({ success: result.deletedCount === 1 });
    });

    // ADMIN: get all orders
    app.get("/admin/orders", verifyJWT, verifyADMIN, async (req, res) => {
      const orders = await ordersCollection.find().toArray();
      res.send(orders);
    });

    // ADMIN: update order status
    app.patch("/orders/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const id = req.params.id;
      const { status } = req.body || {};
      if (!status) return res.status(400).send({ message: "Missing status" });
      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send({ success: result.modifiedCount === 1 });
    });

    // get all orders for a seller by email
    app.get(
      "/manage-orders/:email",
      verifyJWT,
      verifySELLER,
      async (req, res) => {
        const email = req.params.email;

        const result = await ordersCollection
          .find({ "seller.email": email })
          .toArray();
        res.send(result);
      }
    );

    // get all books for a seller by email
    app.get(
      "/my-inventory/:email",
      verifyJWT,
      verifySELLER,
      async (req, res) => {
        const email = req.params.email;

        const result = await booksCollection
          .find({ "seller.email": email })
          .toArray();
        res.send(result);
      }
    );

    // save or update a user in db
    app.post("/user", async (req, res) => {
      const userData = req.body;
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      // Assign roles based on email
      if (userData.email === "prosunsajal123@gmail.com") {
        userData.role = "admin";
      } else if (userData.email === "admin@bookcourier.com") {
        userData.role = "admin";
      } else if (userData.email === "seller@bookcourier.com") {
        userData.role = "seller";
      } else if (userData.email === "customer@bookcourier.com") {
        userData.role = "customer";
      } else {
        userData.role = "customer"; // Default role for new users
      }

      const query = {
        email: userData.email,
      };

      const alreadyExists = await usersCollection.findOne(query);
      console.log("User Already Exists---> ", !!alreadyExists);

      if (alreadyExists) {
        console.log("Updating user info......");
        const updateFields = {
          last_loggedIn: new Date().toISOString(),
        };
        // Update role for demo accounts
        if (userData.email === "prosunsajal123@gmail.com") {
          updateFields.role = "admin";
        } else if (userData.email === "admin@bookcourier.com") {
          updateFields.role = "admin";
        } else if (userData.email === "seller@bookcourier.com") {
          updateFields.role = "seller";
        } else if (userData.email === "customer@bookcourier.com") {
          updateFields.role = "customer";
        }
        const result = await usersCollection.updateOne(query, {
          $set: updateFields,
        });
        return res.send(result);
      }

      console.log("Saving new user info......");
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // get a user's role
    app.get("/user/role", verifyJWT, async (req, res) => {
      const result = await usersCollection.findOne({ email: req.tokenEmail });
      res.send({ role: result?.role });
    });

    // save become-seller request
    app.post("/become-seller", verifyJWT, async (req, res) => {
      const email = req.tokenEmail;
      const alreadyExists = await sellerRequestsCollection.findOne({ email });
      if (alreadyExists)
        return res
          .status(409)
          .send({ message: "Already requested, wait koro." });

      const result = await sellerRequestsCollection.insertOne({ email });
      res.send(result);
    });

    // get all seller requests for admin
    app.get("/seller-requests", verifyJWT, verifyADMIN, async (req, res) => {
      const result = await sellerRequestsCollection.find().toArray();
      res.send(result);
    });

    // get all users for admin
    app.get("/users", verifyJWT, verifyADMIN, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // update a user's role
    app.patch("/update-role", verifyJWT, verifyADMIN, async (req, res) => {
      const { email, role } = req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { role } }
      );
      await sellerRequestsCollection.deleteOne({ email });

      res.send(result);
    });

    // --- Public Statistics Endpoint (Real-time) ---
    app.get("/stats", async (req, res) => {
      try {
        // Get total books count
        const totalBooks = await booksCollection.countDocuments();

        // Get total customers (users with role 'customer')
        const totalCustomers = await usersCollection.countDocuments({
          role: "customer",
        });

        // Get total sellers
        const totalSellers = await usersCollection.countDocuments({
          role: "seller",
        });

        // Get total orders delivered
        const totalOrders = await ordersCollection.countDocuments({
          status: "delivered",
        });

        // Get category-wise book counts
        const categoryStats = await booksCollection
          .aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ])
          .toArray();

        // Get total revenue
        const revenueResult = await ordersCollection
          .aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ])
          .toArray();
        const totalRevenue = revenueResult[0]?.total || 0;

        res.send({
          totalBooks,
          totalCustomers,
          totalSellers,
          totalOrders,
          totalRevenue,
          categories: categoryStats,
        });
      } catch (error) {
        console.error("Stats error:", error);
        res.status(500).send({ message: "Error fetching stats" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from BookCourier Server! 📚");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
