let modInfo = {
	name: "The Energy Tree",
	id: "modid93193193012849230842084920389023859029058239058902859043534",
	author: "Alez",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", "chapter2.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.2",
	name: "A REBORN UPDATE",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3><br>
		· Made the game.<br>
		· Among us.<br>
	<h3>v1.1</h3><br>
	    · Added QoL.<br>
		· More QoL lmao.<br>
	<h3>v1.1.1</h3><br>
	    · frfr gwugs?!?11?11???1111!??!!!1?1<br>
		· Even more QoL, thanks Acamaeda for the help.<br>
	<h3>v1.2</h3><br>
	    · Added the Row 5 layer, lmao.<br>
		· Fixed a deadly bug and some extra QoL.<br>
`

let winText = `You rebirthed, and got better control! Stay tuned for the next update!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	//let gain = new Decimal(0)
	//gain = gain.add(upgradeEffect('p',11))
	return upgradeEffect('p',11)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('r',33)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}