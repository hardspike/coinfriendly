"use strict";

//Window Functions + Global Variables

let toggledCoins = new Array();
let toggledCoinsID = new Array();
let toggledOffCoins = new Array();
let animationFlag; // Marking that a page-swipe animation is currently running to prevent multiple animations from running at the same time.


//Continuing The "setTimeout" Function Of Removing A Key From SessionStorage If Page Gets Reloaded
if (sessionStorage.length > 0) {
    let keySetTime, currentTime, timePassed, timeRemaining;
    for (let i = 0; i < sessionStorage.length; i++) {

        let currentKey = sessionStorage.key(i);

        keySetTime = JSON.parse(sessionStorage.getItem(sessionStorage.key(currentKey))).set_time;
        currentTime = new Date().getTime();
        timePassed = currentTime - keySetTime;
        timeRemaining = 120000 - timePassed;

        setTimeout(function () {
            sessionStorage.removeItem(sessionStorage.key(currentKey));
        }, timeRemaining);
    }
}
$("nav h2").click(function () {
    document.location.href = "/";
});

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
        createAboutElements();
        $(".nav-link").eq(2).addClass("active");

    }
    //Clicking Menu Buttons
    $(".nav-link").click(function () {

        if (animationFlag == true) {
            return;
        }
        // Mark Only Clicked Button
        $(".nav-link").removeClass('active');
        $(this).addClass('active');

        // Show Selected Content After Page's Query String Changes
        // Calling "Page Swipe" Animation Sequel With Every Creation + Debugging
        let $prevQuery = window.location.hash;

        setTimeout(function () {

            let $currentQuery = window.location.hash;

            if ($currentQuery === $prevQuery) {
                return;
            }

            //Homepage
            if (($prevQuery === "#liveReports" || $prevQuery === "#about") && $currentQuery === "#home") {

                if (animationFlag == true) {
                    return;
                }

                createHomeElements();

                let contentNum = $prevQuery === "#liveReports" ? "2" : "3";
                $("#contentBox").css("animation", "fadeInRight 0.4s");
                $("#contentBox" + contentNum).css("animation", "fadeOutRight 0.4s");

                $("#contentBox").on('animationstart', function () {
                    $("main").css("min-height", $("#contentBox").css("height"));
                    animationFlag = true;
                    $(".nav-link").attr("href", window.location.hash);
                    setTimeout(function () {
                        $(".nav-link:first").attr("href", "#home");
                        $(".nav-link").eq(1).attr("href", "#liveReports");
                        $(".nav-link").eq(2).attr("href", "#about");
                        animationFlag = false;
                    }, 400);

                });
                $("#contentBox" + contentNum).on('animationend', function () { $(this).remove() });
                $("#contentBox").on('animationend', function () {
                    $(this).css("display", "block");
                    $("main").removeAttr("style");
                    animationFlag = false;
                });

            }
            //Live Reports
            if ((($prevQuery === "#home" || $prevQuery == "") || $prevQuery === "#about") && $currentQuery === "#liveReports") {

                if (animationFlag == true) {
                    return;
                }

                createReportsElements();

                let contentNum = ($prevQuery === "#home" || $prevQuery == "") ? "" : "3";
                let fadeDirection = ($prevQuery === "#home" || $prevQuery == "") ? "Left" : "Right";
                $("#contentBox2").css("animation", "fadeIn" + fadeDirection + " 0.4s");
                $("#contentBox" + contentNum).css("animation", "fadeOut" + fadeDirection + " 0.4s");

                $("#contentBox2").on('animationstart', function () {
                    $("main").css("min-height", $(this).css("height"));
                    animationFlag = true;
                    $(".nav-link").attr("href", window.location.hash);
                    setTimeout(function () {
                        $(".nav-link:first").attr("href", "#home");
                        $(".nav-link").eq(1).attr("href", "#liveReports");
                        $(".nav-link").eq(2).attr("href", "#about");
                        animationFlag = false;
                    }, 400);
                });
                $("#contentBox" + contentNum).on('animationend', function () { $(this).remove() });
                $("#contentBox2").on('animationend', function () {
                    $(this).css("display", "block");
                    $("main").removeAttr("style");
                    animationFlag = false;
                });



            }
            //About
            if (($prevQuery === "#home" || $prevQuery == "" || $prevQuery === "#liveReports") && $currentQuery === "#about") {

                if (animationFlag == true) {
                    return;
                }

                createAboutElements();

                let contentNum = $prevQuery === "#liveReports" ? "2" : "";
                $("#contentBox3").css("animation", "fadeInLeft 0.4s");
                $("#contentBox" + contentNum).css("animation", "fadeOutLeft 0.4s");

                $("#contentBox3").on('animationstart', function () {
                    $("main").css("min-height", $("#contentBox" + contentNum).css("height"));
                    animationFlag = true;
                    $(".nav-link").attr("href", window.location.hash);
                    setTimeout(function () {
                        $(".nav-link:first").attr("href", "#home");
                        $(".nav-link").eq(1).attr("href", "#liveReports");
                        $(".nav-link").eq(2).attr("href", "#about");
                        animationFlag = false;
                    }, 400);

                });
                $("#contentBox" + contentNum).on('animationend', function () { $(this).remove() });
                $("#contentBox3").on('animationend', function () {
                    $(this).css("display", "block");
                    $("main").removeAttr("style");
                    animationFlag = false;
                });

            }


        }, 10);

    });

    async function createHomeElements() {

        try {
            //Elements Definition
            //Search + Coin Counter
            let $searchWrapper = $("<div id='searchWrapper'></div>");
            let $countContainer = $("<div id='countContainer'></div>");
            let $countLabel = $("<label class='fas fa-coins'>#</label>");
            $countLabel.mouseover(function () {
                let $countGuidance = $("<p id='countGuidance'>Choose a number of coins to be displayed on next refresh. <br>(Over 4,000 total)</p>");
                $(this).parent().append($countGuidance);
            });
            $countLabel.mouseout(function () {
                $("#countGuidance").remove();
            });
            $countContainer.append($countLabel);
            let $countBox = $("<input type='number' id='countBox'>");
            $countBox.keyup(function () {
                if (!localStorage.getItem("coinCount")) { localStorage.setItem("coinCount", $(this).val()); }
                else {
                    localStorage.removeItem("coinCount");
                    localStorage.setItem("coinCount", $(this).val());
                }
            });
            $countBox.change(function () {
                if (!localStorage.getItem("coinCount")) { localStorage.setItem("coinCount", $(this).val()); }
                else {
                    localStorage.removeItem("coinCount");
                    localStorage.setItem("coinCount", $(this).val());
                }
            });
            $countContainer.append($countBox);
            //Loading Icon
            let $mainBufferIcon = $("<img id='mainBufferIcon' src='./assets/images/loading.png'>");
            let $contentBox = $("<div id='contentBox'></div>");
            let $coinsBox = $("<div id='coinsBox'></div>");
            let $searchBtn = $("<button class='fas fa-search' id='searchBtn'></button>");
            //Defining Search Button
            $searchBtn.click(function () {

                $(this).addClass("clickedSearchBtn");
                let $searchContainer = $("<div id='searchContainer'></div>");
                let $searchBox = $("<input id='searchBox'>");
                $searchBox.keyup(function () {

                    let $searchValue = $(this).val().toUpperCase();
                    let $foundResult = false;
                    if ($(".symbolPara:contains(" + $searchValue + ")")) {

                        let $matchingParagraphs = $(".symbolPara:contains(" + $searchValue + ")");
                        $.each($matchingParagraphs, function ($i, $v) {
                            if ($v.innerText == $searchValue) {
                                $(".card").css("display", "none");
                                $v.parentElement.style.display = "inline-block";
                                $foundResult = true;
                            }
                            if ($i == $matchingParagraphs.length - 1 && $v.innerText !== $searchValue && $foundResult == false) {
                                $(".card").css("display", "inline-block");
                            }
                        })
                    } else {
                        $(".card").css("display", "inline-block");
                    }
                });
                $searchContainer.append($searchBox);

                setTimeout(function () {
                    $searchWrapper.append($searchContainer);
                }, 500);
                setTimeout(function () {
                    $searchBtn.remove();
                }, 750);

            });
            $searchWrapper.append($countContainer, $searchBtn);
            let $homeHeader = $("<h1 class='contentHeader'>COINS</h1>");

            $coinsBox.append($searchWrapper, $homeHeader);
            $contentBox.append($coinsBox);
            $("main").append($contentBox);
            $("#contentBox").append($mainBufferIcon);

            //Getting Coins + Card Elements
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
                        let $toggledOffCoinID = $(this).siblings(".idPara").text();

                        toggledCoins.splice($.inArray($toggledOffCoin, toggledCoins), 1);
                        toggledCoinsID.splice($.inArray($toggledOffCoinID, toggledCoinsID), 1);
                        // console.log(toggledCoins, toggledCoinsID); //Coins Arrays

                    } else {
                        //Max 5 Toggled Coins
                        if (toggledCoins.length < 5) {

                            $clickedButton.children(":first").addClass("toggled");
                            let currentCoin = $clickedButton.siblings(".symbolPara").text();
                            let currentCoinID = $clickedButton.siblings(".idPara").text();
                            toggledCoins.push(currentCoin);
                            toggledCoinsID.push(currentCoinID);

                            // console.log(toggledCoins, toggledCoinsID); //Coins Arrays

                        } else {

                            //Pop Modal With Selected Coins
                            $("#modal").fadeIn();
                            let $bufferIcon = $("<img src='./assets/images/loading.png' class='bufferIcon'>");
                            $("#toggledCoinsBox").append($bufferIcon);
                            setTimeout(function() {
                                $("#modal .bufferIcon").remove();
                                $(".toggledCoinDiv").css("display", "inline-block");
                            }, 2000);

                            for (let i = 0; i < 5; i++) {

                                let coinData = fetchData("https://api.coingecko.com/api/v3/coins/" + toggledCoinsID[i]);
                                coinData.then(function (v) {
                                    let coinImg = v.image.thumb;

                                    let $toggledCoinsDiv = $("<div class='toggledCoinDiv' style='display: none'><button class='toggleButton'><span class='toggled'></span></button>" +
                                        "<br><span class='toggledCoinID'>" + toggledCoins[i].toUpperCase() + "</span><img src='" + coinImg + "'></div>");
                                    $("#toggledCoinsBox").append($toggledCoinsDiv);
                                    $("#modal .toggleButton").click(function () {

                                        let $clickedButton = $(this);
                                        if ($clickedButton.children(":first").hasClass("toggled")) {

                                            $clickedButton.children(":first").removeClass("toggled");
                                            let $toggledOffCoin = $(this).siblings(".toggledCoinID").text();

                                            toggledOffCoins.push($toggledOffCoin);
                                            // console.log("OFF:", toggledOffCoins); //Coins Array

                                        }
                                    })
                                });
                            }
                            //Toggling Coins Off/Canceling Action
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

                //Calling Specific Number Of Coins
                if (localStorage.getItem("coinCount")) {
                    if (index == parseInt(localStorage.getItem("coinCount")) - 1) {
                        return false;
                    }
                }
            });
            $("#countBox").attr("placeholder", $(".card").length);
            $("#mainBufferIcon").css("display", "none");
            $("#coinsBox").css("display", "block");

            //Check If Some Coins Are Already Toggled When Navigating Back To "Home"
            if (toggledCoins.length > 0) {
                for (let i = 0; i < toggledCoins.length; i++) {
                    $(".symbolPara:contains(" + toggledCoins[i] + ")").siblings(".toggleButton").children(":first").addClass("toggled");
                }
            }


        }
        catch (error) {
            alert(error.status);
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
                    let $bufferIcon = $("<img src='./assets/images/loading.png' class='bufferIcon'>");
                    $currentColl.append($bufferIcon);
                    let coinData = await fetchData("https://api.coingecko.com/api/v3/coins/" + coinID);

                    //Setting Current Time Of Key Instertion In Case Page Gets Reloaded And The "setTimeout" Function Gets Cancelled:
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
                    }, 120000)
                }
                catch (error) {
                    alert(error.status);
                }

            } else {
                //Get Saved Data
                let coinData = sessionStorage.getItem(coinID);
                coinData = JSON.parse(coinData);
                appendCoinData(coinData, $currentColl);

            }


        } else {
            //Closing Collapser
            $currentColl.html("");
        }

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

        let $reportsDiv = $("<div id='contentBox2'><h1 class='contentHeader'>LIVE REPORTS</h1><div id='chartContainer'></div></div>");
        $("main").append($reportsDiv);

        let graphCoins = "";
        for (let i = 0; i < toggledCoins.length; i++) {
            if (i != toggledCoins.length - 1) {
                graphCoins += toggledCoins[i] + ",";
            } else {
                graphCoins += toggledCoins[i];
            }
        }
        // console.log(graphCoins); // A Compatible String Of Coins For Query

        //Check For Selected Coins
        if (toggledCoins.length < 1) {

            $("#chartContainer").remove();
            $(".contentHeader").remove();
            let $sorryImg = $("<img id='sorry' src='./assets/images/sorry.png'>");
            let $noCoinsSpan = $("<span id='noCoins'></span>");
            $noCoinsSpan.html("You have not selected any coin to show market value for.<br>Go back to homepage and select some.");
            $("#contentBox2").append($noCoinsSpan, $sorryImg);
            return;
        }

        let coinsValues = await $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + graphCoins + "&tsyms=USD");
        // console.log(coinsValues); //Returned Coins
        //Check If Server Returns At Least One Value:
        if (coinsValues.Response == "Error") {

            $("#chartContainer").remove();
            $(".contentHeader").remove();
            let $sorryImg = $("<img id='sorry' src='./assets/images/sorry.png'>");
            let $noValuesSpan = $("<span id='noValues'></span>");
            $noValuesSpan.html("Server returned no values for your selected coins.<br>Appearently, not all coins' data exist on the server.<br>" +
                "Please go back to homepage and pick some different coins (ex. ZCN).");
            $("#contentBox2").append($noValuesSpan, $sorryImg);
            return;
        }
        let coinsValuesNumbers = Object.values(coinsValues);
        let coinsValuesNames = Object.keys(coinsValues);

        let data = new Array();
        let dataPoints = new Array();

        for (let i = 0; i < coinsValuesNames.length; i++) {

            dataPoints.push([{ x: new Date(), y: coinsValuesNumbers[i].USD }]);
        }
        // console.log(dataPoints); //Ticking Data Every 2 Seconds
        //Creating Data Property For Every Active Coin
        for (let i = 0; i < coinsValuesNames.length; i++) {

            data.push({
                type: "spline",
                name: coinsValuesNames[i],
                axisYType: "secondary",
                showInLegend: true,
                xValueFormatString: "HH:mm:ss",
                yValueFormatString: "$ 0.############",
                dataPoints: dataPoints[i]
            });
        }

        let options = {
            backgroundColor: "rgba(244, 242, 211, 0.8)",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Real-Time Coin Stocks"
            },
            subtitles: [{
                text: "Click a Coin to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "Coins"
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
                title: "Value (USD)",
                titleFontColor: "forestgreen",
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
        };
        let chart = new CanvasJS.Chart("chartContainer", options);
        chart.render();

        //New Data Request Every 2 Seconds
        let updateChart = async function () {
            coinsValues = await $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + graphCoins + "&tsyms=USD");
            coinsValuesNumbers = Object.values(coinsValues);
            for (let i = 0; i < coinsValuesNames.length; i++) {
                options.data[i].dataPoints.push({ x: new Date(), y: coinsValuesNumbers[i].USD });
            }
            chart.render();

        };
        setInterval(function () { updateChart() }, 2000);

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }

        }



    }

    async function createAboutElements() {

        let $aboutProjectDiv = $("<div class='aboutBox'></div>");
        let $aboutMeDiv = $("<div class='aboutBox'></div>");
        let $contentBox3 = $("<div id='contentBox3'><h2>About CoinFriendly</h2></div>");
        $aboutProjectDiv.html("<span>" +
            "CoinFriendly is a John Bryce assigned project, given as a requirement for graduating the FullStack Web Development course." +
            " This website is built for a user to get the list of 4000+ virtual coins and check out their data via RESTful API Requests." +
            "<br><span class='miniHeader'>Functionallity</span><br>At the <span class='emphasis'>homepage</span>, a list of coins will be automatically fetched and displayed in cards." +
            " User is able to determine how many coins will be fetched from the server by entering a number in the top left input box and refreshing" +
            " the page. Every card contains a <span class='emphasis'>Toggle</span> button" +
            " and a <span class='emphasis'>\"More Info\"</span> button - the Toggle button will mark the coin to help follow its' market value via graph on the <span class='emphasis'>\"Live Reports\"</span>" +
            " page. There is a limit of 5 coins to have toggled at the same time, if you try actiavting more than 5 coins, a <span class='emphasis'>modal</span> will pop and" +
            " let you toggle off some of the coins. *Not all coins return data from the server, if you toggle such coins, or no coins at all, the Live Reports page will show a notice." +
            " The More Info button will send an XML Http request to the server and open up a" +
            " <span class='emphasis'>collapser</span> containing information about the coin; the information will be saved in the session storage for 2 minutes so the information will be " +
            " fetched from it if you close and re-open the collapser in this period of time. After 2 minutes the key will be erased from storage" +
            " (even if you refresh the page).<br>Clicking the <span class='emphasis'>search</span> icon will open up an input box in which the user could search for a coin" +
            " by typing in its' symbol (usually 3 characters), the coin will show up only if the user enters a coin's full symbol, not just" +
            " a part of it.<br><span class='emphasis'>Anything other than the linked libraries was uniquely created for this project.</span></span>");
        let $aboutMeHeader = $("<h2>About Myself</h2>");
        $aboutMeDiv.html("<div id='aboutMeBox'><img src='assets/images/me.jpg'><div><span>" +
            "My name is Ishay and I'm a FullStack Web Developer.<br>A creative, highly-motivated team player who's always looking to learn and develop.<br>Currently looking for a full-time Junior " +
            "Developer position with a positive working atmosphere.<br>ihardspike@gmail.com" +
            "</span></div></div>");

        $contentBox3.append($aboutProjectDiv, $("<hr>"), $aboutMeHeader, $aboutMeDiv);
        $("main").append($contentBox3);

    }

})();

//Thank You Very Much :)
