import { IRequestUser } from "./requestUser.interface";


declare global {
    namespace Express{
        interface Request {
            user : IRequestUser
        }
    }
}

declare global {
    namespace Express{
        interface Request {
            viewerId : string
        }
    }
}