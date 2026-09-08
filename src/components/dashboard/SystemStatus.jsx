import { memo } from 'react';
import { Cpu, Camera, Layers, HardDrive } from 'lucide-react';

function SystemStatus() {
  const statusItems = [
    {
      id: 'engine',
      label: 'AI Engine',
      status: 'Operational',
      sub: 'WebGL / WASM',
      icon: Cpu,
      color: 'var(--success)',
    },
    {
      id: 'camera',
      label: 'Webcam Feed',
      status: 'Ready',
      sub: 'Client Media Stream',
      icon: Camera,
      color: 'var(--success)',
    },
    {
      id: 'models',
      label: 'Vision Model',
      status: 'Ready',
      sub: 'TinyFace + Expressions',
      icon: Layers,
      color: 'var(--success)',
    },
    {
      id: 'storage',
      label: 'Data Storage',
      status: 'Local',
      sub: 'Client Isolated',
      icon: HardDrive,
      color: 'var(--info)',
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '16px 20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          alignItems: 'center',
        }}
      >
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  flexShrink: 0,
                }}
              >
                <Icon size={14} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: item.color,
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-heading)' }}>
                    {item.label}: {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>
                  {item.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(SystemStatus);
