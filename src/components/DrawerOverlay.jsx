import React, { useEffect } from 'react';

export default function DrawerOverlay({ title, onClose, children }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <>
            <div className="drawer-backdrop" onClick={onClose} />
            <aside className="drawer-panel" role="complementary" aria-label={title}>
                <div className="drawer-header">
                    <h3>{title}</h3>
                    <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
                        &times;
                    </button>
                </div>
                <div className="drawer-body">
                    {children}
                </div>
            </aside>
        </>
    );
}
