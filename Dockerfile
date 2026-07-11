# Stage 1: Build the React UI
FROM node:20-alpine AS ui-builder
WORKDIR /app/ui
COPY ui/package*.json ./
RUN npm ci
COPY ui/ ./
RUN npm run build

# Stage 2: Build the Go backend
FROM golang:1.22-alpine AS go-builder
WORKDIR /app
# Copy the go mod files first
COPY go.mod go.sum ./
RUN go mod download
# Copy the rest of the source code
COPY . .
# Copy the built UI into the ui/dist folder so go:embed works
COPY --from=ui-builder /app/ui/dist ./ui/dist
# Build the Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o onboard main.go

# Stage 3: Final minimal image
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
# Copy the binary from the go-builder stage
COPY --from=go-builder /app/onboard .
# Expose the API port
EXPOSE 8080
# Run the server command by default
CMD ["./onboard", "server"]
