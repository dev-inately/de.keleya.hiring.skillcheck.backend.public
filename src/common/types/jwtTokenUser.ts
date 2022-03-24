export interface JwtTokenUser {
  username?: string | null;
  id: number | null;
  is_admin: boolean;
}

export const isJwtTokenUser = (candidate: unknown): candidate is JwtTokenUser => {
  const user = candidate as JwtTokenUser;
  return user.username !== undefined && user.id !== undefined;
};
