export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 bg-gradient-dark border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-2">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Glorious Schools. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Created with{" "}
          <span className="inline-block animate-pulse-heart text-primary">❤️</span>{" "}
          by{" "}
          <a
            href="https://fresh-teacher.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover underline transition-colors"
          >
            Fresh Teacher
          </a>
        </p>
      </div>
    </footer>
  );
}