import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ millerModule }) {
  return (
    <div className="row">
      <div className="offset-md-1 mt-5 col-md-2">
        {millerModule.object.document && (
          <DocumentObject
            doc={millerModule.object.document}
            caption={
              millerModule.object.caption ||
              millerModule.object.document.data.title
            }
            className={classNames({
              'order-0': millerModule.layout === 'object-text',
            })}
          />
        )}
      </div>
      <div className='col-md-6'>
      <ModuleText
        millerModule={millerModule}
        className={classNames('text-black mt-5 mb-5', {
          'order-1': millerModule.layout === 'object-text',
        })}
      />
      </div>
    </div>
  )
}
