import Select, { type MultiValue, type SingleValue } from "react-select";

export type Option = {
  label: string;
  value: string;
  query: string;
};

type Props = {
  id: string;
  elements?: Option[];
  value: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
  isMulti?: boolean;
  max?: number;
  placeholder?: string;
};

export const CustomSelect = ({
  id,
  elements,
  value,
  onChange,
  isMulti = false,
  max,
  placeholder,
}: Props) => {
  const handleChange = (newValue: MultiValue<Option> | SingleValue<Option>) => {
    if (isMulti) {
      const arr = [...(newValue as MultiValue<Option>)];
      onChange(max ? arr.slice(0, max) : arr);
    } else {
      onChange(newValue as Option | null);
    }
  };

  return (
    <Select
      inputId={id}
      options={elements}
      value={value}
      onChange={handleChange}
      isMulti={isMulti}
      placeholder={placeholder}
      isOptionDisabled={() => {
        if (!isMulti || !max) return false;

        const current = Array.isArray(value) ? value : [];
        return current.length >= max;
      }}
    />
  );
};
