import './Input.css';

export const Input = ({ 
  label, 
  error, 
  type = 'text', 
  fullWidth = false,
  ...props 
}: any) => {
  const inputClassName = `input ${error ? 'input-error' : ''} ${fullWidth ? 'input-full' : ''}`.trim();
  
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        className={inputClassName}
        type={type}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};
