#!/bin/bash
set -e

REPO="animesh-94/Onboard-CLI"
INSTALL_DIR="/usr/local/bin"
BIN_NAME="onboard"

# Check for required tools
if ! command -v curl >/dev/null 2>&1; then
    echo "Error: curl is required to download the binary."
    exit 1
fi

if ! command -v tar >/dev/null 2>&1; then
    # We might not need tar if we upload raw binaries, but good to check if we change to tar.gz
    echo "Warning: tar is not installed. If releases are compressed, installation may fail."
fi

# Identify OS and Architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=darwin;;
    *)          echo "Unsupported OS: ${OS}"; exit 1;;
esac

case "${ARCH}" in
    x86_64)     GOARCH=amd64;;
    arm64)      GOARCH=arm64;;
    aarch64)    GOARCH=arm64;;
    *)          echo "Unsupported architecture: ${ARCH}"; exit 1;;
esac

ARTIFACT_NAME="${BIN_NAME}-${PLATFORM}-${GOARCH}"

echo "Detecting latest release for ${REPO}..."
LATEST_RELEASE_URL="https://api.github.com/repos/${REPO}/releases/latest"
DOWNLOAD_URL=$(curl -sL $LATEST_RELEASE_URL | grep "browser_download_url.*${ARTIFACT_NAME}\"" | cut -d '"' -f 4)

if [ -z "$DOWNLOAD_URL" ]; then
    echo "Error: Could not find a binary for ${PLATFORM}-${GOARCH} in the latest release."
    echo "Checked URL: ${LATEST_RELEASE_URL}"
    exit 1
fi

TMP_DIR=$(mktemp -d)
TMP_BIN="${TMP_DIR}/${BIN_NAME}"

echo "Downloading ${ARTIFACT_NAME}..."
curl -sL -o "$TMP_BIN" "$DOWNLOAD_URL"
chmod +x "$TMP_BIN"

echo "Installing to ${INSTALL_DIR}..."
if [ -w "$INSTALL_DIR" ]; then
    mv "$TMP_BIN" "${INSTALL_DIR}/${BIN_NAME}"
else
    echo "Elevated permissions required to write to ${INSTALL_DIR}. Prompting for sudo..."
    sudo mv "$TMP_BIN" "${INSTALL_DIR}/${BIN_NAME}"
fi

rm -rf "$TMP_DIR"

echo ""
echo "========================================"
echo " Onboard-CLI installed successfully!    "
echo "========================================"
echo ""
echo "Next step: Run 'onboard --help' to get started."
