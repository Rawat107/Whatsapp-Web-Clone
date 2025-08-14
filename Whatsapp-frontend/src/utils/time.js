
export const formatListTime = (timestamp) => {
  const ts = parseInt(timestamp);
  const date = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  if (msgDate === today) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (msgDate === (today - 86400000)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const formatMessageTime = (timestamp) => {
  const ts = parseInt(timestamp);
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};