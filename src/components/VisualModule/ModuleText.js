import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

export default function ModuleText({ millerModule, className }) {
  return (
    <ReactMarkdown className={classNames('text-object-story', className)} skipHtml={true}>
      {millerModule.text.content}
    </ReactMarkdown>
  )
}
