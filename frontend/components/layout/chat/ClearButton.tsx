/**
 * ClearButton Component
 * 
 * A button component that triggers a clear or reset action in the chat interface.
 * It includes hover effects and can be customized with additional CSS classes.
 * 
 * @component
 * @example
 * ```tsx
 * <ClearButton 
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 *   onClick={handleClear}
 *   className="custom-class"
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMouseEnter - Handler for mouse enter event
 * @param {Function} props.onMouseLeave - Handler for mouse leave event
 * @param {Function} props.onClick - Handler for click event
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A button with an eraser icon
 */
import React from 'react';
import { Eraser } from 'lucide-react';
interface ClearButtonProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  className?: string;
}

const ClearButton = React.memo(
  ({ onMouseEnter, onMouseLeave, onClick, className }: ClearButtonProps) => (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`
      ${className} 
      flex w-14 h-12 
      rounded-md bottom-2 
      transform 
      -translate-y-1/2 
      items-center 
      justify-center 
      self-center 
      relative`}
      aria-label="Clear message"
      type="button"
    >
      <Eraser className="text-white active:opacity-50" />
    </button>
  ),
);
export default ClearButton;
