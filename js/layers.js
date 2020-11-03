addLayer("p", {
        name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        branches: "b",
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "#4BDC13",
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpgrade("p", 13)) {
                mult = mult.times(upgradeEffect("p", 13));
            }
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        update(diff) {
            if (hasMilestone("b",0)) {
                addPoints("p", getResetGain("p").mul(diff))
            }
        },
        hotkeys: [
            {key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        upgrades: {
            rows: 2,
            cols: 4,
            11: {
                cost: 1,
                description: "Point Mult Based on Prestige Points",
                effect() {
                    let e = player.p.points.add(4).log(2);
                    if (hasUpgrade("p", 14)) {
                        e = e.pow(upgradeEffect("p", 14));
                    }
                    return e
                },
            },
            12: {
                cost: 1,
                description: "Point Mult Based on Points",
                effect() {
                    let e = player.points.pow(0.15);
                    if (hasUpgrade("p", 14)) {
                        e = e.pow(upgradeEffect("p", 14));
                    }
                    return e.max(1);
                }
            },
            13: {
                cost: 1,
                description: "Prestige Point Mult Based on Prestige Points",
                effect() {
                    let e = player.p.points.add(4).log(4);
                    if (hasUpgrade("p", 14)) {
                        e = e.pow(upgradeEffect("p", 14));
                    }
                    return e
                }
            },
            14: {
                cost: 5,
                description: "All Upgrades Before this get exponentiated based on Prestige Points",
                effect() {
                    return new Decimal(2).sub(new Decimal(0.9).pow(player.p.points.add(10).log(10)))
                }
            },
        },
        layerShown(){return true},
});
addLayer("b", {
        name: "boost", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "#4BDC13",
        requires: new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "booster points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        update(diff) {
        },
        hotkeys: [
            {key: "b", description: "Reset for booster points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        milestones: {
            0: {
                requirementDesc: "1 Booster Point",
                effectDesc: "Gain 100% of Prestige Points on reset per Second",
                done() {
                    return player.b.points.greaterThanOrEqualTo(1);
                }
            },
            1: {
                requirementDesc: "2 Booster Point",
                effectDesc: "Booster Reset no longer Resets Prestige Upgrades",
                done() {
                    return player.b.points.greaterThanOrEqualTo(2);
                }
            },
        },
        layerShown(){return true},
})