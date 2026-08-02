import Link from "next/link";

export default function NotFound() {
  return <main className="empty-state not-found"><p className="eyebrow dark">404</p><h1>Page not found.</h1><p>The requested KRVE experience does not exist.</p><Link className="primary-button dark-button" href="/">Return Home</Link></main>;
}
