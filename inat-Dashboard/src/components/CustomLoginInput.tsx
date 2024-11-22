import { FC } from "react";
import { LockKeyhole, Mail } from "lucide-react";

interface CustomLoginInputProps {
  icon?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomLoginInput = (props: CustomLoginInputProps) => {
  const { icon, placeholder, name, value, onChange } = props;

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <div className="">
        {icon === "mail" ? (
          <Mail color="black" size={28} />
        ) : (
          <LockKeyhole color="black" size={28} />
        )}
      </div>
      <input
        type="text"
        className="w-full  p-4 outline-none border-[1px] border-[#D4D2E3] rounded-xl focus:ring-primary focus:border-primary"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomLoginInput;
