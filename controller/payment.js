const Razorpay = require("razorpay");
const crypto = require("crypto");

// Create order
exports.createOrder = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const { amount, currency = "INR" } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const options = {
            amount: amount * 100,
            currency,
            receipt: `order_rcpt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Verify payment
// exports.verifyPayment = (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({ success: false, message: 'Missing required parameters' });
//         }

//         const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//         hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//         const generated_signature = hmac.digest("hex");

//         if (generated_signature === razorpay_signature) {
//             return res.status(200).json({ success: true, message: "Payment verified successfully!" });
//         } else {
//             return res.status(400).json({ success: false, message: "Invalid signature, payment verification failed!" });
//         }
//     } catch (error) {
//         console.error("Error verifying payment:", error.message);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };