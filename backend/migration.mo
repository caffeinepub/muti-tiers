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

  type Actor = {
    playerRecords : [(Text, PlayerRanking)];
    activeRankingCategory : Text;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
