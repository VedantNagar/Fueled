# Base image for the backend (Django)
FROM python:3.11-slim-buster as backend

# Set the working directory in the container
WORKDIR /

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files to the working directory
COPY . .

# Base image for the frontend (Vite)
FROM node:16-alpine as frontend

# Set the working directory in the container
WORKDIR /frontend

# Copy the frontend package files to the working directory
COPY frontend/package.json frontend/package-lock.json ./

# Install the frontend dependencies using npm
RUN npm ci

# Copy the frontend project files to the working directory
COPY frontend .

# Build the frontend
RUN npm run build

# Final image
FROM backend as final

# Copy the built frontend files from the frontend stage to the final stage
COPY --from=frontend /frontend/dist /frontend/dist

# Change the working directory back to the backend directory
WORKDIR /

# Expose the port that Daphne runs on
EXPOSE 8000

# Set the command to run when the container starts
CMD ["daphne", "backend.asgi:application", "-b", "0.0.0.0", "-p", "8000"]