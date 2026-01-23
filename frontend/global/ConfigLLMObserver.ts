import { useEffect, useRef } from 'react';
import { config_model } from './global';

/**
 * Configuration observer component that syncs model configurations with a remote server.
 * Implements debouncing to batch multiple rapid updates.
 * 
 * @component
 * @returns {null} This component doesn't render anything
 */

const BASE_URL = 'http://localhost:8001/configs';

function ConfigLLMObserver() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingConfigsRef = useRef<Map<string, config_model>>(new Map());

  /**
   * Synchronizes a single configuration with the remote server
   * @param {config_model} config - The configuration to sync
   * @returns {Promise<void>}
   */
  const syncConfig = async (config: config_model) => {
    console.log('Config:', config);
    const encodedId = encodeURIComponent(config.id_model);

    try {
      const getResponse = await fetch(`${BASE_URL}/${encodedId}`);

      if (getResponse.status === 404) {
        const postResponse = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });

        if (!postResponse.ok) {
          console.error(`POST failed: ${postResponse.status}`);
        }
      } else if (getResponse.ok) {
        const patchResponse = await fetch(BASE_URL, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });

        if (!patchResponse.ok) {
          console.error(`PATCH failed: ${patchResponse.status}`);
        }
      } else {
        console.error(`GET failed: ${getResponse.status}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Set up event listener for config updates with debouncing
  useEffect(() => {
    const handler = (e: CustomEvent<config_model>) => {
      pendingConfigsRef.current.set(e.detail.id_model, e.detail);
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        pendingConfigsRef.current.forEach(syncConfig);
        pendingConfigsRef.current.clear();
      }, 500);
    };

    document.addEventListener('configLlm', handler as EventListener);

    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener('configLlm', handler as EventListener);
    };
  }, []);

  return null;
}

export default ConfigLLMObserver;
