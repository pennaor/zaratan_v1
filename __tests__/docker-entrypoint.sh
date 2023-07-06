#! /bin/sh

# Declara a variavel de ambiente DISPLAY com intuito de associar o X-SERVER ao container, permitindo visualizar no navegador a execução dos testes localmente
echo "export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0" >> /etc/profile

source /etc/profile

npm test "$@"
