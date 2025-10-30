// utils/color.ts
export const getUserColor = (username: string) => {
  const colors = [
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-pink-200',
    'bg-purple-200',
    'bg-orange-200',
    'bg-teal-200',
    'bg-indigo-200',
    'bg-red-200',
    'bg-lime-200',
    'bg-cyan-200',
    'bg-rose-200',
    'bg-fuchsia-200',
    'bg-violet-200',
    'bg-amber-200',
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
