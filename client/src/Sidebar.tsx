import * as React from 'react';

type SidebarProps = {
  setView: (view: 'all' | 'liked' | 'disliked' | 'readLater' | 'todays') => void;
};

const Sidebar: React.FC<SidebarProps> = ({ setView }) => (
  <aside className="sidebar">
    <h2>Menu</h2>
    <button onClick={() => setView('todays')}>Today's Articles</button>
    <button onClick={() => setView('all')}>All Articles</button>
    <button onClick={() => setView('liked')}>Liked</button>
    <button onClick={() => setView('disliked')}>Disliked</button>
    <button onClick={() => setView('readLater')}>Read Later</button>
  </aside>
);
// add button for fetching.
export default Sidebar; 