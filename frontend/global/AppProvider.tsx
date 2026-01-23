import React, { createContext, useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import ConfigLLMObserver from './ConfigLLMObserver';

/**
 * @typedef {Object} DownloadState
 * @property {'checking'|'idle'|'connecting'|'downloading'|'downloaded'|'error'} status - The current status of the download
 * @property {number} progress - Download progress (0-100)
 * @property {string} [error] - Error message if status is 'error'
 */

/**
 * @typedef {Object} GlobalState
 * @property {boolean} isDark - Dark mode state
 * @property {{name: string, avatar: string}|null} user - Current user information
 * @property {boolean} isLoggedIn - User authentication state
 * @property {number} cartItems - Number of items in cart
 * @property {Record<string, DownloadState>} downloads - Active downloads state
 * @property {string[]} downloadedModels - List of downloaded model IDs
 * @property {string} curretModel - Currently selected model ID
 * @property {100|200|300} searchCode - Search status code
 * @property {boolean} thinking - Whether the system is processing/thinking
 */

/**
 * @typedef {Object} GlobalActions
 * @property {Function} setIsDark - Toggle dark mode
 * @property {Function} setUser - Set current user
 * @property {Function} setIsLoggedIn - Set authentication state
 * @property {Function} setCartItems - Update cart item count
 * @property {Function} setDownloadState - Update download state for a model
 * @property {Function} setCurrentModel - Set the current active model
 * @property {Function} getDownloadState - Get download state for a model
 * @property {Function} addDownloadedModel - Add a model to downloaded models
 * @property {Function} removeDownloadedModel - Remove a model from downloaded models
 * @property {Function} addCurrentModel - Alias for setCurrentModel
 * @property {Function} setSearchCode - Update search status code
 * @property {Function} setThinking - Set thinking state
 */

/** @type {import('react').Context<GlobalState & GlobalActions>} */

// TYPES AND INTERFACES
type DownloadState = {
  status: 'checking' | 'idle' | 'connecting' | 'downloading' | 'downloaded' | 'error';
  progress: number;
  error?: string;
};

type GlobalState = {
  isDark: boolean;
  user: { name: string; avatar: string } | null;
  isLoggedIn: boolean;
  cartItems: number;
  downloads: Record<string, DownloadState>;
  downloadedModels: string[];
  curretModel: string; // 'curret' written wrong :(
  searchCode: 100 | 200 | 300;
  thinking: boolean;
};

interface GlobalActions {
  setIsDark: (isDark: boolean) => void;
  setUser: (user: { name: string; avatar: string } | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCartItems: (cartItems: number) => void;
  setDownloadState: (modelId: string, state: DownloadState) => void;
  setCurrentModel: (modelId: string) => void;
  getDownloadState: (modelId: string) => DownloadState;
  addDownloadedModel: (modelId: string) => void;
  removeDownloadedModel: (modelId: string) => void;
  addCurrentModel: (modelId: string) => void;
  setSearchCode: (code: 100 | 200 | 300) => void;
  setThinking: (thinking: boolean) => void;
}

type AppContextType = GlobalState & GlobalActions;

// CONTEXT CREATION
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider component that wraps the application with global state management
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component with global state
 */
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // STATE MANAGEMENT - WITH THEME INITIALIZATION
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('data-theme');
    if (saved === null) return true;
    return saved === 'dark';
  });

  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const [downloads, setDownloads] = useState<Record<string, DownloadState>>({});
  const [downloadedModels, setDownloadedModels] = useState<string[]>([]);
  const [curretModel, setCurrentModel] = useStorage('current-model', ''); // '' default, substitute in production
  const [searchCode, setSearchCode] = useState<100 | 200 | 300>(100);
  const [thinking, setThinking] = useState<boolean>(false);

  const setDownloadState = (modelId: string, state: DownloadState) => {
    setDownloads((prev) => ({ ...prev, [modelId]: state }));

    //UPDATE downloaded list automatically
    if (state.status === 'downloaded') {
      setDownloadedModels((prev) => (prev.includes(modelId) ? prev : [...prev, modelId]));
    }
  };

  const getDownloadState = (modelId: string): DownloadState => {
    return downloads[modelId] || { status: 'idle', progress: 0 };
  };

  //NEW ACTIONS to manage downloaded models
  const addDownloadedModel = (modelId: string) => {
    setDownloadedModels((prev) => (prev.includes(modelId) ? prev : [...prev, modelId]));
  };

  const removeDownloadedModel = (modelId: string) => {
    setDownloadedModels((prev) => prev.filter((id) => id !== modelId));
  };

  const addCurrentModel = (modelId: string) => {
    setCurrentModel(modelId);
  };
  // CONTEXT VALUE
  const value: AppContextType = {
    isDark,
    user,
    isLoggedIn,
    cartItems,
    downloads,
    downloadedModels,
    curretModel,
    searchCode,
    thinking,
    setIsDark,
    setUser,
    setIsLoggedIn,
    setCartItems,
    setCurrentModel,
    setDownloadState,
    getDownloadState,
    addDownloadedModel,
    removeDownloadedModel,
    addCurrentModel,
    setSearchCode,
    setThinking,
  };

  return (
    <AppContext.Provider value={value}>
      <ConfigLLMObserver />
      {children}
    </AppContext.Provider>
  );
};
