import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

export default function ModuleBiobliography({ millerModule, className }) {
  return (
    <ReactMarkdown className={classNames('text-object-story-biblio', className)} skipHtml={true}>
      {millerModule.text.content}
    </ReactMarkdown>
  )
}
