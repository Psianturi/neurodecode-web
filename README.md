# Next.js

A modern Next.js 15 application built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Next.js 15** - Latest version with improved performance and features
- **React 19** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
neurodecode-ai/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.tsx  # Root layout component
│   │   ├── homepage/   # Main landing page route
│   │   └── api/        # Next.js proxy API routes
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 🧩 Page Editing

You can start editing the main page by modifying `src/app/homepage/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the production server on port 4028
- `npm run serve` - Alias for `npm run start`
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📱 Deployment

Build the application for production:

  ```bash
  npm run build
  ```

## ☁️ Backend Endpoint Configuration (Cloud Run + Secret Manager)

The Next.js proxy routes read backend URL from `BACKEND_API_BASE_URL`.
If this variable is not provided, it falls back to the current hardcoded Cloud Run URL.

For production on Cloud Run, prefer Secret Manager:

1. Create/update secret in GCP project `gen-lang-client-0348071142`:
  ```bash
  gcloud config set project gen-lang-client-0348071142
  echo -n "https://neurodecode-backend-90710068442.asia-southeast1.run.app" | gcloud secrets create BACKEND_API_BASE_URL --data-file=-
  ```

2. If secret already exists, add a new version:
  ```bash
  echo -n "https://neurodecode-backend-90710068442.asia-southeast1.run.app" | gcloud secrets versions add BACKEND_API_BASE_URL --data-file=-
  ```

3. Attach secret to frontend Cloud Run service as env var:
  ```bash
  gcloud run services update <FRONTEND_SERVICE_NAME> \
    --region=asia-southeast1 \
    --set-secrets=BACKEND_API_BASE_URL=BACKEND_API_BASE_URL:latest
  ```

4. Ensure service account has permission:
  - `roles/secretmanager.secretAccessor` on secret `BACKEND_API_BASE_URL`

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

