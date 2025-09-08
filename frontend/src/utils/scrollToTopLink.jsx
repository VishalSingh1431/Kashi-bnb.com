import { Link } from "react-router-dom";

const ScrollToTopLink = ({ to, children, className, ...props }) => {
  const handleClick = () => {
    // Scroll to top when link is clicked
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link 
      to={to} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollToTopLink;
