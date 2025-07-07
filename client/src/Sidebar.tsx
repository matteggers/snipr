import React, {useState} from 'react';

type SidebarProps = {
  setView: (view: 'all' | 'liked' | 'disliked' | 'readLater' | 'todays') => void;
};
const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`} style={{ width: collapsed ? 50 : 200 }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ margin: 8, padding: 4 }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>
      {!collapsed && (
        <div>
          <h2>Menu</h2>
          <button onClick={() => setView('todays')}>Today's Articles</button>
          <button onClick={() => setView('all')}>All Articles</button>
          <button onClick={() => setView('liked')}>Liked</button>
          <button onClick={() => setView('disliked')}>Disliked</button>
          <button onClick={() => setView('readLater')}>Read Later</button>
        </div>
      )}
    </div>
  );
};
export default Sidebar; 