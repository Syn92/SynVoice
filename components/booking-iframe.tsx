interface BookingIframeProps {
  className?: string;
  lang?: "en" | "fr";
}

const BookingIframe = ({ className = "", lang = "en" }: BookingIframeProps) => {
  // URLs for different locales
  const iframeUrls = {
    en: "https://book.synai.pro/portal-embed#/9482000000037020",
    fr: "https://book.synai.pro/portal-embed#/9482000000045252"
  };

  return (
    <div className={`w-full ${className}`}>
      <iframe 
        width="100%" 
        height="750px" 
        src={iframeUrls[lang]} 
        frameBorder="0" 
        allowFullScreen
        title="SynAI Pro Booking Portal"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default BookingIframe; 