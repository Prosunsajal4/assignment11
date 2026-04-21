import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLink,
  FaShareAlt,
  FaTimes
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const SocialShare = ({ 
  url, 
  title, 
  description, 
  image,
  className = "",
  buttonClassName = "",
  variant = "dropdown" // 'dropdown', 'buttons', 'minimal'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    url: url || window.location.href,
    title: title || document.title,
    description: description || "",
    image: image || "",
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-blue-600",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-sky-500",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "bg-blue-700",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-green-500",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareData.title} ${shareData.url}`)}`,
          "_blank"
        );
      },
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "bg-gray-600",
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.description}\n\n${shareData.url}`)}`,
          "_blank"
        );
      },
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
      } catch {
        // User cancelled
      }
    } else {
      setIsOpen(true);
    }
  };

  // Minimal variant - just a share button
  if (variant === "minimal") {
    return (
      <button
        onClick={nativeShare}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${buttonClassName}`}
      >
        <FaShareAlt className="text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  // Buttons variant - horizontal row of buttons
  if (variant === "buttons") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={link.action}
            className={`w-10 h-10 ${link.color} text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity`}
            title={`Share on ${link.name}`}
          >
            <link.icon size={18} />
          </button>
        ))}
        <button
          onClick={copyLink}
          className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Copy link"
        >
          <FaLink size={18} />
        </button>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${buttonClassName}`}
      >
        <FaShareAlt />
        <span className="font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-fadeInDown">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-800 dark:text-gray-200">Share</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {shareLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      link.action();
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-10 h-10 ${link.color} rounded-full flex items-center justify-center`}>
                      <link.icon className="text-white" size={18} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{link.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy Link */}
              <button
                onClick={() => {
                  copyLink();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FaLink className="text-gray-600 dark:text-gray-400" size={14} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Copy link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;
