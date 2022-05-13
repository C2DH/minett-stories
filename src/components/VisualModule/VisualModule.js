import ModuleBiobliography from './ModuleBibliography'
import ModuleGallery from './ModuleGallery'
import ModuleObject from './ModuleObject'
import ModuleText from './ModuleText'
import ModuleTextGallery from './ModuleTextGallery'
import ModuleTextObject from './ModuleTextObject'

export default function VisualModule({ millerModule }) {
  console.log(millerModule.module)
  switch (millerModule.module) {
    case 'text_object':
      return <ModuleTextObject millerModule={millerModule} />
    case 'text':
      return (
        <div className="row">
          <ModuleText
            className={
              'text-black offset-md-3 col-md-6 mt-2 mb-2 offset-gigaxl-4 col-gigaxl-4'
            }
            millerModule={millerModule}
          />
        </div>
      )
    case 'object':
      return <ModuleObject millerModule={millerModule} />
    case 'text_gallery':
      return <ModuleTextGallery millerModule={millerModule} />
    case 'gallery':
      return <ModuleGallery millerModule={millerModule} />
    case 'text_bibliography':
      return <ModuleBiobliography className={
        'offset-md-3 pb-5 col-md-6 mt-2 mb-2 offset-gigaxl-4 col-gigaxl-4'
      } millerModule={millerModule} />
    default:
      console.warn('Missing Component for Miller Module', millerModule.module)
      return null
  }
}
