import React from 'react';
import { useStories } from '../../context/StoryContext';
import { AppNotification } from '../../types';
import {
  X,
  Bell,
  Sparkles,
  Award,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLink?: (link: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectLink,
}) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useStories();

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'premium_eligibility':
        return <Sparkles className="w-4 h-4 text-[#26F7F7]" />;
      case 'writer_certificate':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'payment_confirmed':
      case 'subscription_active':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'suggestion':
      case 'review':
      case 'story_rating':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col text-slate-900 border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-800" />
            <h3 className="font-bold text-base">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.link && onSelectLink) onSelectLink(n.link);
                }}
                className={`p-3 rounded-2xl transition-colors cursor-pointer space-y-1 ${
                  !n.isRead ? 'bg-teal-50/50 hover:bg-teal-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 text-white shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <span className="font-bold text-xs text-slate-900 leading-tight">
                      {n.title}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-xs text-slate-600 pl-8 leading-snug">{n.message}</p>
                <p className="text-[10px] text-slate-400 pl-8 font-mono">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
