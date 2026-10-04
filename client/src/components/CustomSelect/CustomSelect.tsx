import Select, { type MultiValue, type SingleValue, type StylesConfig } from "react-select";

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

   const customStyles: StylesConfig<Option, boolean> = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      minWidth: "200px",
      border: "1px solid var(--color-border)",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "white",

      "&:hover": {
        borderColor: "var(--color-border)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },

      ...(state.isFocused && {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }),
    }),

    placeholder: (base) => ({
      ...base,
      fontSize: "14px",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "14px",
    }),

    menu: (base) => ({
      ...base,
      borderRadius: "5px",
      overflow: "hidden",
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#2563EB"
        : state.isFocused
          ? "#EFF6FF"
          : "white",
      color: state.isSelected ? "white" : "#111827",

      "&:active": {
        backgroundColor: "#DBEAFE",
      },
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "#EFF6FF",
      borderRadius: "4px",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#2563EB",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#2563EB",

      "&:hover": {
        backgroundColor: "#DBEAFE",
        color: "#1D4ED8",
      },
    }),
  };

  return (
    <Select
      inputId={id}
      options={elements}
      value={value}
      onChange={handleChange}
      styles={customStyles}
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
