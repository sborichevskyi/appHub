import './TextInput.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  elements?: string[];
};

export const TextInput: React.FC<Props> = ({ elements, ...props }) => {
  return (
    <div>
      <input
        {...props}
        list={elements ? "suggestions" : undefined}
        autoComplete="address-level2"
      />

      {elements && (
        <datalist id="suggestions">
          {elements.map((element) => (
            <option key={element} value={element} />
          ))}
        </datalist>
      )}
    </div>
  );
};