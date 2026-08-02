import Link from "next/link";

export default function VirtualTryOnPage() {
  return (
    <main className="ai-page">
      <section className="ai-hero"><p className="eyebrow">KRVE Intelligence</p><h1>See your style<br /><em>before you wear it.</em></h1><p>Create your digital twin, receive body-aware measurements and prepare for intelligent virtual try-on.</p><div className="hero-actions"><Link className="primary-button" href="/virtual-try-on#start">Start Body Scan</Link><Link className="ghost-button" href="/collections">Browse Compatible Pieces</Link></div></section>
      <section className="ai-steps" id="start"><div><span>01</span><h3>Create profile</h3><p>Tell us your height and basic fit preferences.</p></div><div><span>02</span><h3>Upload photographs</h3><p>Front and side body images on a plain background.</p></div><div><span>03</span><h3>Generate measurements</h3><p>KADE-v2 will calculate fit and size guidance.</p></div><div><span>04</span><h3>Try styles virtually</h3><p>Preview selected KRVE products on your digital twin.</p></div></section>
      <section className="ai-placeholder"><div className="scan-frame"><div className="scan-person">◇</div><span className="scan-line" /></div><div><p className="eyebrow dark">Integration Ready</p><h2>KADE-v2 connection comes next.</h2><p>This clean frontend foundation is ready for body detection, measurements, avatar generation and try-on APIs. The experience remains visible without throwing connection errors while the backend is being deployed.</p><div className="status-card"><strong>Frontend status</strong><span>Ready</span></div><div className="status-card"><strong>KADE-v2 API</strong><span>Not connected</span></div></div></section>
    </main>
  );
}
