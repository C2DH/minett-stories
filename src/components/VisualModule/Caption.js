import ReactMarkdown from 'react-markdown'
import { CornerLeftUp } from 'react-feather'

export default function Caption({ caption }) {
  return (
    <div className="d-flex align-items-start mt-2">
      {/* <CornerLeftUp size="14px" color={'#00b37f'} className="flex-shrink-0" /> */}
      <ReactMarkdown className="ml-2 text-black text-decoration-none" skipHtml={true}>
        {caption}
      </ReactMarkdown>
    </div>
  )
}
