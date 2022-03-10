import { NavLink } from 'react-router-dom'
import { useLangPathPrefix } from '../hooks/langs'

/**
 * @param {{ to: string }} props
 */
export default function NavLangLink({ to, ...props }) {
  const prefix = useLangPathPrefix()
  return <NavLink {...props} to={`${prefix}${to}`} />
}
