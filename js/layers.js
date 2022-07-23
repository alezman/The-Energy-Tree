addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FF1100",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect('l',11))
        mult = mult.mul(tmp.s.effect)
        if (hasUpgrade('t',24)) mult=mult.mul(upgradeEffect('t',24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: `<span style="color:#ff1100;text-shadow:0 0 4px #000000;">The Beginning</span>`,
            description: "You will now generate 1 point every second, this generation can be multiplied or divided based on the mechanics.",
            cost: new Decimal(1),
            style: {
                "width": "360px",
            },
            effect() {
                let gain = new Decimal(0)
                if (hasUpgrade('p',11)) gain = gain.add(1)
                if (hasUpgrade('p',21)) gain = gain.mul(upgradeEffect('p',21))
                if (hasUpgrade('p',22)) gain = gain.mul(upgradeEffect('p',22))
                gain = gain.mul(tmp.l.effect)
                gain = gain.mul(buyableEffect('l',11))
                if (hasUpgrade('t',24)) gain = gain.mul(upgradeEffect('t',24))
                if (hasUpgrade('s',31)) gain = gain.mul(upgradeEffect('s',31))
                if (player.t.timerLeft.gt(0)) gain = gain.mul(3)
                if (hasMilestone('gs',2)) gain = gain.mul(tmp.t.effectByMilestone)
                if (hasMilestone('gt',2)) gain = gain.mul(tmp.s.effectByMilestone)
                if (hasUpgrade('st',12)) gain = gain.mul(1e10)
                return gain
            }
        },
        21: {
            title: "<span style='color:#ff1100;text-shadow:0 0 4px#000000;'>First Improvements</span>",
            description() { return "The Generation is boosted by every energy you have, which gives a total of " + format(upgradeEffect('p',21)) + " as a multiplier to Generation." },
            cost: new Decimal(2),
            style: {
                "width": "180px"
            },
            effect() {
                let eff = player.p.points.add(3).log(3).add(1.5)
                if (hasMilestone('s',2)) eff = eff.pow(2)
                if (hasUpgrade('s',24)) eff = eff.pow(upgradeEffect('s',24))
                return eff
            },
            canAfford() {
                return hasUpgrade('p',11)
            }
        },
        22: {
            title: "<span style='color:#ff1100;text-shadow:0 0 4px#000000;'>Synergy Strategy</span>",
            description() { return "The Generation is boosted by every points you have, which gives a total of " + format(upgradeEffect('p',22)) + " as a multiplier to Generation." },
            cost: new Decimal(4),
            style: {
                "width": "180px"
            },
            effect() {
                let eff = player.points.add(1).log(10).add(1)
                if (hasMilestone('l',4)) eff = eff.pow(2)
                return eff
            },
            canAfford() {
                return hasUpgrade('p',21)
            }
        },
        31: {
            title: `<span style="color:#ff1100;text-shadow:0 0 4px #000000;">Many Possibilities</span>`,
            description: "You will now unlock further content to improve the Generation with more than just upgrades.",
            cost: new Decimal(10),
            style: {
                "width": "360px",
            },
            effect() {
                let gain = new Decimal(0)
                if (hasUpgrade('p',11)) gain = gain.add(1)
                if (hasUpgrade('p',21)) gain = gain.mul(upgradeEffect('p',21))
                if (hasUpgrade('p',22)) gain = gain.mul(upgradeEffect('p',22))
                return gain
            },
            canAfford() {
                return hasUpgrade('p',22)
            }
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        "upgrades",
    ],
    update() {
        if (player.l.auto1) {
            buyUpgrade('p',11)
        }
        if (player.l.auto2) {
            buyUpgrade('p',21)
        }
        if (player.l.auto3) {
            buyUpgrade('p',22)
        }
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
            let specialUpgs = [31]
            if (hasUpgrade('p',31)) specialUpgs.push("upgrades")
            if (hasMilestone('t',0)) keep.push("upgrades")
            layerDataReset('p', keep)
            for(i in specialUpgs) {
                if (!player[this.layer].upgrades.includes(specialUpgs[i])) {
                player[this.layer].upgrades.push(specialUpgs[i])
                }
            } 
        }
    },
    passiveGeneration() {
        let gen = 0.1
        if (hasMilestone('t',3)) return gen
        if (player.t.timerLeft.gt(0)) gen *= 3
    }

})

