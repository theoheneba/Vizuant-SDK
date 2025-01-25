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
- [Vizuant SDK Integration](#vizuant-sdk-integration)

## Installation

To install Vizuant SDK, you need to authenticate with GitHub Package Registry. Follow these steps:

1. Create a Personal Access Token (PAT) on GitHub:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with `read:packages` scope
   - Copy the token

2. Authenticate with GitHub Packages by creating or editing the `.npmrc` file in your project root:


## Vizuant SDK Integration

This project now includes the Vizuant SDK for creating augmented reality experiences. To use the SDK in your Next.js components:

\`\`\`typescript
import { VizuantSDK } from '../src/vizuant';

const sdk = new VizuantSDK({
  apiKey: 'your-api-key',
  arSettings: {
    experienceType: 'marker',
    // ... other settings
  }
});

sdk.initialize();
const scene = sdk.createARScene('ar-container');
// ... use other SDK methods as needed
\`\`\`

To build the SDK separately:

\`\`\`bash
npm run build:sdk
\`\`\`

This will generate the SDK files in the `dist` directory.

