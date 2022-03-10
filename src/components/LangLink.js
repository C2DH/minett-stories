import { Link } from 'react-router-dom'
import { useLangPathPrefix } from '../hooks/langs'

/**
 * @param {{ to: string }} props
 */
export default function LangLink({ to, ...props }) {
  const prefix = useLangPathPrefix()
  return <Link {...props} to={`${prefix}${to}`} />
}
