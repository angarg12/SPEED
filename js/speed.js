angular.module('incremental', [])
    .controller('IncCtrl', ['$scope', '$document', '$interval', function ($scope, $document, $interval) {

    var lastUpdate = 0;
    var generatorPrice = 10;
    $scope.generators = 0;
    var upgradeBasePrice = 1;
    var clickUpgradeBasePrice = 1;
    $scope.upgrades = 0;
    $scope.clickUpgrades = 0;
    var click = 1;
    var initialGoal = 50;
    $scope.goal = initialGoal;
    var initialCountdown = 20;
    $scope.countdown = initialCountdown;
    $scope.money = 0;
    $scope.adrenaline = 0;
    var timer;
    $scope.time = $scope.countdown;
    $scope.goals = 0;
    $scope.maximumGoal = 0;
    $scope.started = false;
    $scope.wastedMessage = false;
    $scope.prediction = 0;
    var wastedTimer;

    $scope.click = function () {
        $scope.money += click + $scope.clickUpgrades;
    };

    function timerStart() {
        if (angular.isDefined(timer)) {
            return;
        }
        timer = $interval(timerDecrease, 1000);
    }

    function timerDecrease() {
        $scope.time--;
        if ($scope.time <= 0) {
            timerStop();
            dead();
        }
    }

    function timerStop() {
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
            timer = undefined;
        }
    }

    function dead() {
        $scope.wastedMessage = true;
        wastedTimer = $interval(removeWasted, 2000, 1);
        $scope.resetRun();
    }

    function removeWasted() {
        $scope.wastedMessage = false;
    }

    $scope.resetRun = function resetRun() {
        $scope.adrenaline += $scope.goals;
        $scope.generators = 0;
        $scope.goal = initialGoal;
        $scope.countdown = initialCountdown;
        $scope.money = 0;
        $scope.time = $scope.countdown;
        timerStart();
        if ($scope.goals > $scope.maximumGoal) {
            $scope.maximumGoal = $scope.goals;
        }
        $scope.goals = 0;
    }

    $scope.generatorPrice = function () {
        return (generatorPrice * Math.pow(1.2, $scope.generators)).toFixed();
    };

    $scope.upgradePrice = function () {
        return (upgradeBasePrice * $scope.upgrades + 1).toFixed();
    };

    $scope.clickUpgradePrice = function () {
        return (clickUpgradeBasePrice * $scope.clickUpgrades + 1).toFixed();
    };

    $scope.buyGenerator = function () {
        if ($scope.money >= $scope.generatorPrice()) {
            $scope.money -= $scope.generatorPrice();
            $scope.generators++;
        }
    };

    $scope.buyUpgrade = function () {
        if ($scope.adrenaline >= $scope.upgradePrice()) {
            $scope.adrenaline -= $scope.upgradePrice();
            $scope.upgrades++;
        }
    };

    $scope.buyClickUpgrade = function () {
        if ($scope.adrenaline >= $scope.clickUpgradePrice()) {
            $scope.adrenaline -= $scope.clickUpgradePrice();
            $scope.clickUpgrades++;
        }
    };

    function update() {
        var updateTime = new Date().getTime();
        var timeDiff = (Math.min(1000, Math.max(updateTime - lastUpdate, 0))) / 1000;

        lastUpdate = updateTime;
        moneyDiff = $scope.generators * timeDiff * (1 + $scope.upgrades);
        $scope.money += moneyDiff;
        $scope.prediction = $scope.money + ($scope.time / timeDiff) * moneyDiff;
        if ($scope.money >= $scope.goal) {
            nextGoal();
        }
    };

    function nextGoal() {
        $scope.goal *= 2;
        $scope.countdown *= 1.1;
        $scope.time = Math.round($scope.countdown);
        $scope.goals++;
    }

    $document.ready(function () {
        if ($scope.started == false) {
            $interval(update, 80);
            timerStart();
            $scope.started = true;
        }
    });
}]);