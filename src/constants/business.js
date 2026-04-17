export const BUSINESS_DETAILS = {
  name: "Vaibhav Swarn Kala Kendra",
  address: "Main Chowk, Doharighat, Mau, Uttar Pradesh – 275303, India",
  mapQuery: "Main Chowk, Doharighat, Mau",
  phones: [
    { display: "+91 89538 14654", value: "8953814654" },
    { display: "+91 78979 27060", value: "7897927060" }
  ],
  whatsapp: {
    number: "918953814654",
    message: "Hello, I want to enquire about jewellery"
  },
  email: "vaibhavswarnkala@gmail.com" // Placeholder if not provided
};

export const getWhatsAppLink = () => {
  return `https://wa.me/${BUSINESS_DETAILS.whatsapp.number}?text=${encodeURIComponent(BUSINESS_DETAILS.whatsapp.message)}`;
};

export const getPhoneLink = (index = 0) => {
  return `tel:${BUSINESS_DETAILS.phones[index].value}`;
};

export const getGoogleMapEmbedLink = () => {
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(BUSINESS_DETAILS.mapQuery)}`;
  // Note: Using standard iframe link without API key for simplicity if needed
};
