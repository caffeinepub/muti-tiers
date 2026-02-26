import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
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
    diamondSmp : [PlayerRanking];
    spear : [PlayerRanking];
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

  // Store all categories in a single array for easy removal.
  var playerRecords : [(Text, PlayerRanking)] = [];
  var activeRankingCategory = "overall";
  let rankingCategories = [
    "overall",
    "spearMace",
    "vanilla",
    "uhc",
    "diamondSmp",
    "spear",
    "nethop",
    "smp",
    "sword",
    "axe",
    "mace",
  ];

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // addPlayer is intentionally open to any caller.
  public shared ({ caller }) func addPlayer(rankingCategory : Text, player : PlayerRanking) : async () {
    let filteredBadges = player.badges.filter(
      func(category) {
        category.tier.trim(#char(' ')) != "";
      }
    );
    let updatedPlayer = { player with badges = filteredBadges };
    playerRecords := playerRecords.concat([(rankingCategory, updatedPlayer)]);
  };

  // Removes a player from all category entries by player UUID.
  public shared ({ caller }) func removePlayer(uuid : Text) : async () {
    playerRecords := playerRecords.filter(
      func(entry) { entry.1.uuid != uuid }
    );
  };

  public query ({ caller }) func getPlayersByCategory(categoryKey : Text) : async [PlayerRanking] {
    playerRecords
      .filter(func(record) { record.0 == categoryKey })
      .map(func(record) { record.1 });
  };

  public query ({ caller }) func getRawRankingData() : async RawRankingData {
    let emptyData = Array.empty<PlayerRanking>();

    {
      overall = getPlayersByCategoryForRaw("overall");
      spearMace = emptyData;
      vanilla = getPlayersByCategoryForRaw("vanilla");
      uhc = getPlayersByCategoryForRaw("uhc");
      diamondSmp = getPlayersByCategoryForRaw("diamondSmp");
      spear = getPlayersByCategoryForRaw("spear");
      nethop = getPlayersByCategoryForRaw("nethop");
      smp = getPlayersByCategoryForRaw("smp");
      sword = getPlayersByCategoryForRaw("sword");
      axe = getPlayersByCategoryForRaw("axe");
      mace = getPlayersByCategoryForRaw("mace");
    };
  };

  func getPlayersByCategoryForRaw(categoryKey : Text) : [PlayerRanking] {
    playerRecords
      .filter(func(record) { record.0 == categoryKey })
      .map(func(record) { record.1 });
  };

  public query ({ caller }) func searchPlayersByName(_searchTerm : Text) : async [PlayerRanking] {
    [];
  };

  public query ({ caller }) func getMaxRankedPoints() : async Nat {
    0;
  };

  public query ({ caller }) func getPlayerRankByRanking(_playerName : Text) : async ?PlayerRanking {
    if (playerRecords.size() > 0) { ?playerRecords[0].1 } else { null };
  };

  public query ({ caller }) func getAllPlayers() : async [PlayerRanking] {
    playerRecords.map(func(record) { record.1 });
  };

  public query ({ caller }) func getPlayer(_playerName : Text) : async ?PlayerRanking {
    if (playerRecords.size() > 0) { ?playerRecords[0].1 } else { null };
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
