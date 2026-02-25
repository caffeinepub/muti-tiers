import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
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

  public type UserProfile = {
    name : Text;
  };

  public type OldRawRankingData = {
    overall : [PlayerRanking];
    ltms : [PlayerRanking];
    vanilla : [PlayerRanking];
    uhc : [PlayerRanking];
    pot : [PlayerRanking];
    nethop : [PlayerRanking];
    smp : [PlayerRanking];
    sword : [PlayerRanking];
    axe : [PlayerRanking];
    mace : [PlayerRanking];
  };

  public type NewRawRankingData = {
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

  public type OldActor = {
    var activeRankingCategory : Text;
    players : Map.Map<Text, PlayerRanking>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public type NewActor = {
    var activeRankingCategory : Text;
    players : Map.Map<Text, PlayerRanking>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
