export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-5xl px-4 py-6 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between">
        <span>v0.1.0 · © {new Date().getFullYear()}</span>
        <a href="https://github.com/yourname/numerology-pro" target="_blank" rel="noreferrer" className="underline">GitHub</a>
      </div>
    </footer>
  );
}

