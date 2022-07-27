addLayer("r", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        autoClick: false
    }},

    color: "#6778DD",                       // The color for this layer, which affects many elements.
    resource: "rebirth(s)",           // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).

    baseResource: "time energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.t.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(50),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                            // Factor in any bonuses multiplying gain here.
        let eff = new Decimal(1)
        if (hasUpgrade('r',31)) eff = eff.mul(upgradeEffect('r',31))
        return eff             
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let eff = new Decimal(0.00000001)
        if (player.r.unlocked) eff = eff.add(0.99999999)
        return eff
    },

    layerShown() { return hasUpgrade('st',21) || player.r.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches:["gs", "gt", "st"],
    upgrades: {
        11: {
            title: `<span style='color:#6778DD;text-shadow:0 0 2px #000000;'>The Re-beginning</span>`,
            description: "Just as the pillar hit you, you instantly woke up in your house. Maybe it was all a dream? Maybe it wasn't? You're aimless right now, but you still fought to survive in that dimension.<br>You were reborn in that dimension.<br><span style='color:blue;'><br>You will regain all your previous milestones of all the previous layers.</span>",
            cost: new Decimal(1),
            onPurchase() {
                player.r.points = player.r.points.add(1)
                if (!player.l.milestones.includes(0)) player.l.milestones.push(0) 
                if (!player.l.milestones.includes(1)) player.l.milestones.push(1) 
                if (!player.l.milestones.includes(2)) player.l.milestones.push(2) 
                if (!player.l.milestones.includes(3)) player.l.milestones.push(3) 
                if (!player.l.milestones.includes(4)) player.l.milestones.push(4) 
                if (!player.s.milestones.includes(0)) player.s.milestones.push(0)  
                if (!player.s.milestones.includes(1)) player.s.milestones.push(1) 
                if (!player.s.milestones.includes(2)) player.s.milestones.push(2) 
                if (!player.s.milestones.includes(3)) player.s.milestones.push(3)
                if (!player.s.milestones.includes(4)) player.s.milestones.push(4)
                if (!player.t.milestones.includes(0)) player.t.milestones.push(0)
                if (!player.t.milestones.includes(1)) player.t.milestones.push(1)
                if (!player.t.milestones.includes(2)) player.t.milestones.push(2)
                if (!player.t.milestones.includes(3)) player.t.milestones.push(3)
                if (!player.t.milestones.includes(4)) player.t.milestones.push(4)
                if (!player.gs.milestones.includes(0)) player.gs.milestones.push(0)
                if (!player.gs.milestones.includes(1)) player.gs.milestones.push(1)
                if (!player.gs.milestones.includes(2)) player.gs.milestones.push(2)
                if (!player.gs.milestones.includes(3)) player.gs.milestones.push(3)
                if (!player.gt.milestones.includes(0)) player.gt.milestones.push(0)
                if (!player.gt.milestones.includes(1)) player.gt.milestones.push(1)
                if (!player.gt.milestones.includes(2)) player.gt.milestones.push(2)
                if (!player.gt.milestones.includes(3)) player.gt.milestones.push(3)
                if (!player.gt.milestones.includes(4)) player.gt.milestones.push(4)
                if (!player.st.milestones.includes(0)) player.st.milestones.push(0)
                if (!player.l.auto1) player.l.auto1 = true
                if (!player.l.auto2) player.l.auto2 = true
                if (!player.l.auto3) player.l.auto3 = true
                if (!player.t.auto1) player.t.auto1 = true
                if (!player.t.auto2) player.t.auto2 = true
                if (!player.gt.auto1) player.gt.auto1 = true
                if (!player.gs.auto1) player.gs.auto1 = true
            },
            style: {
                "width": "360px"
            }
        },
        21: {
            title: `<span style='color:#6778DD;text-shadow:0 0 2px #000000;'>Enigmatic Situation</span>`,
            description: "Seeing as your world is now on chaos, you tried to use the last bits of your power to create a time portal, and use it to escape back to the past.<br>You will now unlock Challenges.",
            cost: new Decimal(2),
            canAfford() {
                return hasUpgrade('r',11)
            },
            style: {
                "width": "360px"
            }
        },
        31: {
            title: "<span style='color:#6778DD;text-shadow:0 0 2px #000000;'>Rebirth I</span>",
            description() {return "Space Energy boosts Rebirth gain by " + format(upgradeEffect('r',31)) + "x."},
            cost: new Decimal(5),
            effect() {
                let eff = player.s.points.add(1).log(3).pow(1.3).add(1)
                return eff
            },
            unlocked() {
                return hasChallenge('r',21)
            },
            unlocked() {
                return hasChallenge('r',21)
            }
        },
        32: {
            title: "<span style='color:#6778DD;text-shadow:0 0 2px #000000;'>Rebirth II</span>",
            description() {return "Automatically press the Earn all milestones button."},
            cost: new Decimal(10),
        },
        33: {
            title: "<span style='color:#6778DD;text-shadow:0 0 2px #000000;'>Rebirth III</span>",
            description() {return "Greater Time Energy boosts Generation by " + format(upgradeEffect('r',33)) + "x."},
            cost: new Decimal(75),
            effect() {
                let eff = player.gt.points.add(1).log(1.01).pow(2).pow(1.5).add(1)
                return eff
            },
            unlocked() {
                return hasChallenge('r',21)
            }
        }
    },
    clickables: {
        11: {
            title: "<span style='color:black;text-shadow:0 0 5px #000000;'>Earn all milestones</span>",
            display() {return "Upon clicking this beautiful purple button, you will get all your milestones again, with no fear of losing them again because of Rebirth resets.<br>(You will also earn the first Energy Upgrade)"},
            canClick() {
                return true
            },
            onClick() {
                if (!player.l.milestones.includes(0)) player.l.milestones.push(0) 
                if (!player.l.milestones.includes(1)) player.l.milestones.push(1) 
                if (!player.l.milestones.includes(2)) player.l.milestones.push(2) 
                if (!player.l.milestones.includes(3)) player.l.milestones.push(3) 
                if (!player.l.milestones.includes(4)) player.l.milestones.push(4) 
                if (!player.s.milestones.includes(0)) player.s.milestones.push(0)  
                if (!player.s.milestones.includes(1)) player.s.milestones.push(1) 
                if (!player.s.milestones.includes(2)) player.s.milestones.push(2) 
                if (!player.s.milestones.includes(3)) player.s.milestones.push(3)
                if (!player.s.milestones.includes(4)) player.s.milestones.push(4)
                if (!player.t.milestones.includes(0)) player.t.milestones.push(0)
                if (!player.t.milestones.includes(1)) player.t.milestones.push(1)
                if (!player.t.milestones.includes(2)) player.t.milestones.push(2)
                if (!player.t.milestones.includes(3)) player.t.milestones.push(3)
                if (!player.t.milestones.includes(4)) player.t.milestones.push(4)
                if (!player.gs.milestones.includes(0)) player.gs.milestones.push(0)
                if (!player.gs.milestones.includes(1)) player.gs.milestones.push(1)
                if (!player.gs.milestones.includes(2)) player.gs.milestones.push(2)
                if (!player.gs.milestones.includes(3)) player.gs.milestones.push(3)
                if (!player.gt.milestones.includes(0)) player.gt.milestones.push(0)
                if (!player.gt.milestones.includes(1)) player.gt.milestones.push(1)
                if (!player.gt.milestones.includes(2)) player.gt.milestones.push(2)
                if (!player.gt.milestones.includes(3)) player.gt.milestones.push(3)
                if (!player.gt.milestones.includes(4)) player.gt.milestones.push(4)
                if (!player.st.milestones.includes(0)) player.st.milestones.push(0)
                if (!player.l.auto1) player.l.auto1 = true
                if (!player.l.auto2) player.l.auto2 = true
                if (!player.l.auto3) player.l.auto3 = true
                if (!player.t.auto1 && !inChallenge('r',21)) player.t.auto1 = true
                if (!player.t.auto2 && !inChallenge('r',21)) player.t.auto2 = true
                if (!player.gt.auto1 && !inChallenge('r',21)) player.gt.auto1 = true
                if (!player.gs.auto1) player.gs.auto1 = true
                if (!player.p.upgrades.includes(11)) player.p.upgrades.push(11)
            },
            style: {
                "width": "250px",
                "height": "120px",
            },
            unlocked() { return player.r.best.gte(2) }
        },
        12: {
            title: "<span style='color:black;text-shadow:0 0 5px #000000;'>Earn all milestones but without enabling toggles</span>",
            display() {return "The same as the other button however this one does not enable milestone toggles."},
            canClick() {
                return true
            },
            onClick() {
                if (!player.l.milestones.includes(0)) player.l.milestones.push(0) 
                if (!player.l.milestones.includes(1)) player.l.milestones.push(1) 
                if (!player.l.milestones.includes(2)) player.l.milestones.push(2) 
                if (!player.l.milestones.includes(3)) player.l.milestones.push(3) 
                if (!player.l.milestones.includes(4)) player.l.milestones.push(4) 
                if (!player.s.milestones.includes(0)) player.s.milestones.push(0)  
                if (!player.s.milestones.includes(1)) player.s.milestones.push(1) 
                if (!player.s.milestones.includes(2)) player.s.milestones.push(2) 
                if (!player.s.milestones.includes(3)) player.s.milestones.push(3)
                if (!player.s.milestones.includes(4)) player.s.milestones.push(4)
                if (!player.t.milestones.includes(0)) player.t.milestones.push(0)
                if (!player.t.milestones.includes(1)) player.t.milestones.push(1)
                if (!player.t.milestones.includes(2)) player.t.milestones.push(2)
                if (!player.t.milestones.includes(3)) player.t.milestones.push(3)
                if (!player.t.milestones.includes(4)) player.t.milestones.push(4)
                if (!player.gs.milestones.includes(0)) player.gs.milestones.push(0)
                if (!player.gs.milestones.includes(1)) player.gs.milestones.push(1)
                if (!player.gs.milestones.includes(2)) player.gs.milestones.push(2)
                if (!player.gs.milestones.includes(3)) player.gs.milestones.push(3)
                if (!player.gt.milestones.includes(0)) player.gt.milestones.push(0)
                if (!player.gt.milestones.includes(1)) player.gt.milestones.push(1)
                if (!player.gt.milestones.includes(2)) player.gt.milestones.push(2)
                if (!player.gt.milestones.includes(3)) player.gt.milestones.push(3)
                if (!player.gt.milestones.includes(4)) player.gt.milestones.push(4)
                if (!player.st.milestones.includes(0)) player.st.milestones.push(0)
                if (!player.p.upgrades.includes(11)) player.p.upgrades.push(11)
            },
            style: {
                "width": "250px",
                "height": "120px",
            },
            unlocked() { return player.r.best.gte(2) }
        },
        13: {
            title() {
                if (player.r.autoClick) return "Enabled"
                return "Disabled"
            },
            display() {
                return "Every reset the button will be clicked and you will earn all milestones."
            },
            canClick() {
                return true
            },
            onClick() {
                player.r.autoClick = !player.r.autoClick
            },
            style: {
                "background-color": function() {
                    if (player.r.autoClick) return "green"
                    return "red"
                },
                "transition-duration": "0.35s"
            },
            unlocked() {
                return hasUpgrade('r',32)
            }
        },
    },
    tabFormat:[
        "main-display",
        "resource-display",
        "blank",
        "prestige-button",
        "blank",
        "upgrades",
        "blank",
        "clickables",
        "blank",
        "blank",
        "challenges",
    ],
    challenges: {
        11: {
            name: "Power Misuse",
            challengeDescription: "Just as you recovered from last time, you realized that your power was increasing tremendously but at the cost of your body suffering from it. You will now train to endure your body. ^0.45 to Generation, and ^0.75 to Energy Gain.",
            goalDescription: "5.00e29 points",
            rewardDescription() {return "A synergy to Generation that works based on Generation itself.<br>Effect: " + format(challengeEffect('r',11)) + "x."},
            canComplete() {return player.points.gte(5e29)},
            rewardEffect() {
                let eff2 = player.r.points.add(1).log(2).add(1)
                let eff = player.points.add(1).log(1.03).pow(1.5).pow(1.1).pow(1.05).mul(eff2).add(1)
                return eff
            },
            unlocked() {
                return hasUpgrade('r',21)
            }
        },
        12: {
            name: "Researchless",
            challengeDescription: "As part of your training, you have tried not doing any research. And now, researching is counterproductive and grants a negative effect upon purchasing. Hint: Maybe enable certain toggles only?",
            goalDescription: "1.00e61 points",
            rewardDescription() {return "The Second Energy Upgrade is ^5.00."},
            canComplete() {return player.points.gte(1e61)},
            unlocked() {
                return hasChallenge('r',11)
            }
        },
        21: {
            name: "No Time",
            challengeDescription: "Your training is hard, but you didn't give up. The Time layer never exists in this challenge, and thus neither do Greater Time and Spacetime.",
            goalDescription: "5.00e75 points",
            rewardDescription() {return "A synergy to Energy gain that works baseed on Energy itself.<br>Effect: " + format(challengeEffect('r',21)) + "x and new upgrades."},
            canComplete() {
                return player.points.gte(5e75)
            },
            rewardEffect() {
                let eff = player.p.points.add(1).log(1.05).pow(1.9).pow(1.45).add(1)
                return eff
            },
            unlocked() {
                return hasChallenge('r',12)
            }
        }
    },
    effect() {
        let eff = player.r.points.pow(1.5).max(1)
        return eff
    },
    effectDescription() {
        return "which is boosting Generation by " + format(tmp.r.effect) + "x."
    },
    update() {
        if (player.r.autoClick) clickClickable('r',11)
    }
})