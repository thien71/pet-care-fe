import Logo from "@/components/common/Logo";

const Footer = ({ className = "" }) => {
  return (
    <footer className={`bg-gray-900 text-gray-200 py-12 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <Logo animate={false} />
        <p className="font-bold text-2xl mb-2">Pet Care Da Nang</p>
        <p className="text-gray-400">© Nguyễn Văn Thanh Thiện</p>
      </div>
    </footer>
  );
};

export default Footer;
