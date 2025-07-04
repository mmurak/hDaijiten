class GlobalManager {
	constructor() {
		this.tocSel = document.getElementById("TOCSel");
		this.entryField = document.getElementById("EntryField");
		this.searchButton = document.getElementById("SearchButton");
		this.URL = 0;
		this.OFFSET = 1;
		this.ENTRIES = 2;
	}
}

// copied from another file (temporary)
class Regulator {
	constructor() {
		this.conversionTable = {
			ー: "-",
			あ: "あ", ぁ: "あ",
			い: "い", ぃ: "い",
			う: "う", ゔ: "う", ぅ: "う",
			え: "え", ぇ: "え",
			お: "お", ぉ: "お",
			か: "か", が: "か", ゕ: "か",
			き: "き", ぎ: "き",
			く: "く", ぐ: "く",
			け: "け", げ: "け", ゖ: "け",
			こ: "こ", ご: "こ",
			さ: "さ", ざ: "さ",
			し: "し", じ: "し",
			す: "す", ず: "す",
			せ: "せ", ぜ: "せ",
			そ: "そ", ぞ: "そ",
			た: "た", だ: "た",
			ち: "ち", ぢ: "ち",
			つ: "つ", づ: "す", っ: "つ",
			て: "て", で: "て",
			と: "と", ど: "と",
			な: "な", 
			に: "に",
			ぬ: "ぬ",
			ね: "ね",
			の: "の",
			は: "は", ば: "は", ぱ: "は",
			ひ: "ひ", び: "ひ", ぴ: "ひ",
			ふ: "ふ", ぶ: "ふ", ぷ: "ふ",
			へ: "へ", べ: "へ", ぺ: "へ",
			ほ: "ほ", ぼ: "ほ", ぽ: "ほ",
			ま: "ま",
			み: "み",
			む: "む",
			め: "め",
			も: "も",
			や: "や", ゃ: "や",
			ゆ: "ゆ", ゅ: "ゆ",
			よ: "よ", ょ: "よ",
			ら: "ら",
			り: "り",
			る: "る",
			れ: "れ",
			ろ: "ろ",
			わ: "わ", ゎ: "わ",
			ん: "ん",
		};
	}
	regulate(str) {
		let result = "";
		let illegalStr = "";
		let ar = str.split("");
		for (let i = 0; i < ar.length; i++) {
			if (ar[i] in this.conversionTable) {
				result += this.conversionTable[ar[i]];
			} else {
				illegalStr += ar[i];
			}
		}
		if (illegalStr != "") {
			alert("'" + illegalStr + "' は使用できません。該当文字抜きで検索します。");
		}
		return result;
	}
}		// end of Regulator

const G = new GlobalManager();
const R = new Regulator();

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


document.addEventListener("keyup", function(evt) {
	if (evt.key == "Enter") {
		search();
	} else if (evt.key == "Escape") {
		G.entryField.value = "";
		G.entryField.focus();
	}
}, false);

G.entryField.focus();

function tocChange(val) {
	if (val == -1)  return;
	G.entryField.value = "";
	G.entryField.focus();
	if (G.tocSel.selectedIndex >= 4) {
		windowOpen(postamble[G.URL], val);
	} else {
		windowOpen(preamble[G.URL], val);
	}
}

function search() {
	G.tocSel.selectedIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	target = R.regulate(target);
	if (target == "") {
		alert("ひらがなで検索語を入力してください。")
		return;
	}
	const volNo = getVol(target);
	const page = findPage(volNo, target);
	windowOpen(fullIndex[volNo][G.URL], page);
}

function getVol(value) {
	let volNo = fullIndex.length - 1;
	while (fullIndex[volNo][G.ENTRIES].length == 0) {
		volNo--;
	}
	while (fullIndex[volNo][G.ENTRIES][0] > value) {
		volNo--;
	}
	return volNo;
}

function findPage(volNo, target) {
	const entries = fullIndex[volNo][G.ENTRIES];
	let idx = entries.length - 1;
	while(entries[idx] > target) {
		idx--;
	}
	return idx + fullIndex[volNo][G.OFFSET];
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
