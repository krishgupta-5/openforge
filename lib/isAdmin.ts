export const ADMINS = [
  "krishgupta0072@gmail.com"
];

export function isAdmin(email?: string | null) {
  return email ? ADMINS.includes(email) : false;
}
