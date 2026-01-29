# 🦙 ellama (v0.0.1 - Alpha)

**ellama** is an Electron-based desktop application designed as a user-friendly interface for running **llama.cpp**. It allows you to download GGUF models directly from Hugging Face, control llama.cpp project parameters, and manage memory efficiency—all through an intuitive GUI.

---

## 🚀 About the Project
Currently in its alpha stage, the focus is to simplify local AI experimentation by removing the complexity of the command line.

### ✨ Features & Vision
- **llama.cpp Interface:** Full control over inference parameters and project settings.
- **Hugging Face Integration:** Easy search and download of GGUF models.
- **Memory Management:** Built-in functions to save and optimize system resource usage.
- **Smarter RAG:** Future support for reading external files and data sources.
- **Audio Support:** Plans for integrated text-to-audio descriptions.

> [!TIP]
> **Have a great idea?** Suggestions are always welcome! Feel free to contribute and help shape the project.

---

## 🛠️ Setup & Configuration

### 1. Requirements
* **Node.js:** v22.12.0 (Windows) or v22.21.0 (POSIX).
* **Important:** Keep the project outside of OneDrive on Windows to avoid synchronization conflicts.

### 2. Main Installation
```bash
# Clone the repository
git clone [https://github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)

# Install dependencies
npm install
```

### 3. Backend Setup & Refactoring Note
Navigate to the `backend/fullpy` folder and set up your Python environment:
```bash
cd backend/fullpy

# Create venv
python -m venv venv

# Activate and install
# Linux/macOS: source venv/bin/activate | Windows: .\venv\Scripts\activate
pip install -r requirements.txt
pip install -e .
```

> [!WARNING]  
> **Python Refactoring:** The current Python backend was a temporary choice made to quickly test the model. In the future, Python will be completely removed from the project to improve performance and simplify the distribution of the executable.

---

## 📁 Project Structure

```text
huglab/
├── backend/
│   ├── config/            # Backend configurations (model.json)
│   ├── fullpy/            # Current Python logic (To be removed)
│   └── ...                # Validation rules and window management
├── frontend/
│   ├── components/        # Reusable React components
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Entry point
├── electron/
│   ├── ipc/               # Inter-process communication
│   └── track/             # Conditional functions for main.cjs
├── public/                # Static assets
└── utils/                 # Shared helper functions
```

---

## 🗺️ ROADMAP
A dedicated space to track progress, open tasks, and plan new features.