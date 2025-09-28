import { ITask, IUser } from "@/types";
import { AlertTriangle, Calendar, CheckCircle2, Circle, Clock, MoreVertical } from "lucide-react";
import moment from "moment-timezone";

export const TaskCard = ({ task, onMarkComplete, loading }: { task: ITask, onMarkComplete?: (task: ITask) => void, loading?: boolean }) => {
  const formatDate = (dateString: string) => moment(dateString).format('MMM D, h:mm A');
  const formatRelativeTime = (dateString: string) => moment(dateString).fromNow();
  const isOverdue = (dateString: string) => moment().isAfter(moment(dateString));

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Helper to get initials from fullName or email
  // const getInitials = (user: IUser) => {
  //   if (user?.avatar) return user?.avatar;
  //   if (user.fullName) {
  //     const parts = user.fullName.split(' ');
  //     if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  //     return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  //   }
  //   if (user.name) {
  //     const parts = user.name.split(' ');
  //     if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  //     return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  //   }
  //   if (user.email) return user.email[0]?.toUpperCase() || '';
  //   return '?';
  // };

  const UserAvatar = ({ user, size = "sm" }: { user: IUser | null | undefined; size?: "sm" | "xs" }) => {
    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <div className={size === "xs" ? "text-xs" : "text-sm"}>
            <p className="font-medium text-gray-900 truncate max-w-[120px]">N/A</p>
            <p className="text-gray-500 text-xs truncate max-w-[120px]">-</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className={size === "xs" ? "text-xs" : "text-sm"}>
          <p className="font-medium text-gray-900 truncate max-w-[120px]">{user.fullName || user.name || user.email}</p>
          <p className="text-gray-500 text-xs truncate max-w-[120px]">{user.email || '-'}</p>
        </div>
      </div>
    );
  };

  // Treat missing status as 'pending'
  const status = task.status || 'pending';
  return (
    <div className={`${getStatusStyles(status)} rounded-xl p-4 mb-3 border shadow-sm hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            {getStatusIcon(status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {task.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityStyles(task.priority)}`}>
                {task.priority}
              </span>
              {isOverdue(task.dueDate) && status !== 'completed' && (
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
        {task.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Created By</p>
          <UserAvatar user={task.createdBy} size="xs" />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Assigned To</p>
          <UserAvatar user={task.assignedTo} size="xs" />
        </div>

   
      </div>

      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Created {formatRelativeTime(task.createdAt)}</span>
        </div>
        {/* Mark as Complete button */}
        {status === 'pending' ? (
          <button
            className="ml-auto bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
            onClick={() => onMarkComplete?.(task)}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            Mark as Complete
          </button>
        ) : status === 'completed' ? (
          <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">Task Completed</span>
        ) : null}
      </div>
    </div>
  );
};
