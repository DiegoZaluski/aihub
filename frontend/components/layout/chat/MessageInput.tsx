import React, { useCallback, useState, useEffect, RefObject } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// import SearchButton from './SearchButton';
// import ThinkButton from './ThinkButton';
// import ClearButton from './ClearButton';
import { COLORS } from './ct-styles';

// TRANSLATION: move textArea and nearby components
const MOVE_CLASSES = {
  NoGenerate: '-translate-y-96',
  Generate: 'translate-y-2',
};

// interface ClearTooltipProps {
//   tooltipRef: RefObject<HTMLSpanElement>;
//   className?: string;
// }

// Combine with the ClearButton component.
// const ClearTooltip = React.memo(({ tooltipRef, className }: ClearTooltipProps) => {
//   const { t } = useTranslation('common');
//   return (
//     <span
//       id="clear"
//       ref={tooltipRef}
//       className={`
//         ${className}
//         w-28 
//         flex items-center justify-center self-center   
//         translate-y-[-100%] 
//         mb-2 px-2 py-2   
//         rounded 
//         ${COLORS.tooltip}
//         text-xs 
//         whitespace-nowrap 
//         opacity-0 transition-opacity duration-300 
//         pointer-events-none`}
//       role="tooltip"
//     >
//       {t('clear', { returnObjects: false })}
//     </span>
//   );
// });

interface MessageInputProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onHeightAdjust: () => void;
  onClear: () => void;
  tooltipRef: RefObject<HTMLSpanElement>;
  showTooltip: () => void;
  hideTooltip: () => void;
  onSend: (message: string) => void;
  isGenerating: boolean;
  stopGeneration: () => void;
  adaptable: boolean;
  newWindow: boolean;
}

const MessageInput = React.memo(
  ({
    textareaRef,
    value,
    onChange,
    placeholder,
    onHeightAdjust,
    onClear,
    // tooltipRef,
    // showTooltip,
    // hideTooltip,
    onSend,
    isGenerating,
    stopGeneration,
    adaptable,
    newWindow,
  }: MessageInputProps) => {
    const [beenGenerated, setBeenGenerated] = useState<boolean>(isGenerating);

    useEffect(() => {
      if (isGenerating) {
        setBeenGenerated(true);
      }
    }, [isGenerating]);

    // Handlers
    const handleSubmitOrStop = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        if (isGenerating) {
          stopGeneration?.();
        } else if (value?.trim()) {
          onSend?.(value.trim());
          onClear?.();
          if(textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
      },
      [isGenerating, stopGeneration, value, onSend, onClear, textareaRef],
    );

    const handleEnterKey = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmitOrStop(e);
        }
      },
      [handleSubmitOrStop],
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      onHeightAdjust();
    };

    // Computed values
    const SendStopButton = isGenerating ? (
      <X className="w-4 h-4 text-black hover:text-white" />
    ) : (
      <ArrowUp className="w-4 h-4 text-black" />
    );

    const isButtonDisabled = !isGenerating && !value?.trim();

    // Render helpers
    const renderTextarea = (isNoGenerate = false) => {
      const moveClass = isNoGenerate ? MOVE_CLASSES.NoGenerate : MOVE_CLASSES.Generate;
      
      const shouldUseSmallSize = isNoGenerate || adaptable;
      
      return (
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleEnterKey}
          disabled={isGenerating}
          rows={1}
          style={{ scrollbarWidth: 'none' }}
          className={`
            pl-6
            placeholder:font-semibold
            ${isNoGenerate ? COLORS.background : 'bg-transparent'}
            w-full
            ${shouldUseSmallSize ? 'min-h-[6rem] max-h-20' : newWindow ? 'min-h-[5rem] max-h-20' : 'min-h-[5em] max-h-52'}
            ${adaptable ? moveClass : ''}
            outline-none
            ${COLORS.caret}
            ${COLORS.text}
            ${isNoGenerate ? COLORS.border : ''}
            ${isNoGenerate ? 'rounded-3xl p-4 pr-12 overflow-hidden shadow-b-xl' : 'p-4 pr-12 overflow-auto'}
            resize-none 
          `}
        />
      );
    };

    const renderButton = (isNoGenerate = false) => {
      const moveClass = isNoGenerate ? MOVE_CLASSES.NoGenerate : MOVE_CLASSES.Generate;
      const sizeClasses = adaptable 
        ? `right-4 bottom-4 w-6 h-6 ${moveClass}` 
        : 'right-4 bottom-6 w-8 h-8';

      return (
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`
            absolute  
            ${sizeClasses}
            ${COLORS.button.base}
            rounded-full 
            flex items-center 
            justify-center 
            transition-colors 
            duration-200 
            ${COLORS.button.disabled} 
            ${isGenerating ? COLORS.button.generating : COLORS.button.hover}
          `}
        >
          {SendStopButton}
        </button>
      );
    };

    const containerBorderClasses = newWindow 
      ? COLORS.newWindowBorder + COLORS.newWindowBg 
      : COLORS.border;

    return (
      <form
        onSubmit={handleSubmitOrStop}
        className="flex flex-col relative w-96 xl:w-1/2 md:w-2/4 -translate-y-16 z-10"
      >
        {/* Main input container (visible after first generation or when not adaptable) */}
        <div className={`flex flex-col relative w-full ${!beenGenerated && adaptable ? 'hidden' : ''}`}>

          {/* <ClearTooltip
            tooltipRef={tooltipRef}
            className={`${adaptable ? MOVE_CLASSES.Generate : ''}`}
          />

          <ClearButton
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onClick={onClear}
            className={`${adaptable ? MOVE_CLASSES.Generate : ''}`}
          /> */}

          <div className={`
            relative 
            h-auto
            ${adaptable ? 'pb-4 pt-2' : 'pb-6 pt-6'}
            scrollbar-hide
            rounded-3xl 
            shadow-b-xl 
            ${COLORS.background}
            ${containerBorderClasses}`}>
            {renderTextarea()}
            {renderButton()}
            <div className={`absolute ${adaptable ? 'left-4 bottom-4 w-12 h-6' : 'left-6 bottom-6 w-16 h-8'}`}>
              {/* <SearchButton /> */}
            </div>
            <div className={`absolute ${adaptable ? 'left-[70px] bottom-4 w-12 h-6' : 'left-6 bottom-6 w-16 h-8'}`}>
              {/* <ThinkButton /> */}
            </div>
          </div>
        </div>

        {/* Initial input (visible only before first generation in adaptable mode) */}
        {!beenGenerated && adaptable && (
          <div className="flex flex-col relative w-full">
            <div className="relative">
              {renderTextarea(true)}
              {renderButton(true)}
            </div>
          </div>
        )}
      </form>
    );
  },
);

export default MessageInput;