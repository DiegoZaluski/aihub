# kill python process
ps aux | grep python
pkill -f "python.\*llama_server"

print("SOCKET IN GLOBALS:", 'socket' in globals())
print("SOCKET IN BUILTINS:", 'socket' in **builtins**.**dict**)

# update requirements.txt

pip freeze > requirements.txt

# venv
source /home/zaluski/Documentos/HugLab/backend/fullpy/venv/bin/activate


# requires 
node-llama-cpp - create your own cpp library

# feature:
3. resolve theme problem 
4. change the name of the python packages files 

command util

pip install -e . 



## tarefas 

- ajustar consertar button de mudar de tema e button de levar ate o repositorio 

# 1. Instalar dependências no Arch Linux
sudo pacman -S git base-devel cmake

# 2. Clonar o repositório do llama.cpp
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

# 3. Criar pasta de build e entrar nela
mkdir -p build
cd build

# 4. Configurar o build com CMake para Release
cmake .. -DCMAKE_BUILD_TYPE=Release

# 5. Compilar usando todos os núcleos da CPU
cmake --build . --config Release -j$(nproc)

# 6. Testar se os binários foram gerados corretamente
./main --help
# ou
./llama-cli --help


molt-bot commads 

pnpm start configure 
pnpm start channels login --verbose
rm -rf ~/.clawdbot/

