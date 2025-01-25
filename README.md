# Vizuant SDK

Vizuant SDK is a powerful tool for creating augmented reality (AR) experiences in web applications. It provides a simple interface for integrating AR capabilities into your projects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

![AR Demo](https://d3i2s57s2jetfw.cloudfront.net/wp-content/uploads/2025/01/b4efa85bffd4d66c5ea0ec7cfa0bf684-1200x0-c-default.jpg)

## Installation

To install Vizuant SDK, you need to authenticate with GitHub Package Registry. Follow these steps:

1. Create a Personal Access Token (PAT) on GitHub:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with `read:packages` scope
   - Copy the token

2. Authenticate with GitHub Packages by creating or editing the `.npmrc` file in your project root:

```plaintext
@theoheneba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
