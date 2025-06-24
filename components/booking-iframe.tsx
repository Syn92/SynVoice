interface BookingIframeProps {
  className?: string;
}

const BookingIframe = ({ className = "" }: BookingIframeProps) => {
  return (
    <div className={`w-full ${className}`}>
      <iframe 
        width="100%" 
        height="750px" 
        src="https://book.synai.pro/portal-embed#/9482000000046028" 
        frameBorder="0" 
        allowFullScreen
        title="SynAI Pro Booking Portal"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default BookingIframe; 