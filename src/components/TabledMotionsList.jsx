import React from 'react';

export default function TabledMotionsList({ tabledMotions, isChair, onTakeFromTable }) {
    if (!tabledMotions || tabledMotions.length === 0) return null;

    return (
        <div className="sidebar-list">
            <h4 className="sidebar-list-title">Tabled Motions ({tabledMotions.length})</h4>
            {tabledMotions.map((item, idx) => (
                <div key={idx} className="sidebar-list-item">
                    <div>{item.mainMotionText}</div>
                    <div className="sidebar-list-meta">
                        Tabled at {new Date(item.tabledAt).toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
