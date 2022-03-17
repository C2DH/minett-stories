import ModuleGallery from './ModuleGallery'
import ModuleObject from './ModuleObject'
import ModuleText from './ModuleText'
import ModuleTextGallery from './ModuleTextGallery'
import ModuleTextObject from './ModuleTextObject'

export default function VisualModule({ millerModule }) {
  switch (millerModule.module) {
    case 'text_object':
      return <ModuleTextObject millerModule={millerModule} />
    case 'text':
      return <ModuleText millerModule={millerModule} />
    case 'object':
      return <ModuleObject millerModule={millerModule} />
    case 'text_gallery':
      return <ModuleTextGallery millerModule={millerModule} />
    case 'gallery':
      return <ModuleGallery millerModule={millerModule} />
    default:
      console.warn('Missing Component for Miller Module', millerModule.module)
      return null
  }
}
