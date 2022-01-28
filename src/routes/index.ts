import user from "../components/user";
import Device from "../components/device";
import  Wallet  from "../components/walllet";
import Razorpay from "../components/razorpay";
import Messages from "../components/messages";

export default [
    ...user,
    ...Device,
    ...Messages,
    ...Wallet,
    ...Razorpay
];
