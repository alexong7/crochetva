
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

import {defineField, defineType} from 'sanity/lib/exports'
import {defineConfig} from 'sanity/lib/exports'

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
