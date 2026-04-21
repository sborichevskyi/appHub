import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store"

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(user);

  return { user, isAuthenticated };
};