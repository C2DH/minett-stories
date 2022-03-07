import { useMatch } from "react-router-dom";

export function useIsMobile() {
  const match = useMatch('/m/*')
  return Boolean(match)
}