import { Models } from '@rematch/core'
import { app } from './app'
import { globalModal } from './globalModal'
import { userInterface } from './userInterface'
import { feed } from './feed'

export interface RootModel extends Models<RootModel> {
    app: typeof app,
    globalModal: typeof globalModal,
    feed: typeof feed,
    userInterface: typeof userInterface,
}

export const models: RootModel = { 
    app, 
    globalModal,
    feed,
    userInterface,
}