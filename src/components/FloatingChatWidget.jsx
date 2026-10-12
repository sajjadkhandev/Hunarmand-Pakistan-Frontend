import React from 'react';

// WhatsApp Logo inside a white circular border (Matching screenshot exactly)
const PillWhatsAppBadge = () => (
  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 bg-emerald-700/40">
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.93.56 3.73 1.52 5.26L2.4 21.6l4.58-1.2c1.48.81 3.16 1.27 4.96 1.27 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.81-9.91zm5.66 13.78c-.24.66-1.38 1.26-1.93 1.34-.49.07-1.11.1-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.24-.28.52-.35.7-.35.18 0 .36 0 .52.01.17.01.4.06.61.56.22.53.76 1.85.83 1.99.07.14.11.31.02.49-.09.19-.14.31-.28.47-.14.17-.3.37-.42.5-.14.14-.29.3-.13.58.17.28.74 1.21 1.58 1.96 1.09.97 2 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.82.9-1.11.19-.28.38-.24.64-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.69-.17 1.35z" />
    </svg>
  </div>
);

const FloatingChatWidget = () => {
  const phoneNumber = '923069122770'; // 0306-9122770
  const message = 'Assalam-o-Alaikum Hunarmand Pakistan! Mujhe skilled worker booking aur maloomat ke liye rabta karna hai.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 px-6 py-3 bg-[#045d44] hover:bg-[#034935] active:scale-95 text-white font-bold text-[15px] sm:text-base rounded-full shadow-2xl transition-all border border-emerald-600/30 group cursor-pointer hover:shadow-emerald-950/50"
        title="Direct WhatsApp: 0306-9122770"
      >
        <span className="tracking-wide">Book Your Hunarmand</span>
        <PillWhatsAppBadge />
      </a>
    </div>
  );
};

export default FloatingChatWidget;
