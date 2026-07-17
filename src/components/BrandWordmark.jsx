export default function BrandWordmark({ className = '', style }) {
  return (
    <span className={className} style={{ ...style, fontWeight: 750 }} aria-label="WORDWORK">
      <span className="brand-word" aria-hidden="true" style={{ color: '#005afa' }}>W</span>
      <span className="brand-word" aria-hidden="true" style={{ color: '#1326be' }}>ORD</span>
      <span className="brand-work" aria-hidden="true" style={{ color: '#081e39' }}>W</span>
      <span className="brand-work" aria-hidden="true" style={{ color: '#1326be' }}>ORK</span>
    </span>
  )
}
