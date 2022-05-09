import user from "../components/user";
import Device from "../components/device";
import  Wallet  from "../components/wallet";
import Razorpay from "../components/razorpay";
import Messages from "../components/messages";
import Plans from "../components/plans";
import contact  from "../components/contact";
import Admin from "../components/admin";

export default [
    ...user,
    ...contact,
    ...Device,
    ...Messages,
    ...Wallet,
    ...Razorpay,
    ...Plans,
    ...Admin
];
