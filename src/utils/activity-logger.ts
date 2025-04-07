// utils/activityLogger.js

interface ActivityLogEntry {
  activity: string;
  timestamp: string;
}

const activityLog: ActivityLogEntry[] = [];

export const logActivity = (activity: string): void => {
  const timestamp: string = new Date().toISOString();
  activityLog.push({ activity, timestamp });
};

export const getActivityLog = () => {
  return [...activityLog].reverse(); // Return a copy of the log in reverse chronological order
};
