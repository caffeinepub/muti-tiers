import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type PlayerRanking = {
    username : Text;
    uuid : Text;
    rankPosition : Nat;
    title : Text;
    points : Nat;
    region : Text;
    badges : [TierCategory];
  };

  type TierCategory = {
    category : Text;
    tier : Text;
  };

  public type OldActor = {
    diamondSmp : [PlayerRanking];
    spear : [PlayerRanking];
    players : Map.Map<Text, PlayerRanking>;
    rankingCategories : [Text];
    activeRankingCategory : Text;
  };

  public type NewActor = {
    playerRecords : [(Text, PlayerRanking)];
    rankingCategories : [Text];
    activeRankingCategory : Text;
  };

  public func run(old : OldActor) : NewActor {
    let diamondSmpRecords = Array.tabulate(
      old.diamondSmp.size(),
      func(i) { ("diamondSmp", old.diamondSmp[i]) },
    );

    let spearRecords = Array.tabulate(
      old.spear.size(),
      func(i) { ("spear", old.spear[i]) },
    );

    let playerMapArray = old.players.toArray();
    let playerMapRecords = playerMapArray.map(
      func((uuid, player)) { (player.title, player) }
    );

    {
      playerRecords = diamondSmpRecords.concat(spearRecords).concat(playerMapRecords);
      rankingCategories = old.rankingCategories;
      activeRankingCategory = old.activeRankingCategory;
    };
  };
};
