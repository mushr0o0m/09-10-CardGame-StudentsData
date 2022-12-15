(() => {
    function createGameCard(sign) {
        const card = document.createElement("div");
        const cardSign = document.createElement("span");
        const nonFlipCardSign = document.createElement("span");

        card.classList.add("game-card");
        cardSign.classList.add("sign", "disabled");
        nonFlipCardSign.classList.add("sign");

        cardSign.textContent = sign;
        nonFlipCardSign.textContent = "?";
        card.append(cardSign);
        card.append(nonFlipCardSign);
        return card;
    }

    function startGame(difficult) {
        const playground = document.createElement("div");
        const canvas = document.createElement("div");
        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Перезапустить игру";
        restartBtn.classList.add("btn", "disabled");
        playground.classList.add("playground");
        canvas.classList.add("canvas");
        canvas.append(playground);

        let numSetHistory = [];
        let cards = [];
        const pairsNum = Math.floor(difficult / 2);
        let firstFlipCard = null;
        let secondFlipCard = null;
        let clickable = true;

        for (let i = 0; i < difficult; i++) {
            let card = createGameCard(String(getNonRepNum(numSetHistory, pairsNum)));
            cards.push(card);
            card.addEventListener("click", () => {
                if (clickable == true && !card.classList.contains("successfully")) {
                    if (firstFlipCard != null && secondFlipCard != null && firstFlipCard != secondFlipCard) {
                        cards[firstFlipCard].classList.remove('flip');
                        cards[secondFlipCard].classList.remove('flip');
                        firstFlipCard = null;
                        secondFlipCard = null;
                    }
                    card.classList.add("flip");
                    if (firstFlipCard == null)
                        firstFlipCard = i;
                    else if (i != firstFlipCard) {
                        secondFlipCard = i;
                        clickable = false;
                    }

                    if (firstFlipCard != null && secondFlipCard != null && firstFlipCard != secondFlipCard) {
                        if (cards[firstFlipCard].firstElementChild.textContent ===
                            cards[secondFlipCard].firstElementChild.textContent) {
                            setTimeout(() => {
                                console.log(cards[firstFlipCard]);
                                cards[firstFlipCard].classList.add("successfully");
                                cards[secondFlipCard].classList.add("successfully");

                                firstFlipCard = null;
                                secondFlipCard = null;
                                clickable = true;
                            }, 500);
                        } else
                            clickable = true;
                    }

                    if (Array.from(cards).every(card => card.className.includes('flip'))) {
                        restartBtn.classList.remove("disabled");
                        restartBtn.addEventListener("click", () => {
                            if(confirm("Вы уверены, что хотите перезапустить игру?")){
                                document.body.innerHTML = '';
                                startGame("16");
                            }
                        });
                    }
                }
            })
            playground.append(card);
        }

        playground.append(restartBtn);
        document.body.append(canvas);
    }

    function getNonRepNum(numSetHistory, pairsNum) {
        let rndNum = getRndInt(1, pairsNum);
        while (numSetHistory.includes(rndNum))
            rndNum = getRndInt(1, pairsNum);
        if (numSetHistory.length === pairsNum - 1)
            numSetHistory.length = 0;
        else
            numSetHistory.push(rndNum);
        return rndNum;
    }

    function getRndInt(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    document.addEventListener("DOMContentLoaded", () => {
        startGame("16");
    });
})();