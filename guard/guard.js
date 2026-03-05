const ALLOWED_GROUPS = ["Cea304ea2f60c5dda2e123dd62e00a10e"];

export async function checkPermission(groupId, userId) {
  if (!ALLOWED_GROUPS.includes(groupId)) return false;
  return true;
}
