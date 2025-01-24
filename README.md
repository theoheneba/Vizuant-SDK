# Vizuant SDK

Vizuant SDK is a powerful tool for creating augmented reality (AR) experiences in web applications.

## Installation

To install Vizuant SDK, you need to authenticate with GitHub Package Registry. First, create a personal access token with the `read:packages` scope.

Then, create or edit the `.npmrc` file in your project root:

\`\`\`
@theoheneba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
\`\`\`

Now you can install the package:

\`\`\`bash
npm install @theoheneba/vizuant
\`\`\`

## Usage Example

\`\`\`javascript
import { VizuantSDK, initializeARJS, isWebGLSupported } from '@theoheneba/vizuant';

// rest of code here
\`\`\`

