import DocumentObject from './DocumentObject'

export default function ModuleObject({ millerModule }) {
  return (
    <DocumentObject
      doc={millerModule.document}
      size={millerModule.size}
      caption={millerModule.caption || millerModule.document.data.title}
      className="mt-3"
    />
  )
}
