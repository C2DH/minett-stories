import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ millerModule }) {
  return (
    <div className="row">
      <div
        className={classNames('mt-2',{
          'order-0 offset-gigaxl-2 offset-md-1 col-md-2': millerModule.layout === 'object-text',
          'order-1 col-md-2': millerModule.layout === 'text-object',
        })}
      >
        {millerModule.object.document && (
          <DocumentObject
            doc={millerModule.object.document}
            caption={
              millerModule.object.caption ||
              millerModule.object.document.data.title
            }
          />
        )}
      </div>
      <div
        className={classNames({
          'order-1 col-gigaxl-4 col-md-6': millerModule.layout === 'object-text',
          'order-0 offset-gigaxl-4 col-gigaxl-4 offset-md-3 col-md-6': millerModule.layout === 'text-object',
        })}
      >
        <ModuleText
          millerModule={millerModule}
          className={classNames('text-black mt-2 mb-2')}
        />
      </div>
    </div>
  )
}
