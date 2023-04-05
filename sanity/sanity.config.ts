
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

import {defineConfig} from 'sanity'

export default defineConfig({
  name: 'default',
  title: 'Crochetva DB',

  projectId: 'sw6ks9ca',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
