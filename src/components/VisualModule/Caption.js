import ReactMarkdown from 'react-markdown'

export default function Caption({ caption, type, year }) {
  return (
    <div className="text-caption-story mt-2">
      <span className="year-type-caption text-cadet-blue me-1">
        <span className="text-uppercase">{type}</span> {year && `(${year})`}
      </span>
      <ReactMarkdown
        className="ml-2 text-black text-decoration-none"
        skipHtml={true}
      >
        {caption}
      </ReactMarkdown>
    </div>
  )
}
