import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Zig + Next.js Integration</h1>
      <div>
        <Link href="/zig-wasm">WebAssembly Example</Link>
      </div>
    </div>
  );
}