addLayer("l", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        auto1: false,
        auto2: false,
        auto3: false,
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource() {
        if (player.l.points.eq(1)) return "laboratory"
        else return "laboratories"
    },                                         // The name of this layer's main prestige resource.
    row: 1,                                    // The row this layer is on (0 is the first row).
    baseResource: "energy",                    // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },   // A function to return the current amount of baseResource.
    requires: new Decimal(20),                 // The amount of the base needed to  gain 1 of the prestige currency.
                                               // Also the amount required to unlock the layer.
    type: "normal",                            // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                             // "normal" prestige gain is (currency^exponent).
    gainMult() {                               // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)              // A variable to maniuplate the multiplier with ease.
        if (hasUpgrade('s',32)) mult = mult.mul(upgradeEffect('s',32))
        return mult                            // Factor in any bonuses multiplying gain here.
    },                                         // Destroy the absolute factor by multiplying mega-gain.
    gainExp() {                                // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)                  // Returns a bool for if this layer's node should be visible in the tree.
    },
    layerShown() { return hasUpgrade('p',31) || player.l.total.gte(1)},
    effect() {
        let eff = player.l.best.add(1).log(1.2).add(1)
        eff = eff.mul(buyableEffect('l',12))
        if (hasUpgrade('st',11)) eff = eff.pow(upgradeEffect('st',11))
        return eff
    },
    branches:['p'],
    effectDescription() {
        return "which is boosting your Generation by multiplying points by " + format(tmp.l.effect) + "."
    },
    buyables: {
        11: {
            title: `<span style="color:#4BDC13;text-shadow:0 0 4px #000000;">Research</span`,
            display() {
                return "Do some experiments around with your energy to upper your efficiency and find better strategies to create energy at a faster rate.<br>This will boost your energy gain based on how many times you've done research.<br>Currently, you have tried this " + formatWhole(getBuyableAmount('l',11)) + " time(s).<br>Next research costs " + format(tmp.l.buyables[11].cost) + " energy.<br>Your current research has gotten you so far a multiplier of " + format(buyableEffect('l',11)) + " to your energy gain."
            },
            cost(x) {
                let cost = new Decimal(7.5).mul(new Decimal(1.2).pow(x))
                if (x.gte(10)) cost = cost.pow(1.5).mul(3)
                if (x.gte(100)) cost = cost.pow(1.5).mul(3)
                if (x.gte(1000)) cost = cost.pow(1.5).mul(3)
                if (x.gte(10000)) cost = cost.pow(1.5).mul(3)
                if (x.gte(100000)) cost = cost.pow(1.5).mul(3)
                return cost
            },
            effect() {
                let eff = getBuyableAmount('l',11).add(1).log(2.25).add(1)
                return eff
            },
            canAfford() {
                return player.p.points.gte(tmp.l.buyables[11].cost)
            },
            buy() {
                if (!hasMilestone('t',1)) player.p.points = player.p.points.sub(tmp.l.buyables[11].cost)
                setBuyableAmount('l',11, getBuyableAmount('l',11).add(1))
            },
            style: {
                "width": "180px",
                "height": "250px",
                "margin": "-7px"
            }
        },
        12: {
            title: `<span style="color:#4BDC13;text-shadow:0 0 4px #000000;">True Generation</span>`,
            display() {
                return "You have realized that using a secret technique you can make your Generation faster.<br>You have performed this " + formatWhole(getBuyableAmount('l',12)) + " time(s).<br>Next research costs " + formatWhole(tmp.l.buyables[12].cost) + " energy.<br>Your current research has gotten you so far a multiplier of " + format(buyableEffect('l',12)) + " to the Generation."
            },
            cost(x) {
                let cost = new Decimal(7.5).mul(new Decimal(1.2).pow(x))
                if (x.gte(10)) cost = cost.pow(1.5).mul(3)
                if (x.gte(100)) cost = cost.pow(1.5).mul(3)
                if (x.gte(1000)) cost = cost.pow(1.5).mul(3)
                if (x.gte(10000)) cost = cost.pow(1.5).mul(3)
                if (x.gte(100000)) cost = cost.pow(1.5).mul(3)
                return cost
            },
            effect() {
                let eff = getBuyableAmount('l',12).add(1).log(3.75).add(1)
                return eff
            },
            canAfford() {
                return player.p.points.gte(tmp.l.buyables[12].cost)
            },
            buy() {
                if (!hasMilestone('t',2)) player.p.points = player.p.points.sub(tmp.l.buyables[12].cost)
                setBuyableAmount('l',12, getBuyableAmount('l',12).add(1))
            },
            style: {
                "width": "180px",
                "height": "250px",
                "margin": "0 -7px 0"
            }
        },
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "buyables",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "milestones",
            ]
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 laboratory",
            effectDescription: "After getting your first laboratory and having sacrificed all your energy, you learnt how to rebuild your progress back to where you managed to leave it, and now, you can auto-buy the first upgrade.",
            done() {
                return player.l.points.gte(1)
            },
            toggles: [
                ["l", "auto1"]
            ]
        },
        1: {
            requirementDescription: "2 laboratories",
            effectDescription: "After getting your second laboratory and having sacrificed all your energy once again, you realized you can automate the auto-buying of the second upgrade as well.",
            done() {
                return player.l.points.gte(2)
            },
            toggles: [
                ["l", "auto2"]
            ]
        },
        3: {
            requirementDescription: "4 laboratories",
            effectDescription: "After getting your fourth laboratory and having sacrificed all your energy that many times, you understood fully the power of your automation and mastered it. You can now purchase automatically the third upgrade.",
            done() {
                return player.l.points.gte(4)
            },
            toggles: [
                ["l", "auto3"]
            ]
        },
        4: {
            requirementDescription: "10 laboratories",
            effectDescription: `It's been so many resets. You've created enough laboratories to comprehend that you are now capable of boosting your Generation further. You CAN generate more with simple synergies. Upgrade "Synergy Strategy" is squared.`,
            done() {
                return player.l.points.gte(10)
            },
        },
        5: {
            requirementDescription: "5,000 energy",
            effectDescription: `Possessing so much energy, you've decided it's time to finally use it. You may affect Time, or you may affect Space. Either way, you've unlocked 2 new layers now.`,
            done() {
                return player.p.points.gte(5000)
            },
        },
    },
    hotkeys: [
        {key: "l", description: "L: Condense your energy and build a laboratory.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update() {
        if (player.t.auto1) {
            buyBuyable('l',11)
        }
        if (player.t.auto2) {
            buyBuyable('l',12)
        }
    },
    passiveGeneration() {
        let gen = 0
        if (hasMilestone('s',1)) gen += 0.5
        if (hasMilestone('s',3)) gen += 0.5
        if (player.t.timerLeft.gt(0)) gen *= 3
        return gen
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.l.row) {
            // the three lines here
            let keep = []
            let specialUpgs = []
            if (hasMilestone('s',4)) keep.push("milestones")
            layerDataReset('l', keep)
            for(i in specialUpgs) {
                if (!player[this.layer].upgrades.includes(specialUpgs[i])) {
                player[this.layer].upgrades.push(specialUpgs[i])
                }
            } 
        }
    },
    onPrestige() {
        if (hasMilestone('t',4) && player.l.auto1) player.l.auto1 = true
        if (hasMilestone('t',4) && player.l.auto2) player.l.auto2 = true
        if (hasMilestone('t',4) && player.l.auto3) player.l.auto3 = true
    }
})
addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        skippedTime: new Decimal(0),
        timerLeft: new Decimal(0),
        auto1: false,
        auto2: false,
    }},
    hotkeys: [
        {key: "t", description: "T: Reset for time energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    color: "#006aff",                       // The color for this layer, which affects many elements.
    resource: "time energy",                // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "laboratory station(s)",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(35),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.01,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
        if (hasUpgrade('s',23)) mult = mult.div(2)
        return mult                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasMilestone('l',5) || player.t.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: `<span style="color:#006aff;text-shadow:0 0 2px #000000;">Time Manipulation</span>`,
            description() {
                return `You've learnt so far how to manipulate your energy to transform it into time energy, but you don't know how to manipulate time yet. You will now generate Skipped Time, which you can use to power up your laboratories.<br><span style="color:#ff1100;">Your currency will not be spent upon purchase.</span>`
            },
            cost() {
                return new Decimal(1)
            },
            onPurchase() {
                player.t.points = player.t.points.add(1)
            },
            style: {
                "width": "480px",
            }
        },
        21: {
            title: `<span style="color:#006aff;text-shadow:0 0 2px #000000;">Time I</span>`,
            description() {return "Time skipped is no longer useless."},
            cost: new Decimal(2)
        },
        22: {
            title: `<span style="color:#006aff;text-shadow:0 0 2px #000000;">Time II</span>`,
            description() {return "Skipping Time is increased and it is 0.2/s now."},
            cost: new Decimal(3)
        },
        23: {
            title: "<span style='color:#006aff;text-shadow:0 0 2px #000000;'>Time III</span>",
            description() {return "Skipping Time is increased and it is 0.5/s now."},
            cost: new Decimal(5)
        },
        24: {
            title: "<span style='color:#006aff;text-shadow:0 0 2px #000000;'>Time IV</span>",
            description() {return "Skipped Time that hasn't been converted grants a boost of "+ format(upgradeEffect('t',24)) +" to Generation and Energy."},
            cost: new Decimal(10),
            effect() {
                let eff = player.t.skippedTime.add(1).log(7).add(1)
                return eff
            }
        }
    },
    branches: ['l'],
    effectDescription() {
        if (hasUpgrade('t',11)) return "which is skipping time at a rate of " + formatTime(tmp.t.effect) + " every second."
        else return "which is doing currently nothing."
    },
    effect() {
        let eff = new Decimal(0.1)
        if (hasUpgrade('t',22)) eff = eff.mul(2)
        if (hasUpgrade('t',23)) eff = eff.mul(2.5)
        return eff
    },
    update(diff) {
        if (player.t.timerLeft.gt(0)) {
            diff = diff * 3
            player.t.timerLeft = player.t.timerLeft.sub(new Decimal(diff).div(3))
        }
        if (player.t.timerLeft.lt(0)) {
            player.t.timerLeft = new Decimal(0)
        }
        if (hasUpgrade('t',11)) player.t.skippedTime = player.t.skippedTime.add(tmp.t.effect.mul(diff))
    },
    clickables: {
        11: {
            title: `<span style="color:#006aff;text-shadow:0 0 4px #000000;">Convert Time</span>`,
            display() {
                return "Skipped Time will be transformed into a timer to boost time speed by 3.<br>Currently, the timer is " + formatTime(player.t.timerLeft) + " of time left."
            },
            canClick() {
                return player.t.skippedTime.gt(0)
            },
            onClick() {
                player.t.timerLeft = player.t.skippedTime
                player.t.skippedTime = new Decimal(0)
            },
            unlocked() {
                return hasUpgrade('t',21)
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 time energy",
            effectDescription: "Just as you obtained your second time energy, you learnt how to keep all Energy Upgrades on any resets for as long as you have this milestone.",
            done() {
                return player.t.points.gte(2)
            }
        },
        1: {
            requirementDescription: "3 time energy",
            effectDescription: "Just as you obtained your third time energy, you set up a time paradox to automatically perform researches and make it not take away any resources on doing this.",
            done() {
                return player.t.points.gte(3)
            },
            toggles:[
                ["t", "auto1"]
            ]
        },
        2: {
            requirementDescription: "5 time energy",
            effectDescription: "Just as you obtained your fifth time energy, you set up another time paradox to autobuy True Generation and make it not take away any resources on purchase.",
            done() {
                return player.t.points.gte(5)
            },
            toggles:[
                ["t", "auto2"]
            ]
        },
        3: {
            requirementDescription: "7 time energy",
            effectDescription: "You've obtained your seventh time energy, and by now you've mastered how to produce energy, and now you don't need to reset your Generation for energy. You will automatically generate 10% of your potential energy that could be obtained on reset without actually needing to reset this time for as long as you have this milestone.",
            done() {
                return player.t.points.gte(7)
            }
        },
        4: {
            requirementDescription: "250 laboratories",
            effectDescription: "A lot of laboratories, huh? You don't have anything better to do? You can actually keep your Laboratory milestone toggles ON (given that you actually had them ON to begin with).",
            done() {
                return player.l.points.gte(250)
            }
        }
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "milestones",
            ]
        },
        "Other": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                ["display-text", function() {return `You have skipped ` + formatTime(player.t.skippedTime) + `, and given that you have the respective upgrades, you will be able to use it.`}],
                "blank",
                "clickables",
            ]
        }
    },
    canBuyMax() {
        return hasMilestone('s',0)
    },
    automate() {
        if (player.gt.auto1 && canReset('t')) doReset('t')
    },
    effectByMilestone() {
        let eff = new Decimal(1.25).pow(player.t.best).max(1)
        return eff
    },
    resetsNothing() {
        return hasMilestone('gt',0)
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp[this.layer].row) {
            // the three lines here
            let keep = []
            if (hasMilestone('gt',1)) keep.push("milestones")
            if (hasMilestone('st',0)) keep.push("upgrades")
            layerDataReset(this.layer, keep) 
        }               
    },
    onPrestige() {
        if (hasMilestone('gt',4) && player.l.auto1) player.l.auto1 = true
        if (hasMilestone('gt',4) && player.l.auto2) player.l.auto2 = true
    },
    hotkeys: [
        {key: "t", description: "T: Reset for time energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})
addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    hotkeys: [
        {key: "s", description: "S: Reset for space energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "milestones",
            ]
        }
    },

    color: "#00ddff",                       // The color for this layer, which affects many elements.
    resource: "space energy",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "laboratory station(s)",  // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(35),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.01,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
        if (hasUpgrade('s',23)) mult = mult.div(2)
        return mult                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasMilestone('l',5) || player.s.unlocked},          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Power of Creation</span>`,
            description: `Now that you've acquired control over space, you can use it to your advantage. You will now get an effect based on many of your currencies unlocked so far.<br><span style="color:#ff1100;">Your currency will not be spent upon purchase.</span>`,
            cost() {
                return new Decimal(1)
            },
            onPurchase() {
                player.s.points = player.s.points.add(1)
            },
            style: {
                "width": "480px",
            }
        },
        21: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space I</span>`,
            description: "Improve the space formula by ^1.2.",
            cost: new Decimal(2)
        },
        22: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space II</span>`,
            description: "Improve the space formula by ^1.2.",
            cost: new Decimal(3)
        },
        23: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space III</span>`,
            description: "Improve the space formula by ^1.2, and divide the Space and Time req by two.",
            cost: new Decimal(5)
        },
        24: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space IV</span>`,
            description: function() {return `Boost "First Improvements" by ^` + format(upgradeEffect('s',24)) + "."},
            cost: new Decimal(8),
            effect() {
                let eff = player.s.best.add(1).log(10).add(1)
                return eff
            }
        },
        31: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space V</span>`,
            description() {return "Space Energy boosts the Generation by " + format(upgradeEffect('s',31)) + "."},
            cost: new Decimal(10),
            effect() {
                let eff = player.s.best.add(1).log(2).pow(1.4).add(1)
                return eff
            }
        },
        32: {
            title: `<span style="color:#00ddff;text-shadow:0 0 2px #000000;">Space VI</span>`,
            description() {return "Time Energy boosts the Laboratory gain by " + format(upgradeEffect('s',32)) + "."},
            cost: new Decimal(11),
            effect() {
                let eff = player.t.best.add(1).log(9).add(1)
                return eff
            }
        },
    },
    effect() {
        let ppoint = player.p.points.add(1).log(75).pow(0.65).add(1)
        let point = player.points.add(1).log(10).pow(0.5).add(1)
        let eff = player.s.best.add(1).log(10).mul(point).mul(ppoint).add(1).max(1)
        if (!hasUpgrade('s',11)) eff = eff.min(1)
        if (hasUpgrade('s',21)) eff = eff.pow(1.2)
        if (hasUpgrade('s',22)) eff = eff.pow(1.2)
        if (hasUpgrade('s',23)) eff = eff.pow(1.2)
        return eff
    },
    effectDescription() {
        return "which is boosting energy gain based on space energy, energy and points, granting a total of "+ format(tmp.s.effect) +" as a multiplier to it."
    },
    branches: ['l'],
    milestones: {
        0: {
            requirementDescription: "2 space energy",
            effectDescription: "Just as you obtained your second space energy, you focused on the Quality of Life of Time and Space and now both layers can be bought in bulk.",
            done() {
                return player.s.points.gte(2)
            }
        },
        1: {
            requirementDescription: "3 space energy",
            effectDescription: "Just as you obtained your third space energy, you instantly set up a portal and you get 50% of laboratory gain every second.",
            done() {
                return player.s.points.gte(3)
            },
        },
        2: {
            requirementDescription: "5 space energy",
            effectDescription: "Just as you obtained your fifth space energy, you set up another portal to power up First Improvements and made it be squared.",
            done() {
                return player.s.points.gte(5)
            },
        },
        3: {
            requirementDescription: "7 space energy",
            effectDescription: "You've obtained your seventh space energy, and by now you've mastered how to produce laboratories, and produce 100% of laboratory gain every second instead.",
            done() {
                return player.s.points.gte(7)
            }
        },
        4: {
            requirementDescription: "400 laboratories",
            effectDescription: "You've made so many laboratories, you know exactly what to do each time and now you've made a massive amount of laboratories. You will now keep Laboratory Milestones on reset.",
            done() {
                return player.l.points.gte(400)
            }
        }
    },
    canBuyMax() {
        return hasMilestone('s',0)
    },
    automate() {
        if (player.gs.auto1 && canReset('s')) doReset('s')
    },
    effectByMilestone() {
        let eff = new Decimal(1.25).pow(player.s.best).max(1)
        return eff
    },
    resetsNothing() {
        return hasMilestone('gs',0)
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp[this.layer].row) {
            // the three lines here
            let keep = []
            if (hasMilestone('gs',1)) keep.push("milestones")
            if (hasMilestone('st',0)) keep.push("upgrades")
            layerDataReset(this.layer, keep) 
        }               
    },
})
/*
addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "prestige point(s)",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})
*/

addLayer("st", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    hotkeys: [
        {key: "y", description: "Y: Reset for spacetime energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    color: "#008cff",                       // The color for this layer, which affects many elements.
    resource: "spacetime energy",            // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e14),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.5)
    },

    layerShown() { return hasUpgrade('s',32) || hasUpgrade('t',24) || player.st.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches:['s', 't'],
    symbol: "ST",
    position: 0,
    upgrades: {
        11: {
            title: `<span style="color:#b82fbd;text-shadow:0 0 2px #000000;">First Enhancements</span>`,
            description() { return `You gave your Generation a bit of improvements and the Laboratory effect is improved by ^`+ format(upgradeEffect('st',11)) + `.` },
            cost: new Decimal(2),
            effect() {
                let eff = player.st.best.add(1).log(5).pow(1.25).add(1).min(10)
                return eff
            }
        },
        12: {
            title: `<span style="color:#b82fbd;text-shadow:0 0 2px #000000;">Enhance I</span>`,
            description() { return `You have gotten really far, but you still want more. Generation is improved by a solid 1.00e10x.` },
            cost: new Decimal(4),
        },
        13: {
            title: `<span style="color:#b82fbd;text-shadow:0 0 2px #000000;">The Price of Something</span>`,
            description() { return `Humans. Humans never learn their lesson, do they? <br>Unlocks 1/3 of the current endgame.` },
            cost: new Decimal(5000),
            unlocked() {
                return hasMilestone('gt',3) && hasMilestone('gs',3)
            }
        },
        21: {
            title: `<b><span style="color:#00000;text-shadow:2px 2px 2px #000000;">The Price of Your Mistakes</span></b>`,
            description() {return "You pushed your limits. Even if you reached to the Greater Time and Greater Space, you still forgot that you are just a simple human, and your physical body does not account for taking such a huge power. Your body fails on you and you have a seizure in the middle of your own kingdom of space and time, with nobody to help you because they cannot reach to you. Your whole kingdom collapses into pieces and there isn't anything really to do since you're having a seizure. A pillar falls right above you and you get hit hard. You are now unconscious.<br><b>Unlocks the endgame.</b>"},
            cost: new Decimal(100000),
            unlocked() {
                return hasUpgrade('st',13)
            },
            style: {
                "width": "360px",
                "height":"360px",
            }
        },
    },
    milestones: {
        0: {
            requirementDescription: "100 spacetime energy",
            effectDescription: "Keep Space & Time upgrades on all resets",
            done() {return player.st.points.gte(100)}
        }
    }
})


addLayer("gt", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        auto1: false,
    }},
    hotkeys: [
        {key: "h", description: "H: Reset for greater time energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    color: "#0026ff",                       // The color for this layer, which affects many elements.
    resource: "greater time energy",            // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).

    baseResource: "time energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.t.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(12),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('t',24) || player.gt.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    symbol: "GT",
    branches: ['t'],
    position: 3,
    milestones: {
        0: {
            requirementDescription: "1 greater time energy",
            effectDescription: "Time. Time isn't that rewarding. You searched and found Greater Time. This dimension seems to boost your regular time manipulation. You can now automatically purchase time energy and it costs nothing.",
            done() {return player.gt.points.gte(1)},
            toggles:[
                ["gt", "auto1"]
            ]
        },
        1: {
            requirementDescription: "2 greater time energy",
            effectDescription: "You have gotten your second greater time energy. You've learnt how to manipulate time further. You can now keep Time Energy milestones on all resets.",
            done() {return player.gt.points.gte(2)}
        },
        2: {
            requirementDescription: "3 greater time energy",
            effectDescription: "You have achieved getting your third greater time energy. But you never gave up. You can create Alternate Timelines to modify the timelapse to your likings. Space Energy now provides a boost of 1.25x per Space Energy to Generation.",
            done() {return player.gt.points.gte(3)}
        },
        3: {
            requirementDescription: "10 greater time energy",
            effectDescription: "Do you remember your start? It's not that far but seeing all this admirable progress it makes you think back to your origins. You were a mere human with the ambition to change the world around him, and you became a human with the ability to control time and space like you'd control eating spaghetti with meatballs. I, the lore maker, am sincerely impressed with your progress. Congratulations.<br>Unlocks 1/3 of the current endgame.",
            done() {return player.gt.points.gte(10)}
        },
        4: {
            requirementDescription: "20 time & space energy",
            effectDescription: "Quality of Life is important. It defines whether you are capable of stabilizing your world that you yourself shape, and it's mostly the thing to define whether your world is worthy or not. In this case, you've chosen to go for the Quality of Life. You can now keep your milestone toggles of the Time Energy on reset.",
            done() {return player.t.points.gte(20) && player.s.points.gte(20) }
        }
    },
    effect() {
        let eff = new Decimal(2).pow(player.gt.points).min(512)
        let eff2 = player.gt.points.add(1).log(1.05).pow(1.2).add(1)
        if (eff.gte(512)) eff = eff.mul(eff2) 
        return eff
    },
    effectDescription() {
        return "which is boosting the Generation by " + format(tmp.gt.effect) + "x."
    }
})
addLayer("gs", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        auto1: false,
    }},
    hotkeys: [
        {key: "j", description: "J: Reset for greater space energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    color: "#00ffff",                       // The color for this layer, which affects many elements.
    resource: "greater space energy",            // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).

    baseResource: "space energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.s.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(12),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('s',32) || player.gs.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches:['s'],
    symbol: "GS",
    milestones: {
        0: {
            requirementDescription: "1 greater space energy",
            effectDescription: "As much power as the space energy holds, it's not enough. You still need more, and in order to achieve this you reached further onto space and found greater space. You can now automatically purchase space energy and it costs nothing.",
            done() {return player.gs.points.gte(1)},
            toggles:[
                ["gs", "auto1"]
            ]
        },
        1: {
            requirementDescription: "2 greater space energy",            
            effectDescription: "You obtained your second greater space energy. You've learnt how to use it and you're fairly new onto this. You can now keep Space Energy milestones on all resets.",
            done() {return player.gs.points.gte(2)},
        },
        2: {
            requirementDescription: "3 greater space energy",
            effectDescription: `You obtained your third space energy. This power so immense needs years to be controlled fully. Time Energy now provides a boost of 1.25x per Time Energy to Generation.`,
            done() {return player.gs.points.gte(3)}
        },
        3: {
            requirementDescription: "10 greater space energy",
            effectDescription: `You have greatly improved since your last milestone reached. Humanity never gives up, not until they reach the infinity. That's common in your race, fellow human.<br>Unlocks 1/3 of the current endgame.`,
            done() {return player.gs.points.gte(10)}
        },
    },
    effect() {
        let eff = player.gs.points.add(1).log(70).pow(3).add(1)
        return eff
    },
    effectDescription() {
        return "which is multiplying the Energy gain by " + format(tmp.gs.effect) + "x and increasing the Hydrogen Tank Capacity by " + format(player.points.pow(543)) + "x."
    }
})