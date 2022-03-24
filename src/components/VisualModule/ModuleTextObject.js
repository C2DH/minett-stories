import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ millerModule }) {
  return (
    <div className="row d-flex flex-column">
      <ModuleText
        millerModule={millerModule}
        className={classNames('text-black offset-md-3 col-md-6 mt-5 mb-5',{
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
