import { X } from "lucide-react";
import React from "react";

const MessageModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") onClose();
  };
  return (
    <div
      onClick={handleClose}
      id="wrapper"
      className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-[600px] flex flex-col bg-white p-8 rounded-xl">
        <button className="place-self-end" onClick={() => onClose()}>
          <X color="black" size={24} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MessageModal;
