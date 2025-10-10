'use client';

export default function EscapeCanvas({
  backgroundUrl,
  onHotspot,
  isActive,
}: {
  backgroundUrl: string;
  onHotspot: () => void;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21 / 9',
        maxHeight: 260,
        borderRadius: 12,
        overflow: 'hidden',
        background: `url(${backgroundUrl}) center/cover no-repeat`,
      }}
      aria-label="Escape room background"
    >
      <button
        type="button"
        aria-label="Hidden debug hotspot"
        title="(hidden hotspot)"
        disabled={!isActive} // 👈 disables hotspot in all other stages
        onClick={() => {
          if (isActive) {
            console.log('[hotspot] clicked');
            onHotspot();
          }
        }}
        onKeyDown={(e) => {
          if (!isActive) return;
          if (e.key === 'Enter' || e.key === ' ') onHotspot();
        }}
        style={{
          position: 'absolute',
          top: 32,
          left: 48,
          width: 40,
          height: 40,
          cursor: isActive ? 'pointer' : 'default',
          zIndex: 2,
          background: 'transparent', // 👈 fully invisible
          border: 'none',
          opacity: 0, // hidden but still clickable when active
          pointerEvents: isActive ? 'auto' : 'none', // 👈 block clicks in other stages
        }}
      />
    </div>
  );
}
