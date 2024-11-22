import React from "react";

interface CustomFormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  classname?: string;
  placeholder?: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const CustomFormInput = (props: CustomFormInputProps) => {
  const { label, type = "text", name, value, onChange, classname } = props;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-semibold">{label}</label>
      {type === "textarea" ? (
        <textarea
          className={`w-full p-2 outline-none border-[1px] border-[#D4D2E3] rounded-xl focus:ring-primary transition-all duration-150 ${classname}`}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          className={`w-full p-2 outline-none border-[1px] border-[#D4D2E3] rounded-xl focus:ring-primary transition-all duration-150 ${classname}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
};

export default CustomFormInput;
