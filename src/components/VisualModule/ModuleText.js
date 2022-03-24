import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

export default function ModuleText({ millerModule, className }) {
  return (
    <div className='row'>
      <ReactMarkdown className={classNames('my-2', className)} skipHtml={true}>
        {millerModule.text.content}
      </ReactMarkdown>
    </div>
  )
}
