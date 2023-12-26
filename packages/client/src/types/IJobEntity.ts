import { LikliHood } from "src/enums";

export default interface IJobEntity {
    id: string
    name: string
    total_matches: number
    match: LikliHood | string
}
