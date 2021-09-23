import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import persistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
import { models, RootModel } from './rootModel'

const persistConfig = {
    key: 'root',
    storage,
  }

export const store = init<RootModel>({
    models,
    plugins: [immerPlugin()],
    // plugins: [persistPlugin(persistConfig), immerPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>