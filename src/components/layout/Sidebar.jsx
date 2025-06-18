import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Badge from '../common/Badge';

const MENU = [
  { to: '/', label: '대시보드', icon: () => <span>🏠</span> },
  { to: '/editor', label: '에디터', icon: () => <span>✍️</span> },
  { to: '/analysis', label: '분석', icon: () => <span>📊</span> },
  { to: '/templates', label: '템플릿', icon: () => <span>📄</span> },
  { to: '/coaching', label: 'AI 코치', icon: () => <span>🤖</span> },
  { to: '/subscription', label: '구독', icon: () => <span>💳</span> },
];

export default function Sidebar() {
  const { subscription } = useUser();
  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 py-6 px-3 gap-2">
      <div className="mb-6">
        <Badge variant={subscription.plan === 'FREE' ? 'default' : 'primary'}>
          {subscription.plan} 플랜
        </Badge>
      </div>
      <nav className="flex flex-col gap-1">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 ' +
              (isActive ? 'bg-blue-100 font-semibold text-blue-700' : 'text-gray-700')
            }
          >
            {item.icon()} {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 