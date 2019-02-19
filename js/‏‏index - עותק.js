"use strict";

//Window Functions + Global Variables

let toggledCoins = new Array();
let toggledOffCoins = new Array();

//Continuing The "setTimeout" Function Of Removing A Key From SessionStorage If Page Gets Reloaded
if (sessionStorage.length > 0) {
    let keySetTime, currentTime, timePassed, timeRemaining;
    for (let i = 0; i < sessionStorage.length; i++) {

        let currentKey = sessionStorage.key(i);

        keySetTime = JSON.parse(sessionStorage.getItem(sessionStorage.key(currentKey))).set_time;
        currentTime = new Date().getTime();
        timePassed = currentTime - keySetTime;
        timeRemaining = 10000 - timePassed;

        setTimeout(function () {
            sessionStorage.removeItem(sessionStorage.key(currentKey));
        }, timeRemaining);
    }
}

//IIFE
(() => {

    //Call Elements Creation on First Load
    if (window.location.hash == "" || window.location.hash == "#home") {
        createHomeElements();
        $(".nav-link:first").addClass("active");

    } else if (window.location.hash == "#liveReports") {
        createReportsElements();
        $(".nav-link").eq(1).addClass("active");

    } else if (window.location.hash == "#about") {
        // createAboutElements();
        $(".nav-link").eq(2).addClass("active");

    }

    $(".nav-link").click(function () {

        // Mark Only Clicked Button
        $(".nav-link").removeClass('active');
        $(this).addClass('active');

        // Show Selected Content After Page's Query String Changes
        let $prevQuery = window.location.hash;

        setTimeout(function () {

            let $currentQuery = window.location.hash;

            if ($currentQuery === $prevQuery) {
                return;
            }

            // if ($currentQuery === "#home") {

            //     createHomeElements();
            // }

            if (($prevQuery === "#home" || $prevQuery == "") && $currentQuery === "#liveReports") {
                createReportsElements();

                $("#contentBox2").css("animation", "fadeInLeft 0.4s");
                $("#contentBox").css("animation", "fadeOutLeft 0.4s");

                $("#contentBox").on('animationstart', function () { $("main").css("min-height", $(this).css("height")) });
                $("#contentBox").on('animationend', function () { $(this).remove() });
                $("#contentBox2").on('animationend', function () {
                    $(this).css("display", "block");
                    $("main").removeAttr("style");
                });



            }
            if ($prevQuery === "#liveReports" && $currentQuery === "#home") {
                createHomeElements();

                $("#contentBox").css("animation", "fadeInRight 0.4s");
                $("#contentBox2").css("animation", "fadeOutRight 0.4s");

                $("#contentBox").on('animationstart', function () { $("main").css("min-height", $(this).css("height")) });
                $("#contentBox2").on('animationend', function () { $(this).remove() });
                $("#contentBox").on('animationend', function () {
                    $(this).css("display", "block");
                    $("main").removeAttr("style");
                });

            }


        }, 10);

    });

    async function createHomeElements() {

        try {
            let $mainBufferIcon = $("<img id='mainBufferIcon' src='./assets/images/loading.png'>");
            let $contentBox = $("<div id='contentBox'><div id='coinsBox'></div></div>");
            $("main").append($contentBox)
            $("#contentBox").append($mainBufferIcon);
            let coinCards = await fetchData("https://api.coingecko.com/api/v3/coins/list");

            $.each(coinCards, function (index, coin) {

                let $card = $("<div></div>").addClass('card');
                let $symbolPara = $("<p></p>").addClass('symbolPara');
                let $idPara = $("<p></p>").addClass('idPara');

                //Defining "More Info" Collapser
                let $infoBtn = $("<button>More Info</button>").addClass('infoBtn');
                $infoBtn.click(function () {
                    let $currentColl = $(this).next();

                    $currentColl.toggleClass("activeColl");

                    getMoreInfo($currentColl);
                });

                let $collapseDiv = $("<div></div>").addClass('collapser');

                //Defining Toggle Button
                let $toggleButton = $("<button></button>").addClass('toggleButton');
                $toggleButton.append("<span></span>");
                $toggleButton.click(function () {

                    let $clickedButton = $(this);
                    if ($clickedButton.children(":first").hasClass("toggled")) {

                        $clickedButton.children(":first").removeClass("toggled");
                        let $toggledOffCoin = $(this).siblings(".symbolPara").text();

                        toggledCoins.splice($.inArray($toggledOffCoin, toggledCoins), 1);
                        console.log(toggledCoins);

                    } else {

                        if (toggledCoins.length < 5) {

                            $clickedButton.children(":first").addClass("toggled");
                            let currentCoin = $clickedButton.siblings(".symbolPara").text();
                            toggledCoins.push(currentCoin);

                            console.log(toggledCoins);

                        } else {

                            //Pop Modal With Selected Coins
                            $("#modal").fadeIn();

                            for (let i = 0; i < 5; i++) {

                                // let $toggledCoinDiv = $("<div></div>").addClass("toggledCoinDiv");
                                // $toggleButton.children(":first").addClass("toggled");

                                // let $toggledCoinID = $("<span></span>").addClass("toggledCoinID");
                                // $toggledCoinID.text(toggledCoins[i]);
                                // $toggledCoinDiv.append($toggledCoinID, $toggleButton);

                                let $toggledCoinsDiv = $("<div class='toggledCoinDiv'><button class='toggleButton'><span class='toggled'></span></button>" +
                                    "<span class='toggledCoinID'>" + toggledCoins[i].toUpperCase() + "</span></div>");
                                $("#toggledCoinsBox").append($toggledCoinsDiv);
                                $("#modal .toggleButton").click(function () {

                                    let $clickedButton = $(this);
                                    if ($clickedButton.children(":first").hasClass("toggled")) {

                                        $clickedButton.children(":first").removeClass("toggled");
                                        let $toggledOffCoin = $(this).siblings(".toggledCoinID").text();

                                        toggledOffCoins.push($toggledOffCoin);
                                        console.log("OFF:", toggledOffCoins)

                                    }
                                })
                            }

                            $("#modal .btn-primary").click(() => {
                                for (let i = 0; i < toggledOffCoins.length; i++) {
                                    $(".symbolPara:contains(" + toggledOffCoins[i] + ")").siblings(".toggleButton").trigger("click");
                                }
                                $("#toggledCoinsBox").html("");
                                $("#modal").fadeOut();
                                toggledOffCoins = [];
                            });

                            $("#modal .btn-success").click(() => {
                                toggledOffCoins = [];
                                $("#toggledCoinsBox").html("");
                                $("#modal").fadeOut();
                            });
                        }
                    }
                });

                $symbolPara.html(coin.symbol.toUpperCase());
                $idPara.text(coin.id);

                $card.append($symbolPara, $idPara, $infoBtn, $collapseDiv, $toggleButton);
                $("#coinsBox").append($card);


                if (index == 99) {
                    return false;
                }
            });

            $("#mainBufferIcon").css("display", "none");
            $("#coinsBox").css("display", "block");

            //Check Ff Some Coins Are Already Toggled When Navigating Back To "Home"
            if (toggledCoins.length > 0) {
                for (let i = 0; i < toggledCoins.length; i++) {
                    $(".symbolPara:contains(" + toggledCoins[i] + ")").siblings(".toggleButton").children(":first").addClass("toggled");
                }
            }


        }
        catch (error) {
            console.log(error.status);
        }
    }

    async function fetchData(url) {

        let myPromise = new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: url,
                success: function (coins) {
                    resolve(coins);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        return myPromise;
    }

    async function getMoreInfo($currentColl) {

        if ($currentColl.hasClass("activeColl")) {

            //Check Session Storage for Info by Coin ID
            let coinID = $currentColl.siblings(".idPara").text();
            if (sessionStorage.getItem(coinID) == null) {

                //Fetch Coin Data + Image
                try {
                    let $bufferIcon = $("<img src='assets/images/loading.png' class='bufferIcon'>");
                    $currentColl.append($bufferIcon);
                    let coinData = await fetchData("https://api.coingecko.com/api/v3/coins/" + coinID);

                    //Setting Current Time Of Key Instertion In Case Page Gets Reloaded And The "setTimeout" Function Will Get Aborted:
                    let setTime = new Date().getTime();
                    let storageItem = {
                        "market_data": {
                            "current_price": {
                                "usd": coinData.market_data.current_price.usd,
                                "eur": coinData.market_data.current_price.eur,
                                "ils": coinData.market_data.current_price.ils
                            }

                        },
                        "image": {
                            "large": coinData.image.large,
                            "thumb": coinData.image.thumb
                        },
                        "set_time": setTime
                    };
                    sessionStorage.setItem(coinID, JSON.stringify(storageItem));

                    appendCoinData(coinData, $currentColl);


                    setTimeout(function () {
                        sessionStorage.removeItem(coinID);
                        $currentColl.parent().removeAttr("style");
                        $currentColl.html("");
                        $currentColl.removeClass("activeColl");
                    }, 10000)
                }
                catch (error) {
                    console.log(error.status);
                }

            } else {

                let coinData = sessionStorage.getItem(coinID);
                coinData = JSON.parse(coinData);
                appendCoinData(coinData, $currentColl);

            }


        } else {
            $currentColl.html("");
        }

    }

    async function fetchCoinData(url) {

        let myPromise = new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: url,
                success: function (coinData) {

                    resolve(coinData);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        return myPromise;
    }

    function appendCoinData(coinData, $currentColl) {

        //Changing Card Background
        $currentColl.children().remove();
        $currentColl.parent().css("background-image", "url(" + coinData.image.large + ")");
        $currentColl.parent().css("background-color", "transparent");
        $currentColl.parent().css("border", "none");
        $currentColl.parent().css("box-shadow", "none");
        $currentColl.parent().css("filter", "drop-shadow(1px 1px white) drop-shadow(-1px -1px white)" +
            "drop-shadow(1px -1px white) drop-shadow(-1px 1px white) drop-shadow(2px 2px 2px limegreen)" +
            "drop-shadow(-2px -2px 2px limegreen) drop-shadow(2px -2px 2px limegreen) drop-shadow(-2px 2px 2px limegreen)");

        //Appending Coin Data Into Collapser
        $currentColl.html("<span class='coinSymbols'>$ </span>" + coinData.market_data.current_price.usd +
            "<br><span class='coinSymbols'>€ </span>" + coinData.market_data.current_price.eur +
            "<br><span class='coinSymbols'>₪ </span>" + coinData.market_data.current_price.ils +
            "<br><img src='" + coinData.image.thumb + "'>");
    }

    //Reports Graph
    async function createReportsElements() {
        let $reportsDiv = $("<div id='contentBox2'><div id='chartContainer'></div></div>");
        $("main").append($reportsDiv);

        console.log(toggledCoins);
        let graphCoins = "";
        for (let i = 0; i < toggledCoins.length; i++) {
            if (i != toggledCoins.length - 1) {
                graphCoins += toggledCoins[i] + ",";
            } else {
                graphCoins += toggledCoins[i];
            }
        }
        console.log(graphCoins);

        let coinsValues = await $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + graphCoins + "&tsyms=USD");
        console.log(coinsValues);
        let coinsValuesNumbers = Object.values(coinsValues);
        let coinsValuesNames = Object.keys(coinsValues);
        

        let data = new Array();
        let dataPoints = new Array();

        for (let i = 0; i < toggledCoins.length; i++) {

            dataPoints.push([{ x: new Date("Sun Feb 03 2013 22:04:09"), y: coinsValuesNumbers[i].USD },
            // { x: new Date(2016, 0, 1), y: 2 },
            // { x: new Date(2016, 1, 1), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:11"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:13"), y: 2.5 },
            { x: new Date("Sun Feb 03 2013 22:04:15"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:17"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:19"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:21"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:23"), y: coinsValuesNumbers[i].USD },
            { x: new Date("Sun Feb 03 2013 22:04:25"), y: coinsValuesNumbers[i].USD }]);
        }
        console.log(dataPoints);
        for (let i = 0; i < toggledCoins.length; i++) {

            data.push({
                type: "spline",
                name: coinsValuesNames[i],
                axisYType: "secondary",
                showInLegend: true,
                xValueFormatString: "HH mm ss",
                yValueFormatString: "",
                dataPoints: dataPoints[i]
            });
            console.log(data);
            // data = [{
            //     "type": "spline",
            //     "name": "Profit",
            //     "axisYType": "secondary",
            //     "showInLegend": true,
            //     "xValueFormatString": "MMM YYYY",
            //     "yValueFormatString": "$#,##0.#",
            //     "dataPoints": [
            //         { "x": new Date(2016, 0, 1), "y": 19034.5 },
            //         { "x": new Date(2016, 1, 1), "y": 20015 },
            //         { "x": new Date(2016, 2, 1), "y": 27342 },
            //         { "x": new Date(2016, 3, 1), "y": 20088 },
            //         { "x": new Date(2016, 4, 1), "y": 20234 },
            //         { "x": new Date(2016, 5, 1), "y": 29034 },
            //         { "x": new Date(2016, 6, 1), "y": 30487 },
            //         { "x": new Date(2016, 7, 1), "y": 32523 },
            //         { "x": new Date(2016, 8, 1), "y": 20234 },
            //         { "x": new Date(2016, 9, 1), "y": 27234 },
            //         { "x": new Date(2016, 10, 1), "y": 33548 },
            //         { "x": new Date(2016, 11, 1), "y": 32534 }
            //     ]
            // },
            
            // {
            //     type: "spline",
            //     name: "Profit",
            //     axisYType: "secondary",
            //     showInLegend: true,
            //     xValueFormatString: "MMM YYYY",
            //     yValueFormatString: "$#,##0.#",
            //     dataPoints: [
            //         { x: new Date(2016, 0, 1), y: 19034.5 },
            //         { x: new Date(2016, 1, 1), y: 20015 },
            //         { x: new Date(2016, 2, 1), y: 27342 },
            //         { x: new Date(2016, 3, 1), y: 20088 },
            //         { x: new Date(2016, 4, 1), y: 20234 },
            //         { x: new Date(2016, 5, 1), y: 29034 },
            //         { x: new Date(2016, 6, 1), y: 30487 },
            //         { x: new Date(2016, 7, 1), y: 32523 },
            //         { x: new Date(2016, 8, 1), y: 20234 },
            //         { x: new Date(2016, 9, 1), y: 27234 },
            //         { x: new Date(2016, 10, 1), y: 33548 },
            //         { x: new Date(2016, 11, 1), y: 32534 }
            //     ]
            // }
            // // {
            // //     type: "spline",
            // //     name: "Profit",
            // //     axisYType: "secondary",
            // //     showInLegend: true,
            // //     xValueFormatString: "MMM YYYY",
            // //     yValueFormatString: "$#,##0.#",
            // //     dataPoints: [
            // //         { x: new Date(2016, 0, 1), y: 19034.5 },
            // //         { x: new Date(2016, 1, 1), y: 20015 },
            // //         { x: new Date(2016, 2, 1), y: 27342 },
            // //         { x: new Date(2016, 3, 1), y: 20088 },
            // //         { x: new Date(2016, 4, 1), y: 20234 },
            // //         { x: new Date(2016, 5, 1), y: 29034 },
            // //         { x: new Date(2016, 6, 1), y: 30487 },
            // //         { x: new Date(2016, 7, 1), y: 32523 },
            // //         { x: new Date(2016, 8, 1), y: 20234 },
            // //         { x: new Date(2016, 9, 1), y: 27234 },
            // //         { x: new Date(2016, 10, 1), y: 33548 },
            // //         { x: new Date(2016, 11, 1), y: 32534 }
            // //     ]
            // // }
            // ];
            // console.log(data);
        }
        let options = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Real-Time Coin Stocks"
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "States"
            },
            axisY: {
                title: "Units Sold",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: false
            },
            axisY2: {
                title: "Profit in USD",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: data
                // [{
                //     type: "spline",
                //     name: "Profit",
                //     axisYType: "secondary",
                //     showInLegend: true,
                //     xValueFormatString: "MMM YYYY",
                //     yValueFormatString: "$#,##0.#",
                //     dataPoints: [
                //         { x: new Date(2016, 0, 1), y: 19034.5 },
                //         { x: new Date(2016, 1, 1), y: 20015 },
                //         { x: new Date(2016, 2, 1), y: 27342 },
                //         { x: new Date(2016, 3, 1), y: 20088 },
                //         { x: new Date(2016, 4, 1), y: 20234 },
                //         { x: new Date(2016, 5, 1), y: 29034 },
                //         { x: new Date(2016, 6, 1), y: 30487 },
                //         { x: new Date(2016, 7, 1), y: 32523 },
                //         { x: new Date(2016, 8, 1), y: 20234 },
                //         { x: new Date(2016, 9, 1), y: 27234 },
                //         { x: new Date(2016, 10, 1), y: 33548 },
                //         { x: new Date(2016, 11, 1), y: 32534 }
                //     ]
                // },
                // {
                //     type: "spline",
                //     name: "Profit",
                //     axisYType: "secondary",
                //     showInLegend: true,
                //     xValueFormatString: "MMM YYYY",
                //     yValueFormatString: "$#,##0.#",
                //     dataPoints: [
                //         { x: new Date(2016, 0, 1), y: 19034.5 },
                //         { x: new Date(2016, 1, 1), y: 20015 },
                //         { x: new Date(2016, 2, 1), y: 27342 },
                //         { x: new Date(2016, 3, 1), y: 20088 },
                //         { x: new Date(2016, 4, 1), y: 20234 },
                //         { x: new Date(2016, 5, 1), y: 29034 },
                //         { x: new Date(2016, 6, 1), y: 30487 },
                //         { x: new Date(2016, 7, 1), y: 32523 },
                //         { x: new Date(2016, 8, 1), y: 20234 },
                //         { x: new Date(2016, 9, 1), y: 27234 },
                //         { x: new Date(2016, 10, 1), y: 33548 },
                //         { x: new Date(2016, 11, 1), y: 32534 }
                //     ]
                // },
                // {
                //     type: "spline",
                //     name: "Profit",
                //     axisYType: "secondary",
                //     showInLegend: true,
                //     xValueFormatString: "MMM YYYY",
                //     yValueFormatString: "$#,##0.#",
                //     dataPoints: [
                //         { x: new Date(2016, 0, 1), y: 19034.5 },
                //         { x: new Date(2016, 1, 1), y: 20015 },
                //         { x: new Date(2016, 2, 1), y: 27342 },
                //         { x: new Date(2016, 3, 1), y: 20088 },
                //         { x: new Date(2016, 4, 1), y: 20234 },
                //         { x: new Date(2016, 5, 1), y: 29034 },
                //         { x: new Date(2016, 6, 1), y: 30487 },
                //         { x: new Date(2016, 7, 1), y: 32523 },
                //         { x: new Date(2016, 8, 1), y: 20234 },
                //         { x: new Date(2016, 9, 1), y: 27234 },
                //         { x: new Date(2016, 10, 1), y: 33548 },
                //         { x: new Date(2016, 11, 1), y: 32534 }
                //     ]
                // }
                // ]
        };
        $("#chartContainer").CanvasJSChart(options);

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }





        //     async function callAjax() {

        //     let array = localStorage.getItem("array");
        //     let coinsNames = JSON.parse(array);

        //     let urlForAjax = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
        //     var currentCoinNameForChart = "";

        //     for (let i = 0; i < coinsNames.length; i++) {
        //         urlForAjax += coinsNames[i].symbol + ",";
        //         currentCoinNameForChart += (coinsNames[i].symbol + " ");
        //     }
        //     // currentCoinNameForChart+= ""
        //     var result = currentCoinNameForChart.split(" ");

        //     urlForAjax += "&tsyms=USD";
        //     console.log(urlForAjax);
        //     console.log(currentCoinNameForChart);

        //     let allCoins = await fetchDataForChart(urlForAjax);
        //     var coinsNameForChartLegend = "";
        //     var testArr = [];
        //     for (let coin in allCoins) {
        //         coinsNameForChartLegend += (coin) + " ";
        //         testArr.push(coin);
        //     }

        //     console.log("resultt == ", coinsNameForChartLegend, "and -->", coinsNameForChartLegend.response)

        //     var testresult = coinsNameForChartLegend.split(" ");
        //     // for (let i = 0; i < testresult.length; i++) {
        //     //     if (testresult[i] === "Error") {
        //     //         testresult[i] = "(no data)";
        //     //     }
        //     // }

        //     if (testresult[0] === "Response") {
        //         for (let i = 0; i < testresult.length; i++) {
        //             testresult[i] = ("coin" + (i + 1));
        //         }
        //         if (coinsNames.length > 0) {
        //             var currentCoinNameForChartTest = true;
        //         }
        //     }


        //     console.log("testresult =", testresult, testArr)

        //     for (let i = 0; i < testresult.length; i++) {
        //         // if(testresult[i] === ""){
        //         //     testresult[i]=("no data")
        //         // }
        //         if (result.length > testresult.length && testresult[0] !== "no data") {
        //             var currentCoinNameForChartTest = true;
        //         }
        //     }

        //     if (currentCoinNameForChartTest) {
        //         currentCoinNameForChart += "*"
        //     }

        //     var answer1 = "";

        //     for (var i = 0; i < result.length; i++) {
        //         for (var j = 0; j < testresult.length; j++) {
        //             if (result[i] === testresult[j]) {
        //                 answer1 += (testresult[j]);
        //                 // objMap[[i]=objMap[arr2]+1||1]
        //             }
        //         }
        //     }

        //     $("#messageForUser").append("Data valid only for " + answer1 + " Coins..")

        //     let dataPoints0 = [];
        //     let dataPoints1 = [];
        //     let dataPoints2 = [];
        //     let dataPoints3 = [];
        //     let dataPoints4 = [];

        //     if (answer1 > 0) {
        //         var answer2 = "data avaible to the " + answer1 + "coins";
        //     }
        //     else {
        //         answer2 = "";
        //     }

        //     if (currentCoinNameForChart.length < 1) {
        //         currentCoinNameForChart = "(No coins checked..)"
        //     } else {
        //         currentCoinNameForChart += " To USD"
        //     }


        //     // set timout for chart create because width isssues
        //     setTimeout(async function () {
        //         var chart = new CanvasJS.Chart("chartContainer", {
        //             zoomEnabled: true,
        //             zoomType: "xy",
        //             toolTip: {
        //                 content: "{legendText}: {y}"
        //             },
        //             title: {
        //                 fontFamily: "auto",
        //                 text: currentCoinNameForChart
        //             },
        //             axisY: {
        //                 title: "coin value",
        //                 titleFontFamily: "auto",
        //                 includeZero: true,
        //             },
        //             axisX: {
        //                 viewportMinimum: 0,
        //                 prefix: "beat ",
        //             },
        //             // width:100,
        //             data: [{
        //                 type: "line",
        //                 axisXIndex: 0,
        //                 dataPoints: dataPoints0,
        //                 showInLegend: true,
        //                 name: testresult[0],
        //                 legendText: testresult[0],
        //             }, {
        //                 type: "line",
        //                 axisXIndex: 1,
        //                 dataPoints: dataPoints1,
        //                 showInLegend: true,
        //                 name: "coin 2",
        //                 legendText: testresult[1]
        //             }, {
        //                 type: "line",
        //                 axisXIndex: 2,
        //                 dataPoints: dataPoints2,
        //                 showInLegend: true,
        //                 name: "coin 3",
        //                 legendText: testresult[2]
        //             }, {
        //                 type: "line",
        //                 axisXIndex: 3,
        //                 dataPoints: dataPoints3,
        //                 showInLegend: true,
        //                 name: "coin 4",
        //                 legendText: testresult[3]
        //             }, {
        //                 type: "line",
        //                 axisXIndex: 4,
        //                 dataPoints: dataPoints4,
        //                 showInLegend: true,
        //                 name: "coin 5",
        //                 legendText: testresult[4]
        //             }]
        //         });
        //         chart.render();

        //         var updateChart = async function () {

        //             chart.options.title.fontColor = "black";

        //             let allCoins = await fetchDataForChart(urlForAjax);

        //             let coinsPriceForChart = [];

        //             for (let coin in allCoins) {
        //                 coinsPriceForChart.push(allCoins[coin].USD);
        //             }

        //             let yVal0 = coinsPriceForChart[0];
        //             console.log(yVal0);

        //             // if (yVal0 === undefined) {
        //             //     chart.options.title.fontColor = "red";
        //             //     chart.render();
        //             // }

        //             dataPoints0.push({
        //                 y: yVal0
        //             });

        //             let yVal1 = coinsPriceForChart[1];

        //             // if (yVal1 === undefined) {
        //             //     chart.options.title.fontColor = "red";
        //             //     chart.render();
        //             // }

        //             dataPoints1.push({
        //                 y: yVal1
        //             });

        //             let yVal2 = coinsPriceForChart[2];

        //             dataPoints2.push({
        //                 y: yVal2
        //             });

        //             let yVal3 = coinsPriceForChart[3];

        //             dataPoints3.push({
        //                 y: yVal3
        //             });

        //             let yVal4 = coinsPriceForChart[4];

        //             dataPoints4.push({
        //                 y: yVal4
        //             });

        //             chart.render();
        //         };

        //         if (coinsNames.length > 0) {
        //             // update chart every 2 seconds
        //             setInterval(function () { updateChart() }, 2000);
        //         }

        //     }, 50);
        // }

    }




})();