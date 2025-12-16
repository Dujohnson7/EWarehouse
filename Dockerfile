# Stage 1: Build the Frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Stage 2: Build the Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend
WORKDIR /app/backend

# Copy the project file and restore dependencies
COPY backend/EWarehouse/EWarehouse/EWarehouse.csproj ./
RUN dotnet restore

# Copy the rest of the backend code
COPY backend/EWarehouse/EWarehouse/ ./

# Build and publish the application
RUN dotnet publish -c Release -o out

# Stage 3: Run the Application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published backend code
COPY --from=build-backend /app/backend/out ./

# Copy the built frontend files to the wwwroot directory
# This allows the .NET app to serve the React app as static files
COPY --from=build-frontend /app/frontend/dist ./wwwroot

# Expose the port (Render typically uses 80 or sets PORT env var)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Configure Entrypoint
ENTRYPOINT ["dotnet", "EWarehouse.dll"]
