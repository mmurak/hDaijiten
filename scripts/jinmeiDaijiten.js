class GlobalManager {
	constructor() {
		this.tocSel = document.getElementById("TOCSel");
		this.entryField = document.getElementById("EntryField");
		this.searchButton = document.getElementById("SearchButton");
		this.gSearchButton = document.getElementById("GSearchButton");
		this.URL = 0;
		this.OFFSET = 1;
		this.ENTRIES = 2;
	}
}

const G = new GlobalManager();
const R = new RegulatorNeo();

const header = document.createElement("option");
header. name = "";
header.value = -1;
G.tocSel.appendChild(header);

for (let i = 1; i < preamble.length; i++) {
	const elem = document.createElement("option");
	elem.text = preamble[i][0];
	elem.value = preamble[i][1];
	G.tocSel.appendChild(elem);
}
for (let i = 1; i < postamble.length; i++) {
	const elem = document.createElement("option");
	elem.text = postamble[i][0];
	elem.value = postamble[i][1];
	G.tocSel.appendChild(elem);
}
const elem = document.createElement("option");
elem.disabled = true;
elem.innerHTML = '−・−・−・−・−・−・−・−・−・−';
G.tocSel.appendChild(elem);
for (let i = 1; i < yaPreamble.length; i++) {
	const elem = document.createElement("option");
	elem.text = yaPreamble[i][0];
	elem.value = yaPreamble[i][1];
	G.tocSel.appendChild(elem);
}

G.entryField.addEventListener("keydown", (evt) => {
	if (evt.key === "Enter" && !evt.isComposing) {
		evt.preventDefault();
		indexSearch();
	} else if (evt.key === "Escape") {
		G.entryField.value = "";
	}
	G.entryField.focus();
});

G.entryField.focus();
testConsistency();

function tocChange(val) {
	if (val == -1)  return;
	G.entryField.value = "";
	G.entryField.focus();
	if (G.tocSel.selectedIndex < 8) {
		if (val < 200) {
			windowOpen(preamble[G.URL], val);
		} else {
			windowOpen(postamble[G.URL], val);
		}
	} else {
		// 現代編
		windowOpen(yaPreamble[G.URL], val);
	}
}

function indexSearch() {
	G.tocSel.selectedIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	let vol = fullIndex.length - 1;
	while (vol >= 0) {
		for (let entIdx = fullIndex[vol][G.ENTRIES].length-1; entIdx >=0; entIdx--) {
			if (R.compare(target, fullIndex[vol][G.ENTRIES][entIdx]) >= 0) {
				windowOpen(fullIndex[vol][G.URL], (fullIndex[vol][G.OFFSET]+entIdx));
				 return;
			}
		}
		vol--;
	}
}

function gIndexSearch() {
	G.tocSel.selectedIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	let vol = vol7Index.length - 1;
	while (vol >= 0) {
		for (let entIdx = vol7Index[vol][G.ENTRIES].length-1; entIdx >=0; entIdx--) {
			if (R.compare(target, vol7Index[vol][G.ENTRIES][entIdx]) >= 0) {
				windowOpen(vol7Index[vol][G.URL], (vol7Index[vol][G.OFFSET]+entIdx));
				 return;
			}
		}
		vol--;
	}
}

function windowOpen(url, page) {
	window.open(url + page, "検索結果");
	G.entryField.focus();
}

function clearField() {
	G.tocSel.selectedIndex = 0;
	G.entryField.value = "";
	G.entryField.focus();
}

function testConsistency() {
	let value = "";
	for (let vol = 0; vol < fullIndex.length; vol++) {
		for (let ent = 0; ent < fullIndex[vol][G.ENTRIES].length; ent++) {
			if (R.compare(value, fullIndex[vol][G.ENTRIES][ent]) > 0) {
				console.log(`${value} : ${fullIndex[vol][G.ENTRIES][ent]}`);
			}
			value = fullIndex[vol][G.ENTRIES][ent];
		}
	}
	value = "";
	for (let vol = 0; vol < vol7Index.length; vol++) {
		for (let ent = 0; ent < vol7Index[vol][G.ENTRIES].length; ent++) {
			if (R.compare(value, vol7Index[vol][G.ENTRIES][ent]) > 0) {
				console.log(`${value} : ${vol7Index[vol][G.ENTRIES][ent]}`);
			}
			value = vol7Index[vol][G.ENTRIES][ent];
		}
	}
}

function iAmBored() {
	G.entryField.value = "";
	G.entryField.focus();
	let volNo = fullIndex.length - 1;
	while (fullIndex[volNo][G.ENTRIES].length == 0) {
		volNo--;
	}
	volNo++;
	const randomVol = Math.trunc(Math.random() * volNo);
	const offset = fullIndex[randomVol][G.OFFSET];
	const randomPage = Math.trunc(Math.random() * fullIndex[randomVol][G.ENTRIES].length) + offset;
	windowOpen(fullIndex[randomVol][G.URL], randomPage);
}
