import './Input.scss';

export type InputOption = { label: string; value: string; query: string };

interface InputProps {
  id: string;
  value: InputOption | null;
  onChange: (val: InputOption) => void;
  elements: InputOption[];
}

export const Input: React.FC<InputProps> = ({ id, value, onChange, elements }) => (
  <select
    id={id}
    value={value?.value ?? ''}
    onChange={(e) => {
      const selected = elements.find((el) => el.value === e.target.value);
      if (selected) onChange(selected);
    }}
  >
    <option value="" disabled>
      Select...
    </option>
    {elements.map((el) => (
      <option key={el.value} value={el.value}>
        {el.label}
      </option>
    ))}
  </select>
);