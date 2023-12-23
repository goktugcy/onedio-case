# Node.js resmi imajını kullanın
FROM node:20

# Çalışma dizinini ayarlayın
WORKDIR /usr/src/app

# Bağımlılıkları kopyalayın ve yükleyin
COPY package*.json ./
RUN npm install

# Uygulama kaynak kodunu kopyalayın
COPY . .

# Uygulamanın çalışacağı portu belirtin
EXPOSE 3000

# Uygulamayı başlatın
CMD ["npm", "start"]
