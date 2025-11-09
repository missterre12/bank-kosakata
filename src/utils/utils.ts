import type { UsersData } from "../data/types"
import { pb } from "../pocketbase"

export const currentUser = () => {
    return pb.authStore.record as UsersData
}