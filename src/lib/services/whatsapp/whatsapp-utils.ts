export const getSerializedPhone = (phone) => {
    phone = phone[0] === "+" ? phone.substr(1,phone.length) : phone;
    return `${phone}@s.whatsapp.net`;
    
  };