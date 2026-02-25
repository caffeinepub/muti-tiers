import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TierCategory {
    tier: string;
    category: string;
}
export type RankingGroup = string;
export interface PlayerRanking {
    region: string;
    title: string;
    username: string;
    badges: Array<TierCategory>;
    uuid: string;
    rankPosition: bigint;
    points: bigint;
}
export interface UserProfile {
    name: string;
}
export interface RawRankingData {
    axe: Array<PlayerRanking>;
    smp: Array<PlayerRanking>;
    uhc: Array<PlayerRanking>;
    mace: Array<PlayerRanking>;
    nethop: Array<PlayerRanking>;
    spear: Array<PlayerRanking>;
    sword: Array<PlayerRanking>;
    vanilla: Array<PlayerRanking>;
    overall: Array<PlayerRanking>;
    spearMace: Array<PlayerRanking>;
    diamondSmp: Array<PlayerRanking>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPlayer(rankingCategory: string, player: PlayerRanking): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPlayers(): Promise<Array<PlayerRanking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMaxRankedPoints(): Promise<bigint>;
    getPlayer(_playerName: string): Promise<PlayerRanking | null>;
    getPlayerRankByRanking(_playerName: string): Promise<PlayerRanking | null>;
    getPlayersByCategory(categoryKey: string): Promise<Array<PlayerRanking>>;
    getRankingCategories(): Promise<RankingGroup>;
    getRankingCategory(): Promise<RankingGroup>;
    getRankingEntryCount(): Promise<bigint>;
    getRawRankingData(): Promise<RawRankingData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removePlayer(uuid: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPlayersByName(_searchTerm: string): Promise<Array<PlayerRanking>>;
    switchRankingCategory(category: RankingGroup): Promise<RankingGroup>;
}
