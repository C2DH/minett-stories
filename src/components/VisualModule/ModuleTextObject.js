import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ millerModule }) {
  return (
    <div className="d-flex flex-column">
      <ModuleText
        millerModule={millerModule}
        className={classNames({
          'order-1': millerModule.layout === 'object-text',
        })}
      />
      {millerModule.object.document && (
        <DocumentObject
          doc={millerModule.object.document}
          caption={
            millerModule.object.caption ||
            millerModule.object.document.data.title
          }
          className={classNames('my-3', {
            'order-0': millerModule.layout === 'object-text',
          })}
        />
      )}
    </div>
  )
}