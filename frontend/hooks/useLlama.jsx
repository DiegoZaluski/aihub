import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generates a unique instance ID for each Llama instance
 * @returns {string} A unique instance ID string
 */

const generateInstanceId = () =>
  `llama-instance-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Custom React hook for managing interactions with a Llama language model
 * 
 * @returns {Object} An object containing state and methods for interacting with the Llama model:
 * @property {Array} messages - Array of message objects with role ('user', 'assistant', 'error') and content
 * @property {boolean} isGenerating - Whether the model is currently generating a response
 * @property {boolean} isConnected - Whether the connection to the model is active
 * @property {string|null} currentPromptId - The ID of the currently processing prompt, if any
 * @property {string|null} sessionId - The current session ID for the model interaction
 * @property {Function} sendPrompt - Sends a prompt to the model
 * @property {Function} stopGeneration - Stops the current generation
 * @property {Function} clearMessages - Clears all messages and resets the conversation
 * @property {Function} clearMemory - Clears the model's memory for the current session
 */

export function useLlama() {
  // State for managing chat messages and model status
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPromptId, setCurrentPromptId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Refs for managing side effects and instance-specific data
  const messageListeners = useRef({});
  const apiAvailable = useRef(false);
  const instanceId = useRef(generateInstanceId());
  const instancePromptMap = useRef(new Map());
  const isGeneratingRef = useRef(false);
  const pendingPromptRef = useRef(null);

  // Sync ref with state to avoid stale closures in event handlers
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  /**
   * Cleans up prompt ID to instance ID mapping
   * @param {string} promptId - The prompt ID to clean up
   */
  const cleanupPromptMapping = useCallback((promptId) => {
    if (promptId) {
      instancePromptMap.current.delete(promptId);
    }
  }, []);

  /**
   * Resets all generation-related state
   */
  const cleanupGenerationState = useCallback(() => {
    setIsGenerating(false);
    isGeneratingRef.current = false;
    setCurrentPromptId(null);
    pendingPromptRef.current = null;
  }, []);

  /**
   * Terminates the current generation and cleans up related state
   * @param {string} promptId - The ID of the prompt to terminate
   */
  const terminateGeneration = useCallback(
    (promptId) => {
      cleanupPromptMapping(promptId);
      cleanupGenerationState();
    },
    [cleanupPromptMapping, cleanupGenerationState],
  );

  useEffect(() => {
    apiAvailable.current = Boolean(window.api?.sendPrompt);
  }, []);

  /**
   * Updates the last assistant message with new token
   * @param {string} token - The token to append to the assistant's message
   */
  const updateAssistantMessage = useCallback((token) => {
    setMessages((prev) => {
      const lastIndex = prev.length - 1;
      if (lastIndex >= 0 && prev[lastIndex].role === 'assistant') {
        const newMessages = [...prev];
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          content: newMessages[lastIndex].content + token,
        };
        return newMessages;
      }
      return prev;
    });
  }, []);

  /**
   * Sends a prompt to the Llama model for processing
   * @param {string|Object} prompt - The prompt to send. Can be a string or an object with a prompt property
   * @returns {Promise<void>}
   */
  const sendPrompt = useCallback(
    async (prompt) => {
      const trimmedPrompt = prompt?.trim();
      if (!trimmedPrompt) {
        console.error('Empty prompt');
        return;
      }

      if (!apiAvailable.current) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: 'API unavailable',
          },
        ]);
        return;
      }

      if (isGenerating && currentPromptId) {
        try {
          await window.api.stopPrompt(currentPromptId);
          terminateGeneration(currentPromptId);
        } catch (err) {
          console.error('Error stopping previous generation:', err);
          terminateGeneration(currentPromptId);
        }
      }

      let userContent;
      try {
        const parsed = JSON.parse(trimmedPrompt);
        userContent = parsed.prompt || trimmedPrompt;
      } catch {
        userContent = trimmedPrompt;
      }

      setMessages((prev) => [...prev, { role: 'user', content: userContent.trim() }]);
      setIsGenerating(true);
      isGeneratingRef.current = true;
      pendingPromptRef.current = { instanceId: instanceId.current, timestamp: Date.now() };

      try {
        const result = await window.api.sendPrompt(trimmedPrompt);

        if (result.success) {
          setCurrentPromptId(result.promptId);
          instancePromptMap.current.set(result.promptId, instanceId.current);
          setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
          pendingPromptRef.current = null;
        } else {
          throw new Error(result.error || 'Prompt submission failed');
        }
      } catch (err) {
        console.error('Send prompt error:', err);
        setMessages((prev) => [...prev, { role: 'error', content: `Error: ${err.message}` }]);
        terminateGeneration(currentPromptId);
      }
    },
    [isGenerating, currentPromptId, terminateGeneration],
  );

  /**
   * Stops the current generation process
   * @returns {Promise<void>}
   */
  const stopGeneration = useCallback(async () => {
    if (!isGenerating) return;

    if (currentPromptId && apiAvailable.current) {
      try {
        await window.api.stopPrompt(currentPromptId);
      } catch (err) {
        console.error('Stop generation error:', err);
      }
    }
    terminateGeneration(currentPromptId);
  }, [currentPromptId, isGenerating, terminateGeneration]);

  /**
   * Clears the model's memory for the current session
   * @returns {Promise<void>}
   */
  const clearMemory = useCallback(async () => {
    if (apiAvailable.current) {
      try {
        await window.api.clearMemory?.();
      } catch (err) {
        console.error('Clear memory error:', err);
      }
    }
  }, []);

  /**
   * Clears all messages and resets the conversation state
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    terminateGeneration(currentPromptId);
    clearMemory();
  }, [clearMemory, terminateGeneration, currentPromptId]);

  useEffect(() => {
    return () => {
      instancePromptMap.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!window.api) {
      console.warn('Window API unavailable');
      return;
    }

    const eventHandlers = {
      newToken: window.api.onNewToken((promptId, token) => {
        if (instancePromptMap.current.get(promptId) === instanceId.current) {
          updateAssistantMessage(token);
        }
      }),

      complete: window.api.onComplete((promptId) => {
        terminateGeneration(promptId);
      }),

      error: window.api.onError((promptId, error) => {
        if (instancePromptMap.current.get(promptId) === instanceId.current) {
          console.error('Model error:', { promptId, error });
          setMessages((prev) => [
            ...prev,
            { role: 'error', content: `Error: ${error || 'Unknown'}` },
          ]);
          terminateGeneration(promptId);
        }
      }),

      ready: window.api.onReady((data) => {
        setIsConnected(true);
        if (data.sessionId) setSessionId(data.sessionId);
      }),

      disconnected: window.api.onDisconnected(() => {
        setIsConnected(false);
        terminateGeneration(currentPromptId);
        instancePromptMap.current.clear();
      }),

      started: window.api.onStarted((data) => {
        const { promptId, newSessionId } = data;
        const mappedInstanceId = instancePromptMap.current.get(promptId);

        if (mappedInstanceId) {
          if (mappedInstanceId === instanceId.current) {
            setCurrentPromptId(promptId);
            if (newSessionId) setSessionId(newSessionId);
            setIsGenerating(true);
          }
        } else {
          const hasPendingPrompt = pendingPromptRef.current !== null;
          const isCurrentlyGenerating = isGeneratingRef.current;

          if (hasPendingPrompt || isCurrentlyGenerating) {
            instancePromptMap.current.set(promptId, instanceId.current);
            setCurrentPromptId(promptId);
            if (newSessionId) setSessionId(newSessionId);
            setIsGenerating(true);
            pendingPromptRef.current = null;
          }
        }
      }),

      memoryCleared: window.api.onMemoryCleared((clearedSessionId) => {
        if (clearedSessionId === sessionId) {
          console.log('Memory cleared for current session');
        }
      }),
    };

    Object.entries(eventHandlers).forEach(([key, cleanup]) => {
      messageListeners.current[key] = cleanup;
    });

    return () => {
      Object.values(messageListeners.current).forEach((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
      messageListeners.current = {};
    };
  }, [currentPromptId, terminateGeneration, updateAssistantMessage, sessionId]);

  return {
    messages,
    isGenerating,
    isConnected,
    currentPromptId,
    sessionId,
    sendPrompt,
    stopGeneration,
    clearMessages,
    clearMemory,
  };
}
