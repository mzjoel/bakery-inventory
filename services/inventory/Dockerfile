# Menggunakan image Node.js sebagai base image  
FROM node:20   
  
# Set working directory  
WORKDIR /usr/src/app  
  
# Menyalin package.json dan package-lock.json  
COPY package*.json ./
COPY prisma ./prisma/

  
# Menginstal dependencies  
RUN npm install  
  
# Menyalin semua file dari folder inventory  
COPY . .
  
# Mengatur variabel lingkungan  
ENV DATABASE_URL="mongodb+srv://recoffee:recoffee@cluster0.onmg8nn.mongodb.net/inventory_service?retryWrites=true&w=majority&appName=Cluster0"  
  

RUN npx prisma generate
# Mengekspos port yang digunakan oleh aplikasi  
EXPOSE 4001  
  
# Menjalankan aplikasi  
CMD ["node", "server.js"]  