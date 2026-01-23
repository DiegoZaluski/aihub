/**
 * ThinkButton Component
 * 
 * A button component that toggles the 'thinking' state of the AI, allowing it to 
 * process information more thoroughly before responding. It provides visual feedback
 * when the thinking mode is active.
 * 
 * @component
 * @example
 * ```tsx
 * <ThinkButton 
 *   deepSearch="enhanced"
 *   className="think-btn"
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} [props.deepSearch] - Optional parameter to enable deep search mode
 * @param {string} [props.className] - Additional CSS classes for styling
 * @returns {JSX.Element} A toggle button for AI thinking mode
 */
import { useContext } from 'react';
import { useLlama } from '../../../hooks/useLlama';
import { FaLightbulb } from 'react-icons/fa';
import { AppContext } from '../../../global/AppProvider';

interface ThinkButtonProps {
  deepSearch?: string;
  className?: string;
}

const ThinkButton = ({ deepSearch, className }: ThinkButtonProps) => {
  const CONTEXT = useContext(AppContext);
  const currentModel = CONTEXT.curretModel;
  // const noThink = simpleModel.includes(currentModel);
  const { thinking, setThinking } = CONTEXT;

  const HandlerClick = (): void => {
    setThinking(!thinking);
  };
  const { sendPrompt } = useLlama();
  return (
    <div
      className={`w-full h-full overflow-hidden rounded-full border border-black ${className} ${thinking ? 'outline outline-1 outline-white' : ''}`}
    >
      <button
        onClick={HandlerClick}
        type="button"
        className={'w-full h-full flex flex-row items-center justify-center p-2'}
      >
        <FaLightbulb size={12} />
        <span className={'text-sm'}>Think</span>
      </button>
    </div>
  );
};

export default ThinkButton;
