import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module TierCategory {
    public func compare(tierCategory1 : TierCategory, tierCategory2 : TierCategory) : Order.Order {
      Text.compare(tierCategory1.category, tierCategory2.category);
    };
  };

  module PlayerRanking {
    public type CompareByAttribute = (PlayerRanking, PlayerRanking) -> Order.Order;

    public func compare(playerRanking1 : PlayerRanking, playerRanking2 : PlayerRanking) : Order.Order {
      Text.compare(playerRanking1.username, playerRanking2.username);
    };

    public func compareByPoints(playerRanking1 : PlayerRanking, playerRanking2 : PlayerRanking) : Order.Order {
      Nat.compare(playerRanking1.points, playerRanking2.points);
    };

    public func compareByRegion(playerRanking1 : PlayerRanking, playerRanking2 : PlayerRanking) : Order.Order {
      Text.compare(playerRanking1.region, playerRanking2.region);
    };
  };

  public type PlayerRanking = {
    username : Text;
    uuid : Text;
    rankPosition : Nat;
    title : Text;
    points : Nat;
    region : Text;
    badges : [TierCategory];
  };

  public type TierCategory = {
    category : Text;
    tier : Text;
  };

  public type RankingsByCategory = {
    category : RankingGroup;
    entries : [PlayerRanking];
  };

  public type RawRankingData = {
    overall : [PlayerRanking];
    spearMace : [PlayerRanking];
    vanilla : [PlayerRanking];
    uhc : [PlayerRanking];
    diamondSmpNethopSpear : [PlayerRanking];
    nethop : [PlayerRanking];
    smp : [PlayerRanking];
    sword : [PlayerRanking];
    axe : [PlayerRanking];
    mace : [PlayerRanking];
  };

  public type RankingGroup = Text;

  public type UserProfile = {
    name : Text;
  };

  let rankingCategories = [
    "overall",
    "spearMace",
    "vanilla",
    "uhc",
    "diamondSmpNethopSpear",
    "nethop",
    "smp",
    "sword",
    "axe",
    "mace",
  ];

  var activeRankingCategory = rankingCategories[0];

  let players = Map.empty<Text, PlayerRanking>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: switch the active ranking category
  public shared ({ caller }) func switchRankingCategory(category : RankingGroup) : async RankingGroup {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can switch ranking categories");
    };
    activeRankingCategory := category;
    for (cat in rankingCategories.values()) {
      if (cat == category) {
        return cat;
      };
    };
    activeRankingCategory;
  };

  // Admin-only: add a player to the rankings
  public shared ({ caller }) func addPlayer(player : PlayerRanking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add players");
    };
    players.add(player.uuid, player);
  };

  public query ({ caller }) func getRawRankingData() : async RawRankingData {
    let emptyData = Array.empty<PlayerRanking>();

    {
      overall = emptyData;
      spearMace = emptyData;
      vanilla = emptyData;
      uhc = emptyData;
      diamondSmpNethopSpear = emptyData;
      nethop = emptyData;
      smp = emptyData;
      sword = emptyData;
      axe = emptyData;
      mace = emptyData;
    };
  };

  public query ({ caller }) func searchPlayersByName(searchTerm : Text) : async [PlayerRanking] {
    players.values().toArray();
  };

  public query ({ caller }) func getMaxRankedPoints() : async Nat {
    0;
  };

  public query ({ caller }) func getPlayerRankByRanking(_playerName : Text) : async ?PlayerRanking {
    let entries = players.toArray();
    if (entries.size() > 0) { ?(entries[0]).1 } else { null };
  };

  public query ({ caller }) func getAllPlayers() : async [PlayerRanking] {
    players.values().toArray();
  };

  public query ({ caller }) func getPlayer(_playerName : Text) : async ?PlayerRanking {
    let playerEntries = players.toArray();
    if (playerEntries.size() > 0) { ?(playerEntries[0]).1 } else { null };
  };

  public query ({ caller }) func getRankingCategory() : async RankingGroup {
    activeRankingCategory;
  };

  public query ({ caller }) func getRankingCategories() : async RankingGroup {
    activeRankingCategory;
  };

  func sortPlayerRankingsByAttribute(playerRankings : [PlayerRanking], compareFunc : PlayerRanking.CompareByAttribute) : [PlayerRanking] {
    playerRankings.sort(compareFunc);
  };

  public query ({ caller }) func getRankingEntryCount() : async Nat {
    0;
  };
};
