export function isValidAdminEmail(value: string): boolean {
  const email = value.trim();

  const at = email.indexOf("@");

  if (at <= 0 || at !== email.lastIndexOf("@")) {
    return false;
  }

  const dot = email.indexOf(".", at + 2);

  if (dot < 0 || dot === email.length - 1) {
    return false;
  }

  for (const character of email) {
    if (character.trim().length === 0) {
      return false;
    }
  }

  return true;
}