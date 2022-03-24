import DocumentObject from './DocumentObject'

export default function ModuleObject({ millerModule }) {
  return (
    <div className='row'>
      <DocumentObject
        doc={millerModule.document}
        size={millerModule.size}
        caption={millerModule.caption || millerModule.document.data.title}
        className="mt-3"
      />
    </div>
  )
}
