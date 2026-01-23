/**
 * Configuration details for a Llama model event
 * 
 * @interface LlamaConfigEventDetail
 * @property {string} id_model - Unique identifier for the model
 * @property {number} [temperature] - Controls randomness in the model's output (0-1)
 * @property {number} [top_p] - Nucleus sampling parameter (0-1)
 * @property {number} [top_k] - Top-k sampling parameter
 * @property {number} [tokens] - Maximum number of tokens to generate
 * @property {number} [repeat_penalty] - Penalty for repeated tokens
 * @property {number} [frequency_penalty] - Penalty for frequent tokens
 * @property {number} [presence_penalty] - Penalty for new tokens
 * @property {number} [min_p] - Minimum probability for token selection
 * @property {number} [tfs_z] - Tail-free sampling parameter
 * @property {number} [mirostat_tau] - Mirostat target cross-entropy
 * @property {number|null} [seed] - Random seed for reproducibility
 * @property {string[]|null} [stop] - Stop sequences to end generation
 */
export interface LlamaConfigEventDetail {
  id_model: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  tokens?: number;
  repeat_penalty?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  min_p?: number;
  tfs_z?: number;
  mirostat_tau?: number;
  seed?: number | null;
  stop?: string[] | null;
}

/**
 * Dispatches a custom event for Llama model configuration
 * 
 * @param {HTMLElement} targetElement - The DOM element to dispatch the event from
 * @param {LlamaConfigEventDetail} detail - Configuration details for the event
 * @returns {void}
 * 
 * @example
 * // Dispatch a configuration event
 * dispatchLlamaConfigEvent(document.body, {
 *   id_model: 'llama-2-7b',
 *   temperature: 0.7,
 *   max_tokens: 1000
 * });
 */
export function dispatchLlamaConfigEvent(
  targetElement: HTMLElement,
  detail: LlamaConfigEventDetail,
): void {
  if (!detail.id_model) {
    throw new Error('The \'id_model\' is required to trigger event.');
  }

  const eventCofigLlm = new CustomEvent<LlamaConfigEventDetail>('configLlm', {
    detail: detail,
    bubbles: true,
    cancelable: true,
  });

  targetElement.dispatchEvent(eventCofigLlm);
}
