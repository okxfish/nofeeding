import { Models } from '@rematch/core'
import { app } from './app'
import { globalModal } from './globalModal'
import { userInterface } from './userInterface'
import { userInfo } from './userInfo'
import { feed } from './feed'

export interface RootModel extends Models<RootModel> {
    app: typeof app,
    globalModal: typeof globalModal,
    userInterface: typeof userInterface,
    userInfo: typeof userInfo,
    feed: typeof feed,
}

export const models: RootModel = { 
    app, 
    globalModal,
    feed,
    userInterface,
    userInfo
}